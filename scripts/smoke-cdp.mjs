import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const baseUrl = process.env.SILIKAR_BASE_URL ?? "http://127.0.0.1:5173";
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

const chromePath = chromeCandidates.find((candidate) => existsSync(candidate));

if (!chromePath) {
  throw new Error("Chrome atau Edge tidak ditemukan untuk smoke test.");
}

const debugPort = Number(process.env.SILIKAR_CDP_PORT ?? "9223");
const userDataDir = mkdtempSync(join(tmpdir(), "silikar-cdp-"));
const errors = [];
const flows = {
  owner: [
    "/",
    "/pilih-peran",
    "/masuk",
    "/pemilik/kondisi",
    "/pemilik/prediksi",
    "/pemilik/rute",
    "/pemilik/pengisian",
    "/",
  ],
  developer: [
    "/",
    "/pilih-peran",
    "/masuk",
    "/pengembang/bahan",
    "/pengembang/kembaran",
    "/pengembang/ai",
    "/pengembang/evaluasi",
    "/",
  ],
  tester: [
    "/",
    "/pilih-peran",
    "/masuk",
    "/penguji/mutu",
    "/penguji/keselamatan",
    "/penguji/daur-hidup",
    "/penguji/kelayakan",
    "/",
  ],
};

const browser = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    "--window-size=390,844",
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);

let browserLog = "";
browser.stderr.on("data", (chunk) => {
  browserLog += chunk.toString();
});

try {
  const websocketUrl = await waitForWebsocketUrl(debugPort);
  const cdp = await connectCdp(websocketUrl);

  cdp.onEvent((message) => {
    if (message.method === "Runtime.exceptionThrown") {
      errors.push(message.params.exceptionDetails.text);
    }

    if (
      message.method === "Runtime.consoleAPICalled" &&
      message.params.type === "error"
    ) {
      errors.push(
        message.params.args.map((arg) => arg.value ?? arg.description).join(" "),
      );
    }

    if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
      errors.push(message.params.entry.text);
    }
  });

  await cdp.send("Runtime.enable");
  await cdp.send("Page.enable");
  await cdp.send("Log.enable");
  await setMobileViewport(cdp);

  for (const role of Object.keys(flows)) {
    await runRoleFlow(cdp, role, flows[role]);
  }

  await assertNoHorizontalOverflow(cdp);

  await setDesktopViewport(cdp);
  await navigate(cdp, `${baseUrl}/`);
  await waitForText(cdp, "SILIKAR-SUMUT dirancang sebagai aplikasi seluler.");
  await click(cdp, ".desktop-gate__button");
  await waitForSelector(cdp, ".phone-frame");
  await waitForText(cdp, "SILIKAR-SUMUT");

  if (errors.length > 0) {
    throw new Error(`Console errors:\n${errors.join("\n")}`);
  }

  console.log("CDP smoke test OK");
  console.log("Role flows: owner=7, developer=7, tester=7");
  console.log("Desktop gate OK");
} finally {
  browser.kill();
}

async function runRoleFlow(cdp, role, expectedPaths) {
  await setMobileViewport(cdp);
  await navigate(cdp, `${baseUrl}/`);
  await assertPath(cdp, expectedPaths[0]);
  await assertNoHorizontalOverflow(cdp);
  await click(cdp, ".primary-button");
  await assertPath(cdp, expectedPaths[1]);
  await assertNoHorizontalOverflow(cdp);
  await evaluate(
    cdp,
    `
    (() => {
      localStorage.removeItem("silikar-sumut-role");
      const select = document.querySelector("#role-picker");
      select.value = ${JSON.stringify(role)};
      select.dispatchEvent(new Event("change", { bubbles: true }));
    })()
    `,
  );
  await delay(100);

  for (let index = 2; index < expectedPaths.length; index += 1) {
    await click(cdp, ".primary-button");
    await assertPath(cdp, expectedPaths[index]);
    await assertNoHorizontalOverflow(cdp);
  }

  const pageCount = expectedPaths.length - 1;
  if (pageCount !== 7) {
    throw new Error(`Alur ${role} berisi ${pageCount} halaman, bukan 7.`);
  }
}

async function assertNoHorizontalOverflow(cdp) {
  const overflow = await evaluate(
    cdp,
    `
    (() => {
      const screen = document.querySelector("#mobile-scroll");
      const rootOverflow = screen && screen.scrollWidth > screen.clientWidth + 1
        ? {
            selector: "#mobile-scroll",
            scrollWidth: screen.scrollWidth,
            clientWidth: screen.clientWidth,
          }
        : null;
      const elementOverflow = Array.from(document.querySelectorAll("*"))
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === "string" ? element.className : "",
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
        }))
        .find((item) => item.clientWidth > 0 && item.scrollWidth > item.clientWidth + 1);

      return rootOverflow ?? elementOverflow ?? null;
    })()
    `,
  );

  if (overflow) {
    throw new Error(
      `Horizontal overflow pada ${overflow.selector ?? `${overflow.tag}.${overflow.className}`}: ${overflow.scrollWidth} > ${overflow.clientWidth}`,
    );
  }
}

async function waitForWebsocketUrl(port) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const payload = await response.json();
      const page = payload.find((target) => target.type === "page");

      if (page?.webSocketDebuggerUrl) {
        return page.webSocketDebuggerUrl;
      }
    } catch {
      await delay(100);
    }
  }

  throw new Error(`Tidak bisa tersambung ke Chrome DevTools pada port ${port}.`);
}

async function connectCdp(websocketUrl) {
  const socket = new WebSocket(websocketUrl);
  const pending = new Map();
  const listeners = new Set();
  let nextId = 1;

  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }
      return;
    }

    for (const listener of listeners) {
      listener(message);
    }
  });

  return {
    send(method, params = {}) {
      const id = nextId;
      nextId += 1;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
    },
    onEvent(listener) {
      listeners.add(listener);
    },
  };
}

async function setMobileViewport(cdp) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });
}

async function setDesktopViewport(cdp) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1200,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
}

async function navigate(cdp, url) {
  await cdp.send("Page.navigate", { url });
  await waitForSelector(cdp, ".app-screen, .desktop-gate");
}

async function click(cdp, selector) {
  await evaluate(
    cdp,
    `
    (() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!element) throw new Error("Selector tidak ditemukan: ${selector}");
      element.click();
    })()
    `,
  );
  await delay(180);
}

async function assertPath(cdp, expectedPath) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const path = await evaluate(cdp, "location.pathname");
    if (path === expectedPath) {
      return;
    }
    await delay(75);
  }

  const actualPath = await evaluate(cdp, "location.pathname");
  throw new Error(`Path aktual ${actualPath}, seharusnya ${expectedPath}.`);
}

async function waitForSelector(cdp, selector) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const found = await evaluate(
      cdp,
      `Boolean(document.querySelector(${JSON.stringify(selector)}))`,
    );
    if (found) {
      return;
    }
    await delay(75);
  }

  throw new Error(`Selector tidak muncul: ${selector}`);
}

async function waitForText(cdp, expectedText) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const found = await evaluate(
      cdp,
      `document.body.innerText.includes(${JSON.stringify(expectedText)})`,
    );
    if (found) {
      return;
    }
    await delay(75);
  }

  throw new Error(`Teks tidak muncul: ${expectedText}`);
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (result.exceptionDetails) {
    throw new Error(
      result.exceptionDetails.exception?.description ??
        result.exceptionDetails.text ??
        "Evaluasi browser gagal.",
    );
  }

  return result.result.value;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

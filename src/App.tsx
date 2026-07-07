import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  Car,
  CheckCircle2,
  ChevronRight,
  CircuitBoard,
  Factory,
  FlaskConical,
  Gauge,
  Leaf,
  MapPin,
  Network,
  Route as RouteIcon,
  ShieldCheck,
  Smartphone,
  ThermometerSun,
  Zap,
} from "lucide-react";
import {
  DetailItem,
  Metric,
  RoleId,
  ScreenData,
  SectionData,
  homeData,
  loginData,
  roleOrder,
  roles,
  scenarioScreens,
  splashData,
} from "./data/scenarios";

const STORAGE_KEY = "silikar-sumut-role";
const dummyLabel = "DATA DUMMY - SIMULASI";
const mockupMessage =
  "Interaksi ini hanya mockup dan sedang dalam tahap development.";

type MockupNoticeState = {
  id: number;
  message: string;
} | null;

function isRoleId(value: string | null): value is RoleId {
  return value === "owner" || value === "developer" || value === "tester";
}

function readStoredRole(): RoleId | null {
  const value = window.localStorage.getItem(STORAGE_KEY);
  return isRoleId(value) ? value : null;
}

function App() {
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(() =>
    readStoredRole(),
  );
  const [mockupNotice, setMockupNotice] = useState<MockupNoticeState>(null);

  useEffect(() => {
    if (!mockupNotice) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setMockupNotice(null);
    }, 2400);

    return () => window.clearTimeout(timeout);
  }, [mockupNotice]);

  const saveRole = (role: RoleId) => {
    window.localStorage.setItem(STORAGE_KEY, role);
    setSelectedRole(role);
  };

  const showMockupNotice = (message = mockupMessage) => {
    setMockupNotice({ id: Date.now(), message });
  };

  return (
    <ResponsiveShell notice={mockupNotice} onMockupNotice={showMockupNotice}>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={<SplashPage onMockupNotice={showMockupNotice} />}
        />
        <Route
          path="/pilih-peran"
          element={
            <HomePage
              selectedRole={selectedRole}
              onSelectRole={saveRole}
              onMockupNotice={showMockupNotice}
            />
          }
        />
        <Route
          path="/masuk"
          element={
            <LoginPage
              selectedRole={selectedRole}
              onMockupNotice={showMockupNotice}
            />
          }
        />
        {scenarioScreens.map((screen) => (
          <Route
            key={screen.route}
            path={screen.route}
            element={
              <ScenarioPage
                screen={screen}
                selectedRole={selectedRole}
                onMockupNotice={showMockupNotice}
              />
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ResponsiveShell>
  );
}

function ResponsiveShell({
  children,
  notice,
  onMockupNotice,
}: {
  children: React.ReactNode;
  notice: MockupNoticeState;
  onMockupNotice: () => void;
}) {
  const [isWide, setIsWide] = useState(() =>
    window.matchMedia("(min-width: 769px)").matches,
  );
  const [showMobile, setShowMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 769px)");
    const update = () => setIsWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (isWide && !showMobile) {
    return (
      <main className="desktop-gate">
        <section className="desktop-gate__panel">
          <div className="desktop-gate__icon">
            <Smartphone size={34} />
          </div>
          <p className="desktop-gate__brand">SILIKAR-SUMUT</p>
          <h1>SILIKAR-SUMUT dirancang sebagai aplikasi seluler.</h1>
          <button
            type="button"
            className="desktop-gate__button"
            onClick={() => {
              onMockupNotice();
              setShowMobile(true);
            }}
          >
            Buka Versi Seluler
            <ArrowRight size={18} />
          </button>
        </section>
        <MockupNotice notice={notice} />
      </main>
    );
  }

  return (
    <main className={isWide ? "desktop-preview" : "mobile-root"}>
      <div className="phone-frame">
        <div className="phone-speaker" />
        <div id="mobile-scroll" className="phone-screen">
          {children}
        </div>
        <MockupNotice notice={notice} />
      </div>
    </main>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.getElementById("mobile-scroll")?.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return null;
}

function HomePage({
  selectedRole,
  onSelectRole,
  onMockupNotice,
}: {
  selectedRole: RoleId | null;
  onSelectRole: (role: RoleId) => void;
  onMockupNotice: () => void;
}) {
  const navigate = useNavigate();
  const activeRole = selectedRole ?? "owner";
  const role = roles[activeRole];

  const startFlow = () => {
    onSelectRole(activeRole);
    navigate(loginData.route);
  };

  return (
    <PageShell
      roleLabel={role.label}
      stageLabel="Laman utama"
      title={homeData.title}
      subtitle={homeData.subtitle}
      description={homeData.description}
      buttonLabel={`Mulai sebagai ${role.label}`}
      onNext={startFlow}
      onMockupNotice={onMockupNotice}
    >
      <InfoCard title="Alur ekosistem" visual="home-flow" flow={homeData.flow} />
      <MetricsCard title="Data awal" metrics={homeData.metrics} />
      <InfoCard title="Ringkasan" rows={homeData.summary} />
      <section className="data-card role-picker-card" aria-label="Pilihan peran">
        <div className="card-heading">
          <span>Pilih peran</span>
          <span className="soft-chip">Tersimpan lokal</span>
        </div>
        <label className="select-label" htmlFor="role-picker">
          Peran simulasi
        </label>
        <select
          id="role-picker"
          value={activeRole}
          onChange={(event) => {
            onSelectRole(event.target.value as RoleId);
          }}
        >
          {roleOrder.map((roleId) => (
            <option key={roleId} value={roleId}>
              {roles[roleId].label}
            </option>
          ))}
        </select>
      </section>
    </PageShell>
  );
}

function SplashPage({ onMockupNotice }: { onMockupNotice: () => void }) {
  const navigate = useNavigate();

  return (
    <PageShell
      roleLabel="Semua Peran"
      stageLabel="Splash"
      title={splashData.title}
      subtitle={splashData.subtitle}
      description={splashData.description}
      buttonLabel={splashData.buttonLabel}
      onNext={() => navigate(splashData.nextRoute)}
      onMockupNotice={onMockupNotice}
    >
      <InfoCard
        title="Gagasan utama"
        visual="splash-idea"
        flow={splashData.flow}
        text="SILIKAR-SUMUT membayangkan baterai yang tidak hanya menyimpan energi, tetapi juga menjelaskan asal material, kondisi sel, dan rekomendasi perawatan."
      />
      <MetricsCard title="Fokus purwarupa" metrics={splashData.metrics} />
      <InfoCard
        title="Arah integrasi"
        rows={[
          { label: "Material", value: "Silikon-karbon dari limbah sawit" },
          { label: "Digital", value: "Sensor dan kembaran digital baterai" },
          { label: "Aplikasi", value: "Tampilan ringkas untuk setiap peran" },
        ]}
      />
    </PageShell>
  );
}

function LoginPage({
  selectedRole,
  onMockupNotice,
}: {
  selectedRole: RoleId | null;
  onMockupNotice: () => void;
}) {
  const navigate = useNavigate();

  if (!selectedRole) {
    return <Navigate to={homeData.route} replace />;
  }

  const role = roles[selectedRole];

  return (
    <PageShell
      roleLabel={role.label}
      stageLabel="Laman masuk"
      title={loginData.title}
      subtitle="Semua data akun otomatis terisi dan bersifat read-only."
      description={loginData.description}
      buttonLabel={loginData.buttonLabel}
      onNext={() => navigate(role.firstRoute)}
      onMockupNotice={onMockupNotice}
    >
      <section className="account-card data-card" aria-label="Akun simulasi">
        <div className="account-card__top">
          <div className="account-avatar">{role.compactLabel.charAt(0)}</div>
          <div>
            <p className="account-role">{role.label}</p>
            <p className="account-note">Akun demo siap pakai</p>
          </div>
        </div>
        <Rows rows={role.account} />
      </section>
    </PageShell>
  );
}

function ScenarioPage({
  screen,
  selectedRole,
  onMockupNotice,
}: {
  screen: ScreenData;
  selectedRole: RoleId | null;
  onMockupNotice: () => void;
}) {
  const navigate = useNavigate();

  if (!selectedRole || selectedRole !== screen.role) {
    return <Navigate to={homeData.route} replace />;
  }

  const role = roles[screen.role];

  return (
    <PageShell
      roleLabel={role.label}
      stageLabel={`Tahap ${screen.step} dari 4`}
      title={screen.title}
      description={screen.description}
      buttonLabel={screen.buttonLabel}
      onNext={() => navigate(screen.nextRoute)}
      onMockupNotice={onMockupNotice}
    >
      <MetricsCard title={screen.metricTitle ?? "Data utama"} metrics={screen.metrics} />
      {screen.cards.map((card) => (
        <InfoCard key={card.title} {...card} />
      ))}
    </PageShell>
  );
}

function PageShell({
  roleLabel,
  stageLabel,
  title,
  subtitle,
  description,
  buttonLabel,
  onNext,
  onMockupNotice,
  children,
}: {
  roleLabel: string;
  stageLabel: string;
  title: string;
  subtitle?: string;
  description: string;
  buttonLabel: string;
  onNext: () => void;
  onMockupNotice: () => void;
  children: React.ReactNode;
}) {
  const handleScreenClick = (event: React.MouseEvent<HTMLElement>) => {
    const clickedButton = (event.target as HTMLElement).closest("button");

    if (clickedButton && !clickedButton.classList.contains("primary-button")) {
      onMockupNotice();
    }
  };

  return (
    <article className="app-screen" onClickCapture={handleScreenClick}>
      <header className="app-header">
        <div>
          <p className="brand">SILIKAR-SUMUT</p>
          <div className="label-row">
            <span className="role-label">Peran: {roleLabel}</span>
            <span className="dummy-label">{dummyLabel}</span>
          </div>
        </div>
        <span className="stage-label">{stageLabel}</span>
      </header>

      <section className="title-block">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </section>

      <div className="card-stack">{children}</div>

      <p className="screen-explanation">{description}</p>

      <div className="action-area">
        <button type="button" className="primary-button" onClick={onNext}>
          <span>{buttonLabel}</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </article>
  );
}

function MockupNotice({ notice }: { notice: MockupNoticeState }) {
  if (!notice) {
    return null;
  }

  return (
    <div key={notice.id} className="mockup-notice" role="status" aria-live="polite">
      <AlertTriangle size={16} />
      <span>{notice.message}</span>
    </div>
  );
}

function MetricsCard({ title, metrics }: { title: string; metrics: Metric[] }) {
  return (
    <section className="data-card metrics-card" aria-label={title}>
      <div className="card-heading">
        <span>{title}</span>
        <Gauge size={16} />
      </div>
      <div className="metric-grid">
        {metrics.map((metric) => (
          <MetricTile key={`${metric.label}-${metric.value}`} metric={metric} />
        ))}
      </div>
    </section>
  );
}

function MetricTile({ metric }: { metric: Metric }) {
  const StatusIcon = getStatusIcon(metric.status);

  return (
    <div className={`metric-tile ${metric.status ? `is-${metric.status}` : ""}`}>
      <div className="metric-tile__top">
        <span>{metric.label}</span>
        <StatusIcon size={14} />
      </div>
      <strong>{metric.value}</strong>
    </div>
  );
}

function InfoCard({
  title,
  text,
  rows,
  metrics,
  bullets,
  flow,
  timeline,
  visual,
  status,
  note,
}: SectionData) {
  return (
    <section className="data-card info-card" aria-label={title}>
      <div className="card-heading">
        <span>{title}</span>
        <SectionIcon title={title} visual={visual} />
      </div>
      {visual ? <StaticVisual kind={visual} flow={flow} /> : null}
      {!visual && flow ? <FlowDiagram flow={flow} /> : null}
      {text ? <p className="card-text">{text}</p> : null}
      {rows ? <Rows rows={rows} /> : null}
      {metrics ? <InlineMetrics metrics={metrics} /> : null}
      {bullets ? <BulletList bullets={bullets} /> : null}
      {timeline ? <Timeline items={timeline} /> : null}
      {status ? <p className="status-banner">{status}</p> : null}
      {note ? <p className="card-note">{note}</p> : null}
    </section>
  );
}

function Rows({ rows }: { rows: DetailItem[] }) {
  return (
    <dl className="row-list">
      {rows.map((row) => (
        <div key={`${row.label}-${row.value}`} className="data-row">
          <dt>{row.label}</dt>
          <dd className={row.status ? `status-text is-${row.status}` : ""}>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function InlineMetrics({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="inline-metrics">
      {metrics.map((metric) => (
        <div key={`${metric.label}-${metric.value}`} className="inline-metric">
          <span>{metric.label}</span>
          <strong className={metric.status ? `status-text is-${metric.status}` : ""}>
            {metric.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <ul className="bullet-list">
      {bullets.map((bullet) => (
        <li key={bullet}>
          <CheckCircle2 size={14} />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

function Timeline({ items }: { items: string[] }) {
  return (
    <ol className="timeline-list">
      {items.map((item) => (
        <li key={item}>
          <span className="timeline-dot" />
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function StaticVisual({
  kind,
  flow,
}: {
  kind: NonNullable<SectionData["visual"]>;
  flow?: string[];
}) {
  if (kind === "splash-idea") {
    return <SplashIdeaVisual flow={flow ?? []} />;
  }

  if (kind === "home-flow") {
    return <HomeFlow flow={flow ?? []} />;
  }

  if (kind === "cell-heat") {
    return (
      <div className="cell-heat-chart" aria-label="Grafik suhu kelompok sel">
        <span style={{ height: "42%" }} />
        <span style={{ height: "47%" }} />
        <span className="is-warning" style={{ height: "78%" }} />
        <span style={{ height: "42%" }} />
      </div>
    );
  }

  if (kind === "route-map") {
    return (
      <div className="route-map" aria-label="Peta statis Medan ke Berastagi">
        <div className="route-point route-point--start">
          <MapPin size={16} />
          <span>Medan</span>
        </div>
        <div className="route-line">
          <RouteIcon size={20} />
        </div>
        <div className="route-point route-point--end">
          <MapPin size={16} />
          <span>Berastagi</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cost-bars" aria-label="Grafik biaya statis">
      <div>
        <span>Bahan komersial</span>
        <i style={{ width: "100%" }} />
      </div>
      <div>
        <span>Bahan SILIKAR</span>
        <i className="is-success" style={{ width: "74%" }} />
      </div>
    </div>
  );
}

function SplashIdeaVisual({ flow }: { flow: string[] }) {
  const icons = [Leaf, BatteryCharging, Car, Smartphone];

  return (
    <div className="splash-idea" aria-label="Visual gagasan SILIKAR-SUMUT">
      <div className="splash-idea__core">
        <div className="splash-idea__ring">
          <CircuitBoard size={30} />
        </div>
        <div>
          <strong>Kembaran Digital</strong>
          <span>SILIKAR-AI</span>
        </div>
      </div>
      <div className="splash-idea__flow">
        {flow.map((item, index) => {
          const Icon = icons[index] ?? Network;
          return (
            <div className="splash-node" key={item}>
              <Icon size={18} />
              <span>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HomeFlow({ flow }: { flow: string[] }) {
  const icons = [Leaf, BatteryCharging, Car, Smartphone];

  return (
    <div className="home-flow" aria-label="Ilustrasi alur SILIKAR-SUMUT">
      {flow.map((item, index) => {
        const Icon = icons[index] ?? Network;
        return (
          <div className="home-flow__item" key={item}>
            <div className="home-flow__icon">
              <Icon size={20} />
            </div>
            <span>{item}</span>
          </div>
        );
      })}
    </div>
  );
}

function FlowDiagram({ flow }: { flow: string[] }) {
  return (
    <div className="flow-diagram">
      {flow.map((item, index) => (
        <div className="flow-step" key={`${item}-${index}`}>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function SectionIcon({
  title,
  visual,
}: {
  title: string;
  visual?: SectionData["visual"];
}) {
  const lowerTitle = title.toLowerCase();

  if (visual === "home-flow") {
    return <Leaf size={16} />;
  }

  if (visual === "cell-heat" || lowerTitle.includes("suhu")) {
    return <ThermometerSun size={16} />;
  }

  if (visual === "route-map" || lowerTitle.includes("rute") || lowerTitle.includes("peta")) {
    return <RouteIcon size={16} />;
  }

  if (lowerTitle.includes("bahan") || lowerTitle.includes("mutu")) {
    return <FlaskConical size={16} />;
  }

  if (lowerTitle.includes("digital") || lowerTitle.includes("ai")) {
    return <CircuitBoard size={16} />;
  }

  if (lowerTitle.includes("status") || lowerTitle.includes("keselamatan")) {
    return <ShieldCheck size={16} />;
  }

  if (lowerTitle.includes("biaya")) {
    return <Zap size={16} />;
  }

  if (lowerTitle.includes("sumber") || lowerTitle.includes("teknologi")) {
    return <Factory size={16} />;
  }

  return <Activity size={16} />;
}

function getStatusIcon(status: Metric["status"]) {
  if (status === "success") {
    return CheckCircle2;
  }

  if (status === "warning") {
    return AlertTriangle;
  }

  return Activity;
}

export default App;

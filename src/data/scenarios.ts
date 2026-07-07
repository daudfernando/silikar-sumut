export type RoleId = "owner" | "developer" | "tester";

export interface Metric {
  label: string;
  value: string;
  status?: "normal" | "warning" | "success";
}

export interface DetailItem {
  label: string;
  value: string;
  status?: Metric["status"];
}

export interface SectionData {
  title: string;
  text?: string;
  rows?: DetailItem[];
  metrics?: Metric[];
  bullets?: string[];
  flow?: string[];
  timeline?: string[];
  visual?: "splash-idea" | "home-flow" | "cell-heat" | "route-map" | "cost-bars";
  status?: string;
  note?: string;
}

export interface ScreenData {
  route: string;
  role: RoleId;
  step: number;
  title: string;
  description: string;
  metrics: Metric[];
  buttonLabel: string;
  nextRoute: string;
  metricTitle?: string;
  cards: SectionData[];
}

export const roleOrder: RoleId[] = ["owner", "developer", "tester"];

export const roles: Record<
  RoleId,
  {
    label: string;
    compactLabel: string;
    firstRoute: string;
    account: DetailItem[];
  }
> = {
  owner: {
    label: "Pemilik Mobil Listrik",
    compactLabel: "Pemilik",
    firstRoute: "/pemilik/kondisi",
    account: [
      { label: "Nama", value: "Raka Pratama" },
      { label: "Kendaraan", value: "EV-SUMUT-01" },
      { label: "Modul", value: "SKS-2406-0038" },
      { label: "Wilayah", value: "Medan" },
      { label: "Kata sandi", value: "••••••••" },
    ],
  },
  developer: {
    label: "Tim Pengembang",
    compactLabel: "Pengembang",
    firstRoute: "/pengembang/bahan",
    account: [
      { label: "Nama", value: "Nabila Siregar" },
      { label: "Institusi", value: "Tim Pengembang USU–BRIN" },
      { label: "Identitas", value: "DEV-SKS-01" },
      { label: "Unit", value: "Material dan Sistem Energi" },
      { label: "Kata sandi", value: "••••••••" },
    ],
  },
  tester: {
    label: "Mitra Pengujian",
    compactLabel: "Penguji",
    firstRoute: "/penguji/mutu",
    account: [
      { label: "Nama", value: "Arif Ramadhan" },
      { label: "Institusi", value: "PLN UID Sumatera Utara–DLHK" },
      { label: "Identitas", value: "UJI-SKS-01" },
      { label: "Unit", value: "Pengujian Teknis dan Lingkungan" },
      { label: "Kata sandi", value: "••••••••" },
    ],
  },
};

export const splashData = {
  route: "/",
  title: "SILIKAR-SUMUT",
  subtitle:
    "Dari limbah sawit Sumatera Utara menjadi baterai cerdas untuk mobil listrik.",
  description:
    "Gagasan ini menyatukan material lokal, sensor, kembaran digital, dan aplikasi seluler dalam satu perjalanan energi bersih.",
  metrics: [
    { label: "Bahan awal", value: "Abu ketel dan cangkang sawit" },
    { label: "Inti digital", value: "Kembaran digital", status: "success" },
    { label: "Arah keputusan", value: "SILIKAR-AI", status: "success" },
  ] satisfies Metric[],
  flow: ["Limbah sawit", "Baterai", "Mobil listrik", "Aplikasi"],
  buttonLabel: "Mulai Jelajahi Gagasan",
  nextRoute: "/pilih-peran",
};

export const homeData = {
  route: "/pilih-peran",
  title: "Pilih Peran SILIKAR-SUMUT",
  subtitle:
    "Baterai limbah sawit yang mampu menjelaskan asal bahan, kondisi sel, dan kebutuhan perawatannya.",
  description:
    "Purwarupa ini memperlihatkan alur data dari bahan, sel, kendaraan, sampai keputusan perawatan.",
  metrics: [
    { label: "Komposisi awal", value: "20% silikon dan 80% karbon keras" },
    { label: "Keterlacakan material", value: "100%", status: "success" },
    { label: "Peta jalan", value: "5 tahun" },
  ] satisfies Metric[],
  flow: ["Limbah sawit", "Baterai", "Mobil listrik", "Aplikasi"],
  summary: [
    {
      label: "Apa",
      value: "Baterai silikon-karbon dari abu ketel dan cangkang sawit.",
    },
    {
      label: "Mengapa",
      value: "Data material, kondisi sel, pengisian, dan pengguna masih terpisah.",
    },
    {
      label: "Bagaimana",
      value: "Sensor, kembaran digital, SILIKAR-AI, dan aplikasi seluler.",
    },
  ] satisfies DetailItem[],
};

export const loginData = {
  route: "/masuk",
  title: "Masuk SILIKAR-SUMUT",
  description: "Akun simulasi sudah terisi otomatis sesuai peran terpilih.",
  buttonLabel: "Masuk ke Dasbor",
};

export const scenarioScreens: ScreenData[] = [
  {
    route: "/pemilik/kondisi",
    role: "owner",
    step: 1,
    title: "Kondisi Baterai",
    description: "Kelompok sel 3 memanas lebih cepat saat pengisian berulang.",
    metricTitle: "Data utama baterai",
    metrics: [
      { label: "Daya", value: "78%", status: "normal" },
      { label: "Kesehatan", value: "92%", status: "success" },
      { label: "Suhu rata-rata", value: "31°C", status: "normal" },
      { label: "Jarak tersisa", value: "286 km", status: "success" },
    ],
    cards: [
      {
        title: "Kelompok sel",
        visual: "cell-heat",
        rows: [
          { label: "Sel 1", value: "30°C — Normal", status: "normal" },
          { label: "Sel 2", value: "31°C — Normal", status: "normal" },
          { label: "Sel 3", value: "38°C — Perhatian", status: "warning" },
          { label: "Sel 4", value: "30°C — Normal", status: "normal" },
        ],
      },
      {
        title: "Sumber data",
        text: "DALY Smart BMS, DS18B20, INA219, dan CAN Bus.",
      },
    ],
    buttonLabel: "Analisis dengan SILIKAR-Health",
    nextRoute: "/pemilik/prediksi",
  },
  {
    route: "/pemilik/prediksi",
    role: "owner",
    step: 2,
    title: "Prediksi SILIKAR-Health",
    description:
      "Model membaca tegangan, arus, suhu, kapasitas, dQ/dV, dan dV/dQ.",
    metricTitle: "Hasil prediksi",
    metrics: [
      { label: "Penurunan 30 hari", value: "0,7%", status: "success" },
      { label: "Risiko panas", value: "Sedang", status: "warning" },
      { label: "Sisa umur", value: "6,8 tahun", status: "success" },
      { label: "Keyakinan model", value: "94%", status: "success" },
    ],
    cards: [
      {
        title: "Model",
        text: "1D-CNN–TCN–LSTM dengan mekanisme perhatian.",
      },
      {
        title: "Rekomendasi",
        text: "Batasi pengisian pada 85% dan gunakan arus sedang.",
        status: "Perawatan disarankan",
      },
      {
        title: "Catatan acuan",
        text: "R² 0,983 merupakan capaian acuan Rahman dkk. tahun 2026.",
      },
    ],
    buttonLabel: "Susun Rencana Perjalanan",
    nextRoute: "/pemilik/rute",
  },
  {
    route: "/pemilik/rute",
    role: "owner",
    step: 3,
    title: "SILIKAR-Route",
    description:
      "Model membaca jarak, tanjakan, suhu, kecepatan, akselerasi, GPS, OBD-II, dan CAN Bus.",
    metricTitle: "Rencana Medan → Berastagi",
    metrics: [
      { label: "Jarak", value: "120 km" },
      { label: "Kebutuhan energi", value: "27 kWh", status: "normal" },
      { label: "Daya saat berangkat", value: "85%", status: "success" },
      { label: "Perkiraan daya tiba", value: "24%", status: "warning" },
    ],
    cards: [
      {
        title: "Peta statis",
        visual: "route-map",
        rows: [{ label: "Model", value: "Gated Recurrent Unit atau GRU" }],
      },
      {
        title: "Rekomendasi",
        text: "Gunakan profil Menjaga Umur pada jalur menanjak.",
        note: "R² 0,9545 merupakan capaian acuan Valladolid dan Ortiz tahun 2026.",
      },
    ],
    buttonLabel: "Atur Pengisian Adaptif",
    nextRoute: "/pemilik/pengisian",
  },
  {
    route: "/pemilik/pengisian",
    role: "owner",
    step: 4,
    title: "Pengisian Adaptif",
    description:
      "Simulasi memakai 50 perjalanan Medan–Berastagi dan efisiensi energi 5%.",
    metricTitle: "Status pengisian",
    metrics: [
      { label: "Pengisian", value: "78% menuju 85%", status: "normal" },
      { label: "Profil", value: "Menjaga Umur", status: "success" },
      { label: "Waktu selesai", value: "42 menit" },
      { label: "Penyeimbangan sel", value: "Aktif", status: "success" },
    ],
    cards: [
      {
        title: "Paspor baterai",
        rows: [
          { label: "Kode", value: "SKS-2406-0038" },
          { label: "Asal", value: "Sumatera Utara" },
          { label: "Komposisi", value: "20:80" },
          { label: "Siklus", value: "428" },
        ],
      },
      {
        title: "Dampak dummy",
        metrics: [
          { label: "Energi dihemat", value: "67,5 kWh/tahun", status: "success" },
          {
            label: "Emisi dihindari",
            value: "41,88 kg CO₂e/tahun",
            status: "success",
          },
          {
            label: "Potensi 1.000 mobil",
            value: "41,88 ton CO₂e/tahun",
            status: "success",
          },
        ],
      },
    ],
    buttonLabel: "Selesai dan Kembali",
    nextRoute: "/",
  },
  {
    route: "/pengembang/bahan",
    role: "developer",
    step: 1,
    title: "Paspor Bahan SILIKAR",
    description:
      "Komposisi awal elektroda menggunakan silikon 20% dan karbon keras 80%.",
    metricTitle: "Ringkasan bahan",
    metrics: [
      { label: "Kemurnian silika", value: "96,2%", status: "success" },
      { label: "Kadar abu", value: "4,3%", status: "success" },
      { label: "Komposisi", value: "20:80", status: "normal" },
      { label: "Keterlacakan", value: "100%", status: "success" },
    ],
    cards: [
      {
        title: "Bahan pertama",
        rows: [
          { label: "Bahan", value: "Abu ketel sawit" },
          { label: "Pemasok", value: "PTPN IV PalmCo" },
          { label: "Kode", value: "ASH-PM-2406-017" },
          { label: "Kemurnian silika", value: "96,2%", status: "success" },
          { label: "Sasaran", value: "minimal 95%" },
        ],
      },
      {
        title: "Bahan kedua",
        rows: [
          { label: "Bahan", value: "Cangkang sawit" },
          { label: "Pemasok", value: "PTPN IV PalmCo" },
          { label: "Kode", value: "CKS-PM-2406-021" },
          { label: "Kadar abu", value: "4,3%", status: "success" },
          { label: "Sasaran", value: "maksimal 5%" },
        ],
      },
      {
        title: "Metode",
        bullets: [
          "XRF untuk kemurnian",
          "SEM dan BET untuk pori",
          "TGA untuk kadar abu",
          "Kode kelompok untuk keterlacakan",
        ],
      },
    ],
    buttonLabel: "Bentuk Kembaran Digital",
    nextRoute: "/pengembang/kembaran",
  },
  {
    route: "/pengembang/kembaran",
    role: "developer",
    step: 2,
    title: "Kembaran Digital Baterai",
    description:
      "Kembaran digital mengikat data material, sel, modul, dan aplikasi dalam satu alur.",
    metricTitle: "Struktur digital",
    metrics: [
      { label: "Material", value: "2 kelompok" },
      { label: "Sel", value: "16" },
      { label: "Kelompok sel", value: "4" },
      { label: "Modul", value: "1" },
    ],
    cards: [
      {
        title: "Teknologi dan alur",
        text: "Microsoft Azure Digital Twins berbasis DTDL v3.",
        flow: [
          "Sensor",
          "ESP32",
          "Azure IoT Hub",
          "Azure Event Grid",
          "Azure Functions",
          "Azure Digital Twins",
          "Aplikasi",
        ],
      },
      {
        title: "Status sinkronisasi",
        rows: [
          { label: "Keterlacakan", value: "100%", status: "success" },
          {
            label: "Peristiwa dummy",
            value: "Kelompok sel 3 mencapai 38°C pada pukul 14.32.",
            status: "warning",
          },
          { label: "Sinkronisasi", value: "Aktif", status: "success" },
          { label: "Pembaruan data", value: "3,2 detik", status: "success" },
          { label: "Sasaran", value: "maksimal 5 detik" },
        ],
      },
    ],
    buttonLabel: "Jalankan SILIKAR-AI",
    nextRoute: "/pengembang/ai",
  },
  {
    route: "/pengembang/ai",
    role: "developer",
    step: 3,
    title: "Validasi SILIKAR-AI",
    description:
      "Keputusan keselamatan tetap dijalankan oleh sistem pengelolaan baterai pada kendaraan.",
    metricTitle: "Ringkasan validasi",
    metrics: [
      { label: "Galat dummy", value: "8,6%", status: "success" },
      { label: "Sisa umur", value: "6,8 tahun", status: "success" },
      { label: "Energi rute", value: "27 kWh", status: "normal" },
      { label: "Batas sasaran", value: "maksimal 10%", status: "success" },
    ],
    cards: [
      {
        title: "SILIKAR-Health",
        rows: [
          { label: "Model", value: "1D-CNN–TCN–LSTM" },
          { label: "Fungsi", value: "kesehatan baterai" },
          { label: "Galat dummy", value: "8,6%", status: "success" },
          { label: "Sasaran", value: "maksimal 10%" },
        ],
      },
      {
        title: "SILIKAR-RUL",
        rows: [
          { label: "Model", value: "SSA-SCN" },
          { label: "Fungsi", value: "sisa umur baterai" },
          { label: "Hasil dummy", value: "6,8 tahun", status: "success" },
          { label: "Acuan", value: "RMSE 0,0036" },
        ],
      },
      {
        title: "SILIKAR-Route",
        rows: [
          { label: "Model", value: "GRU" },
          { label: "Fungsi", value: "energi perjalanan" },
          { label: "Hasil dummy", value: "27 kWh", status: "normal" },
          { label: "Acuan", value: "R² 0,9545" },
        ],
      },
    ],
    buttonLabel: "Evaluasi Sel dan Modul",
    nextRoute: "/pengembang/evaluasi",
  },
  {
    route: "/pengembang/evaluasi",
    role: "developer",
    step: 4,
    title: "Evaluasi Sel dan Modul",
    description:
      "Modul diteruskan kepada mitra pengujian untuk pemeriksaan teknis dan lingkungan.",
    metricTitle: "Hasil sel",
    metrics: [
      { label: "Kapasitas", value: "612 mAh/g", status: "success" },
      { label: "Sasaran kapasitas", value: "minimal 600 mAh/g" },
      { label: "Retensi 300 siklus", value: "81,4%", status: "success" },
      { label: "Sasaran retensi", value: "minimal 80%" },
    ],
    cards: [
      {
        title: "Hasil digital",
        rows: [
          { label: "Galat prediksi", value: "8,6%", status: "success" },
          { label: "Pembaruan data", value: "3,2 detik", status: "success" },
          { label: "Keterlacakan", value: "100%", status: "success" },
          {
            label: "Status",
            value: "Memenuhi sasaran simulasi",
            status: "success",
          },
        ],
      },
      {
        title: "Biaya",
        visual: "cost-bars",
        rows: [
          { label: "Bahan komersial", value: "Rp1.764.081" },
          { label: "Bahan SILIKAR", value: "Rp1.308.740" },
          { label: "Penghematan bahan", value: "25,81%", status: "success" },
          { label: "Penghematan gabungan", value: "10,69%", status: "success" },
        ],
      },
    ],
    buttonLabel: "Selesai dan Kembali",
    nextRoute: "/",
  },
  {
    route: "/penguji/mutu",
    role: "tester",
    step: 1,
    title: "Uji Mutu Material dan Sel",
    description: "Memenuhi sasaran mutu simulasi.",
    metricTitle: "Hasil mutu",
    metrics: [
      { label: "Kemurnian silika", value: "96,2%", status: "success" },
      { label: "Kadar abu karbon", value: "4,3%", status: "success" },
      { label: "Kapasitas", value: "612 mAh/g", status: "success" },
      { label: "Retensi 300 siklus", value: "81,4%", status: "success" },
    ],
    cards: [
      {
        title: "Sampel",
        rows: [
          { label: "Kode", value: "SKS-2406-UJI-08" },
          {
            label: "Institusi",
            value: "PLN UID Sumatera Utara–DLHK Sumatera Utara",
          },
        ],
      },
      {
        title: "Metode",
        bullets: [
          "XRF",
          "SEM–BET",
          "TGA",
          "Pengisian dan pengosongan galvanostatik",
          "EIS",
          "Sensor termal",
        ],
      },
      {
        title: "Status",
        status: "Memenuhi sasaran mutu simulasi.",
      },
    ],
    buttonLabel: "Lanjut Uji Keselamatan",
    nextRoute: "/penguji/keselamatan",
  },
  {
    route: "/penguji/keselamatan",
    role: "tester",
    step: 2,
    title: "Uji Keselamatan Modul",
    description: "Data ini belum merupakan hasil sertifikasi kendaraan.",
    metricTitle: "Respons keselamatan",
    metrics: [
      { label: "Waktu respons", value: "120 milidetik", status: "success" },
      { label: "Peringatan aplikasi", value: "Terkirim", status: "success" },
      { label: "Fungsi lokal", value: "Aktif", status: "success" },
      { label: "Status", value: "Lolos simulasi awal", status: "success" },
    ],
    cards: [
      {
        title: "Skenario dummy",
        rows: [
          { label: "Suhu 43°C", value: "arus diturunkan", status: "warning" },
          {
            label: "Tegangan 4,18 V",
            value: "pengisian diputus",
            status: "warning",
          },
          {
            label: "Selisih antarsel 0,04 V",
            value: "penyeimbangan diaktifkan",
            status: "normal",
          },
          {
            label: "Internet terputus 8 menit",
            value: "BMS dan ESP32 tetap bekerja",
            status: "success",
          },
        ],
      },
      {
        title: "Catatan",
        text: "Skenario ini dipakai untuk membaca respons awal sistem proteksi modul.",
        note: "Data ini belum merupakan hasil sertifikasi kendaraan.",
      },
    ],
    buttonLabel: "Nilai Dampak Daur Hidup",
    nextRoute: "/penguji/daur-hidup",
  },
  {
    route: "/penguji/daur-hidup",
    role: "tester",
    step: 3,
    title: "Penilaian Daur Hidup",
    description:
      "Nilai dapat diperbarui berdasarkan jumlah siklus, listrik, pemeliharaan, dan akhir masa pakai.",
    metricTitle: "Dampak utama",
    metrics: [
      { label: "Energi dihemat", value: "67,5 kWh/tahun", status: "success" },
      {
        label: "Emisi dihindari",
        value: "41,88 kg CO₂e/tahun",
        status: "success",
      },
      { label: "Penghematan bahan", value: "25,81%", status: "success" },
      { label: "Jejak material", value: "100%", status: "success" },
    ],
    cards: [
      {
        title: "SILIKAR-LCA",
        flow: [
          "Limbah sawit",
          "Pengolahan bahan",
          "Sel baterai",
          "Penggunaan",
          "Pemeliharaan",
          "Penggunaan kedua",
          "Daur ulang",
        ],
      },
      {
        title: "Teknologi",
        bullets: ["openLCA", "ecoinvent", "IPCC GWP100", "Azure Digital Twins"],
      },
      {
        title: "Satuan fungsional",
        text: "1 kWh energi yang disalurkan sepanjang masa pakai baterai.",
      },
    ],
    buttonLabel: "Buka Gerbang Kelayakan",
    nextRoute: "/penguji/kelayakan",
  },
  {
    route: "/penguji/kelayakan",
    role: "tester",
    step: 4,
    title: "Gerbang Kelayakan SILIKAR",
    description:
      "Lanjutkan pengujian bersama tim pengembang, PLN, DLHK, komunitas, dan pemilik mobil listrik.",
    metricTitle: "Penilaian akhir",
    metrics: [
      { label: "Teknis", value: "612 mAh/g dan retensi 81,4%", status: "success" },
      { label: "Digital", value: "Galat 8,6% dan pembaruan 3,2 detik", status: "success" },
      {
        label: "Lingkungan",
        value: "41,88 kg CO₂e dihindari per mobil per tahun",
        status: "success",
      },
      { label: "Ekonomi", value: "Penghematan gabungan 10,69%", status: "success" },
    ],
    cards: [
      {
        title: "Status utama",
        status: "LAYAK MELANJUTKAN PENGUJIAN TERKENDALI",
      },
      {
        title: "Peta jalan",
        timeline: [
          "Tahun 1: Pemetaan bahan",
          "Tahun 2: Sel dan sensor",
          "Tahun 3: Integrasi digital",
          "Tahun 4: Pengujian terkendali",
          "Tahun 5: Standardisasi",
        ],
      },
      {
        title: "Catatan",
        text: "Status ini belum merupakan izin produksi atau sertifikasi komersial.",
      },
    ],
    buttonLabel: "Selesai dan Kembali",
    nextRoute: "/",
  },
];

export const routeList = [
  splashData.route,
  homeData.route,
  loginData.route,
  ...scenarioScreens.map((screen) => screen.route),
];

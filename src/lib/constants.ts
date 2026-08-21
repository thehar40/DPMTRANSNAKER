export const SITE_TITLE =
  "Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara";

export const SITE_SHORT = "DPMTRANSNAKER ACEH UTARA";

export const SITE_TAGLINE =
  "Melayani dengan Profesional, Transparan, dan Akuntabel";

export const SITE_DESCRIPTION =
  "Situs resmi Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara. Informasi layanan perizinan, penanaman modal, transmigrasi, hubungan industrial, dan pelatihan kerja.";

export const NEWS_CATEGORIES = ["Pengumuman", "Kegiatan", "Layanan", "Umum"];

export const NEWS_CATEGORY_STYLES: Record<string, string> = {
  Pengumuman: "bg-blue-50 text-blue-700 ring-blue-200",
  Kegiatan: "bg-green-50 text-green-700 ring-green-200",
  Layanan: "bg-amber-50 text-amber-700 ring-amber-200",
  Umum: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const ICON_OPTIONS = [
  { value: "", label: "Bawaan (Landmark)" },
  { value: "Landmark", label: "Landmark" },
  { value: "Building2", label: "Gedung" },
  { value: "ClipboardCheck", label: "Clipboard Check" },
  { value: "ClipboardList", label: "Clipboard List" },
  { value: "FileText", label: "Dokumen" },
  { value: "Globe", label: "Globe" },
  { value: "TrendingUp", label: "Investasi" },
  { value: "BarChart3", label: "Grafik" },
  { value: "Truck", label: "Truk" },
  { value: "Construction", label: "Konstruksi" },
  { value: "Handshake", label: "Kerja Sama" },
  { value: "Scale", label: "Hukum" },
  { value: "GraduationCap", label: "Pelatihan" },
  { value: "Plane", label: "Plane" },
  { value: "Users", label: "Pengguna" },
  { value: "Briefcase", label: "Kerja" },
  { value: "Megaphone", label: "Pengumuman" },
];

export const DEFAULT_SETTINGS = {
  id: 1,
  agencyName: SITE_TITLE,
  shortName: SITE_SHORT,
  tagline: SITE_TAGLINE,
  address: "[Alamat dinas - ganti dengan alamat resmi]",
  phone: "[Nomor telepon dinas]",
  email: "[Email dinas]",
  whatsapp: "[Nomor WhatsApp dinas]",
  facebook: "[Facebook resmi]",
  instagram: "[Instagram resmi]",
  youtube: "[YouTube resmi]",
  mapEmbedUrl: null,
  officeHours: "Senin - Jumat, 08.00 - 16.00 WIB",
  createdAt: new Date(),
  updatedAt: new Date(),
};

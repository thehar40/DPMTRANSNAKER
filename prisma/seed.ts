import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Mulai mengisi data awal (seed)...");

  // ---------------------------------------------------------------
  // Pengaturan situs
  // ---------------------------------------------------------------
  const siteSetting = {
    agencyName:
      "Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara",
    shortName: "DPMPTTK Aceh Utara",
    tagline: "Melayani dengan Profesional, Transparan, dan Akuntabel",
    address: "[Alamat dinas - ganti dengan alamat resmi]",
    phone: "[Nomor telepon dinas]",
    email: "[Email dinas]",
    whatsapp: "[Nomor WhatsApp dinas]",
    facebook: "[Facebook resmi]",
    instagram: "[Instagram resmi]",
    youtube: "[YouTube resmi]",
    mapEmbedUrl: "[Link Google Maps]",
    officeHours: "Senin - Jumat, 08.00 - 16.00 WIB",
  };
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: siteSetting,
    create: { id: 1, ...siteSetting },
  });
  console.log("  ✓ SiteSetting");

  // ---------------------------------------------------------------
  // Konten profil (sambutan, visi misi, tupoksi, nilai pelayanan)
  // ---------------------------------------------------------------
  const profile = {
    welcomeTitle: "Sambutan Kepala Dinas",
    welcomeName: "[Nama Kepala Dinas]",
    welcomePosition:
      "Kepala Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara",
    welcomeText:
      "Assalamu'alaikum warahmatullahi wabarakatuh.\n\nSelamat datang di situs resmi Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara. Website ini kami hadirkan sebagai media informasi dan layanan bagi masyarakat, pelaku usaha, dan seluruh pemangku kepentingan.\n\nMelalui website ini, masyarakat dapat memperoleh informasi mengenai layanan perizinan berusaha, penanaman modal, transmigrasi, hubungan industrial, serta pelatihan kerja. Kami berkomitmen memberikan pelayanan yang profesional, transparan, dan akuntabel.\n\nKami menyadari website ini masih terus dikembangkan. Kritik dan saran yang membangun sangat kami harapkan demi peningkatan kualitas pelayanan publik.\n\nWassalamu'alaikum warahmatullahi wabarakatuh.",
    vision:
      "Terwujudnya pelayanan penanaman modal, ketransmigrasian, dan ketenagakerjaan yang profesional, transparan, dan akuntabel untuk kesejahteraan masyarakat Kabupaten Aceh Utara.",
    mission: [
      "Meningkatkan kualitas pelayanan perizinan dan nonperizinan secara terpadu satu pintu.",
      "Meningkatkan iklim penanaman modal dan realisasi investasi di Kabupaten Aceh Utara.",
      "Mengembangkan kawasan serta sarana dan prasarana transmigrasi.",
      "Meningkatkan pembinaan hubungan industrial dan perlindungan tenaga kerja.",
      "Meningkatkan kompetensi dan daya saing tenaga kerja melalui pelatihan.",
    ]
      .map((m) => `- ${m}`)
      .join("\n"),
    dutiesFunctions: [
      "Menyusun dan melaksanakan kebijakan di bidang penanaman modal, transmigrasi, dan tenaga kerja.",
      "Menyelenggarakan pelayanan perizinan berusaha dan nonperizinan secara terpadu satu pintu.",
      "Melaksanakan pembinaan, promosi, dan pengendalian penanaman modal.",
      "Melaksanakan pembangunan sarana dan prasarana kawasan transmigrasi.",
      "Melaksanakan pembinaan hubungan industrial dan persyaratan kerja.",
      "Melaksanakan pelatihan kerja dan peningkatan kompetensi tenaga kerja.",
      "Melaksanakan urusan ketatausahaan, perencanaan, keuangan, dan kepegawaian dinas.",
    ]
      .map((t) => `- ${t}`)
      .join("\n"),
    serviceValues: [
      "Profesional: Memberikan pelayanan sesuai standar dan kompetensi yang ditetapkan.",
      "Transparan: Informasi layanan terbuka, jelas, dan mudah diakses masyarakat.",
      "Akuntabel: Setiap pelayanan dapat dipertanggungjawabkan sesuai ketentuan.",
      "Responsif: Cepat tanggap terhadap kebutuhan dan pengaduan masyarakat.",
      "Integritas: Bekerja jujur, konsisten, dan bebas dari benturan kepentingan.",
    ]
      .map((v) => `- ${v}`)
      .join("\n"),
  };
  await prisma.profile.upsert({
    where: { id: 1 },
    update: profile,
    create: { id: 1, ...profile },
  });
  console.log("  ✓ Profile");

  // ---------------------------------------------------------------
  // User admin
  // ---------------------------------------------------------------
  const passwordHash = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { name: "Administrator", role: "admin" },
    create: {
      name: "Administrator",
      username: "admin",
      password: passwordHash,
      role: "admin",
    },
  });
  console.log("  ✓ User admin (username: admin)");

  // ---------------------------------------------------------------
  // Bidang / unit kerja
  // ---------------------------------------------------------------
  const divisions = [
    {
      slug: "sekretariat",
      name: "Sekretariat",
      abbreviation: "Sekretariat",
      description:
        "Unsur pembantu pimpinan yang melaksanakan urusan administrasi umum, koordinasi, perencanaan, keuangan, kepegawaian, dan tata usaha.",
      duties:
        "Melaksanakan koordinasi penyusunan program, pengelolaan keuangan, administrasi kepegawaian, umum, dan tata usaha dinas.",
      icon: "Building2",
      order: 1,
    },
    {
      slug: "pelayanan-terpadu-satu-pintu",
      name: "Bidang Pelayanan Terpadu Satu Pintu",
      abbreviation: "PTSP",
      description:
        "Bidang yang menangani pelayanan perizinan dan nonperizinan, termasuk layanan melalui OSS dan Sincantik.",
      duties:
        "Melaksanakan pelayanan perizinan berusaha dan nonperizinan secara terpadu satu pintu.",
      icon: "ClipboardCheck",
      order: 2,
    },
    {
      slug: "penanaman-modal",
      name: "Bidang Penanaman Modal",
      abbreviation: "PM",
      description:
        "Bidang yang menangani penanaman modal, promosi investasi, dan pelaporan kegiatan penanaman modal melalui LKPM Online.",
      duties:
        "Melaksanakan kebijakan, promosi, pengendalian, dan pelaporan penanaman modal.",
      icon: "TrendingUp",
      order: 3,
    },
    {
      slug: "transmigrasi",
      name: "Bidang Transmigrasi",
      abbreviation: "Transmigrasi",
      description:
        "Bidang yang menangani pembangunan sarana dan prasarana transmigrasi serta pengembangan kawasan transmigrasi.",
      duties:
        "Melaksanakan pembangunan dan pengembangan sarana serta prasarana transmigrasi.",
      icon: "Truck",
      order: 4,
    },
    {
      slug: "hubungan-industrial-dan-persyaratan-kerja",
      name: "Bidang Hubungan Industrial dan Persyaratan Kerja",
      abbreviation: "HI & PK",
      description:
        "Bidang yang menangani hubungan industrial, persyaratan kerja, perselisihan hubungan industrial, PKWT, AK1, dan isu CPMI.",
      duties:
        "Melaksanakan pembinaan hubungan industrial, persyaratan kerja, penyelesaian perselisihan, serta fasilitasi dokumen ketenagakerjaan.",
      icon: "Handshake",
      order: 5,
    },
    {
      slug: "uptd-blki",
      name: "UPTD BLKI",
      abbreviation: "BLKI",
      description:
        "Unit pelaksana teknis daerah balai latihan kerja yang melaksanakan pelatihan kompetensi tenaga kerja.",
      duties:
        "Melaksanakan pelatihan kompetensi dan peningkatan kualitas tenaga kerja.",
      icon: "GraduationCap",
      order: 6,
    },
  ];

  for (const d of divisions) {
    const data = {
      name: d.name,
      abbreviation: d.abbreviation,
      description: d.description,
      duties: d.duties,
      icon: d.icon,
      order: d.order,
    };
    await prisma.division.upsert({
      where: { slug: d.slug },
      update: data,
      create: { slug: d.slug, ...data },
    });
  }
  console.log(`  ✓ ${divisions.length} bidang`);

  // ---------------------------------------------------------------
  // Layanan
  // ---------------------------------------------------------------
  const services = [
    {
      divisionSlug: "pelayanan-terpadu-satu-pintu",
      slug: "perizinan-oss",
      name: "Perizinan OSS",
      description:
        "Pelayanan perizinan berusaha berbasis risiko melalui sistem OSS (Online Single Submission).",
      requirements: [
        "Nomor Induk Kependudukan (NIK) pemohon",
        "Alamat email aktif",
        "Nomor HP aktif",
        "Data usaha yang akan didaftarkan",
        "Dokumen pendukung sesuai jenis usaha",
      ]
        .map((r) => `- ${r}`)
        .join("\n"),
      procedures: [
        "Kunjungi situs resmi OSS di https://oss.go.id",
        "Buat akun OSS menggunakan NIK dan email aktif",
        "Lengkapi data usaha sesuai panduan pada sistem",
        "Isi data perizinan berusaha sesuai kebutuhan",
        "Periksa kembali seluruh data sebelum dikirim",
        "Unduh dokumen perizinan yang telah terbit",
      ]
        .map((p) => `1. ${p}`)
        .join("\n")
        .replace(/^1\.\s*/m, ""),
      externalUrl: "https://oss.go.id",
      externalButtonLabel: "Buka OSS",
      icon: "Globe",
      order: 1,
    },
    {
      divisionSlug: "pelayanan-terpadu-satu-pintu",
      slug: "sincantik",
      name: "Sincantik",
      description:
        "Layanan perizinan/nonperizinan melalui aplikasi Sincantik sesuai ketentuan daerah.",
      requirements: [
        "Kartu identitas pemohon",
        "Dokumen persyaratan sesuai jenis perizinan",
        "Alamat email dan nomor HP aktif",
      ]
        .map((r) => `- ${r}`)
        .join("\n"),
      procedures: [
        "Siapkan dokumen persyaratan sesuai jenis izin",
        "Datang ke loket pelayanan atau hubungi petugas PTSP",
        "Petugas memproses permohonan melalui aplikasi Sincantik",
        "Pemohon menerima bukti/tanda terima permohonan",
        "Pantau status permohonan bersama petugas",
      ]
        .map((p) => `1. ${p}`)
        .join("\n")
        .replace(/^1\.\s*/m, ""),
      externalUrl: "#",
      externalButtonLabel: "Buka Sincantik",
      icon: "ClipboardList",
      order: 2,
    },
    {
      divisionSlug: "penanaman-modal",
      slug: "lkpm-online",
      name: "LKPM Online",
      description:
        "Fasilitasi dan panduan pelaporan kegiatan penanaman modal melalui LKPM Online pada sistem OSS.",
      requirements: [
        "Nomor Induk Berusaha (NIB) perusahaan",
        "Akun OSS yang masih aktif",
        "Data perusahaan dan kegiatan usaha",
        "Data realisasi investasi sesuai periode pelaporan",
      ]
        .map((r) => `- ${r}`)
        .join("\n"),
      procedures: [
        "Masuk ke situs OSS di https://oss.go.id",
        "Pilih menu pelaporan LKPM",
        "Isi data realisasi kegiatan usaha sesuai periode",
        "Periksa kembali data yang telah diisi",
        "Kirim laporan sebelum batas waktu yang ditentukan",
      ]
        .map((p) => `1. ${p}`)
        .join("\n")
        .replace(/^1\.\s*/m, ""),
      externalUrl: "https://oss.go.id",
      externalButtonLabel: "Akses OSS",
      icon: "BarChart3",
      order: 1,
    },
    {
      divisionSlug: "transmigrasi",
      slug: "pembangunan-sarana-prasarana-transmigrasi",
      name: "Pembangunan Sarana dan Prasarana Transmigrasi",
      description:
        "Layanan informasi dan fasilitasi pembangunan sarana dan prasarana transmigrasi.",
      requirements: [
        "Informasi identitas pemohon/kelompok",
        "Lokasi atau kawasan transmigrasi terkait",
        "Dokumen pendukung sesuai kebutuhan program",
      ]
        .map((r) => `- ${r}`)
        .join("\n"),
      procedures: [
        "Sampaikan kebutuhan atau pertanyaan kepada Bidang Transmigrasi",
        "Petugas memverifikasi data dan lokasi terkait",
        "Dilakukan peninjauan/koordinasi sesuai ketentuan program",
        "Tindak lanjut pembangunan sarana dan prasarana sesuai perencanaan",
      ]
        .map((p) => `1. ${p}`)
        .join("\n")
        .replace(/^1\.\s*/m, ""),
      externalUrl: "#",
      externalButtonLabel: null,
      icon: "Construction",
      order: 1,
    },
    {
      divisionSlug: "hubungan-industrial-dan-persyaratan-kerja",
      slug: "perselisihan-hubungan-industrial",
      name: "Perselisihan Hubungan Industrial",
      description:
        "Fasilitasi dan mediasi perselisihan hubungan industrial antara pekerja dan pengusaha.",
      requirements: [
        "Identitas pelapor (pekerja/pengusaha)",
        "Kronologi perselisihan secara tertulis",
        "Bukti pendukung yang relevan",
      ]
        .map((r) => `- ${r}`)
        .join("\n"),
      procedures: [
        "Sampaikan laporan perselisihan kepada Bidang HI & PK",
        "Petugas melakukan verifikasi laporan dan kelengkapan dokumen",
        "Dilakukan proses perundingan/mediasi sesuai ketentuan",
        "Hasil perundingan dituangkan dalam kesepakatan bersama",
      ]
        .map((p) => `1. ${p}`)
        .join("\n")
        .replace(/^1\.\s*/m, ""),
      externalUrl: null,
      externalButtonLabel: null,
      icon: "Scale",
      order: 1,
    },
    {
      divisionSlug: "hubungan-industrial-dan-persyaratan-kerja",
      slug: "pkwt",
      name: "PKWT",
      description:
        "Informasi dan fasilitasi terkait Perjanjian Kerja Waktu Tertentu (PKWT).",
      requirements: [
        "Identitas pekerja dan pengusaha",
        "Naskah perjanjian kerja waktu tertentu",
        "Dokumen pendukung sesuai ketentuan",
      ]
        .map((r) => `- ${r}`)
        .join("\n"),
      procedures: [
        "Konsultasikan rencana PKWT kepada petugas Bidang HI & PK",
        "Siapkan naskah perjanjian sesuai ketentuan peraturan",
        "Daftarkan/sampaikan PKWT sesuai mekanisme yang berlaku",
        "Simpan salinan perjanjian untuk kedua belah pihak",
      ]
        .map((p) => `1. ${p}`)
        .join("\n")
        .replace(/^1\.\s*/m, ""),
      externalUrl: null,
      externalButtonLabel: null,
      icon: "FileText",
      order: 2,
    },
    {
      divisionSlug: "hubungan-industrial-dan-persyaratan-kerja",
      slug: "pembuatan-ak1-siapkerja",
      name: "Pembuatan AK1 di Aplikasi Siapkerja",
      description:
        "Fasilitasi pembuatan kartu tanda pencari kerja AK1 melalui aplikasi Siapkerja.",
      requirements: [
        "Kartu Tanda Penduduk (KTP)",
        "Ijazah atau surat keterangan pendidikan terakhir",
        "Pas foto terbaru",
        "Alamat email dan nomor HP aktif",
      ]
        .map((r) => `- ${r}`)
        .join("\n"),
      procedures: [
        "Siapkan dokumen persyaratan",
        "Hubungi petugas Bidang HI & PK untuk bantuan pendaftaran",
        "Lengkapi data diri pada aplikasi Siapkerja",
        "Verifikasi data dan terima bukti AK1",
      ]
        .map((p) => `1. ${p}`)
        .join("\n")
        .replace(/^1\.\s*/m, ""),
      externalUrl: "#",
      externalButtonLabel: "Buka Siapkerja",
      icon: "Users",
      order: 3,
    },
    {
      divisionSlug: "hubungan-industrial-dan-persyaratan-kerja",
      slug: "penanganan-cpmi-siskop2mi",
      name: "Penanganan CPMI di Aplikasi Siskop2mi",
      description:
        "Fasilitasi dan informasi calon pekerja migran Indonesia (CPMI) melalui aplikasi Siskop2mi.",
      requirements: [
        "Identitas calon pekerja migran",
        "Dokumen persyaratan sesuai ketentuan",
        "Informasi penempatan yang dituju",
      ]
        .map((r) => `- ${r}`)
        .join("\n"),
      procedures: [
        "Konsultasikan rencana bekerja ke luar negeri kepada petugas",
        "Petugas melakukan pendataan melalui aplikasi Siskop2mi",
        "Pemohon mengikuti proses verifikasi dan pembinaan",
        "Tindak lanjut penempatan sesuai ketentuan peraturan",
      ]
        .map((p) => `1. ${p}`)
        .join("\n")
        .replace(/^1\.\s*/m, ""),
      externalUrl: "#",
      externalButtonLabel: "Buka Siskop2mi",
      icon: "Plane",
      order: 4,
    },
    {
      divisionSlug: "uptd-blki",
      slug: "pelatihan-kompetensi",
      name: "Pelatihan Kompetensi",
      description:
        "Pelatihan kompetensi untuk meningkatkan keterampilan dan daya saing tenaga kerja oleh UPTD BLKI.",
      requirements: [
        "Warga negara Indonesia",
        "Berdomisili di Kabupaten Aceh Utara (prioritas)",
        "Memenuhi persyaratan usia sesuai program pelatihan",
        "Dokumen pendukung sesuai ketentuan pendaftaran",
      ]
        .map((r) => `- ${r}`)
        .join("\n"),
      procedures: [
        "Pilih program pelatihan yang diminati",
        "Siapkan dokumen persyaratan pendaftaran",
        "Daftarkan diri kepada petugas UPTD BLKI",
        "Ikuti seleksi dan pengumuman peserta (jika ada)",
        "Ikuti pelatihan hingga selesai dan terima sertifikat",
      ]
        .map((p) => `1. ${p}`)
        .join("\n")
        .replace(/^1\.\s*/m, ""),
      externalUrl: null,
      externalButtonLabel: null,
      icon: "GraduationCap",
      order: 1,
    },
  ];

  for (const s of services) {
    const division = await prisma.division.findUnique({
      where: { slug: s.divisionSlug },
    });
    if (!division) continue;
    const data = {
      divisionId: division.id,
      name: s.name,
      description: s.description,
      requirements: s.requirements,
      procedures: s.procedures,
      externalUrl: s.externalUrl,
      externalButtonLabel: s.externalButtonLabel,
      icon: s.icon,
      order: s.order,
      status: "active",
    };
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: data,
      create: { slug: s.slug, ...data },
    });
  }
  console.log(`  ✓ ${services.length} layanan`);

  // ---------------------------------------------------------------
  // Contact person (hanya dibuat jika belum ada)
  // ---------------------------------------------------------------
  if ((await prisma.contactPerson.count()) === 0) {
    const contacts = [
      {
        divisionSlug: "sekretariat",
        name: "Petugas Sekretariat",
        position: "Sekretariat",
        phone: "081234567890",
        whatsapp: "6281234567890",
        email: "sekretariat@example.com",
      },
      {
        divisionSlug: "pelayanan-terpadu-satu-pintu",
        name: "Petugas PTSP",
        position: "Bidang Pelayanan Terpadu Satu Pintu",
        phone: "081234567891",
        whatsapp: "6281234567891",
        email: "ptsp@example.com",
      },
      {
        divisionSlug: "penanaman-modal",
        name: "Petugas Penanaman Modal",
        position: "Bidang Penanaman Modal",
        phone: "081234567892",
        whatsapp: "6281234567892",
        email: "penanamanmodal@example.com",
      },
      {
        divisionSlug: "transmigrasi",
        name: "Petugas Transmigrasi",
        position: "Bidang Transmigrasi",
        phone: "081234567893",
        whatsapp: "6281234567893",
        email: "transmigrasi@example.com",
      },
      {
        divisionSlug: "hubungan-industrial-dan-persyaratan-kerja",
        name: "Petugas Hubungan Industrial",
        position: "Bidang Hubungan Industrial dan Persyaratan Kerja",
        phone: "081234567894",
        whatsapp: "6281234567894",
        email: "hi.pk@example.com",
      },
      {
        divisionSlug: "uptd-blki",
        name: "Petugas Pelatihan",
        position: "UPTD BLKI",
        phone: "081234567895",
        whatsapp: "6281234567895",
        email: "blki@example.com",
      },
    ];
    for (const c of contacts) {
      const division = await prisma.division.findUnique({
        where: { slug: c.divisionSlug },
      });
      if (!division) continue;
      await prisma.contactPerson.create({
        data: {
          divisionId: division.id,
          name: c.name,
          position: c.position,
          phone: c.phone,
          whatsapp: c.whatsapp,
          email: c.email,
          order: 1,
          status: "active",
        },
      });
    }
    console.log(`  ✓ ${contacts.length} contact person`);
  } else {
    console.log("  ✓ Contact person sudah ada, dilewati");
  }

  // ---------------------------------------------------------------
  // Berita
  // ---------------------------------------------------------------
  const news = [
    {
      slug: "selamat-datang-di-website-dpmpttk-aceh-utara",
      title:
        "Selamat Datang di Website Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja",
      category: "Pengumuman",
      divisionSlug: null,
      excerpt:
        "Website ini menyediakan informasi layanan perizinan, penanaman modal, transmigrasi, hubungan industrial, dan pelatihan kerja.",
      status: "published",
      publishedAt: new Date(),
      content:
        "Assalamu'alaikum warahmatullahi wabarakatuh.\n\nSelamat datang di situs resmi **Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara**.\n\nWebsite ini menyediakan informasi seputar:\n\n- Pelayanan perizinan berusaha melalui OSS dan Sincantik\n- Penanaman modal dan pelaporan LKPM Online\n- Pembangunan sarana dan prasarana transmigrasi\n- Hubungan industrial dan persyaratan kerja\n- Pelatihan kompetensi tenaga kerja oleh UPTD BLKI\n\nKami berharap website ini dapat mempermudah masyarakat dalam memperoleh informasi dan layanan. Kritik serta saran dapat disampaikan melalui menu **Kontak**.\n\nWassalamu'alaikum warahmatullahi wabarakatuh.",
    },
    {
      slug: "panduan-singkat-pelaporan-lkpm-online",
      title: "Panduan Singkat Pelaporan LKPM Online",
      category: "Layanan",
      divisionSlug: "penanaman-modal",
      excerpt:
        "LKPM adalah laporan kegiatan penanaman modal yang disampaikan secara online melalui sistem OSS.",
      status: "draft",
      publishedAt: null,
      content:
        "LKPM (Laporan Kegiatan Penanaman Modal) adalah laporan perkembangan realisasi penanaman modal yang wajib disampaikan pelaku usaha secara berkala melalui sistem **OSS** (Online Single Submission).\n\n## Persiapan\n\n- Pastikan perusahaan telah memiliki Nomor Induk Berusaha (NIB).\n- Siapkan akun OSS yang masih aktif.\n- Siapkan data kegiatan usaha dan realisasi investasi.\n\n## Langkah-Langkah\n\n1. Masuk ke situs OSS di https://oss.go.id\n2. Pilih menu pelaporan LKPM\n3. Isi data realisasi kegiatan usaha sesuai periode pelaporan\n4. Periksa kembali data yang diisi\n5. Kirim laporan sebelum batas waktu yang ditentukan\n\n## Kendala dan Solusi\n\nJika mengalami kendala, silakan hubungi Bidang Penanaman Modal melalui menu Kontak pada website ini.",
    },
    {
      slug: "informasi-pelatihan-kompetensi-uptd-blki",
      title: "Informasi Pelatihan Kompetensi UPTD BLKI",
      category: "Kegiatan",
      divisionSlug: "uptd-blki",
      excerpt:
        "UPTD BLKI menyediakan pelatihan kompetensi untuk meningkatkan keterampilan tenaga kerja.",
      status: "draft",
      publishedAt: null,
      content:
        "UPTD BLKI (Balai Latihan Kerja Industri) menyelenggarakan pelatihan kompetensi untuk meningkatkan keterampilan dan daya saing tenaga kerja.\n\n## Informasi Umum\n\n- Pelatihan diberikan sesuai ketentuan dan kuota yang berlaku.\n- Sertifikat pelatihan diberikan kepada peserta yang menyelesaikan program.\n\n## Persyaratan\n\n- Warga negara Indonesia\n- Berdomisili di Kabupaten Aceh Utara (prioritas)\n- Memenuhi persyaratan usia sesuai program pelatihan\n\n## Cara Mendaftar\n\n1. Kunjungi halaman layanan **Pelatihan Kompetensi** pada website ini.\n2. Siapkan dokumen persyaratan.\n3. Hubungi petugas UPTD BLKI untuk informasi jadwal pendaftaran.\n\nJadwal dan kuota pelatihan dapat berubah sewaktu-waktu. Informasi lebih lanjut silakan hubungi contact person UPTD BLKI melalui menu Kontak.",
    },
  ];

  for (const n of news) {
    let divisionId: number | null = null;
    if (n.divisionSlug) {
      const division = await prisma.division.findUnique({
        where: { slug: n.divisionSlug },
      });
      divisionId = division ? division.id : null;
    }
    const data = {
      divisionId,
      title: n.title,
      category: n.category,
      excerpt: n.excerpt,
      content: n.content,
      status: n.status,
      publishedAt: n.publishedAt,
    };
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: data,
      create: { slug: n.slug, ...data },
    });
  }
  console.log(`  ✓ ${news.length} berita`);

  // ---------------------------------------------------------------
  // Galeri (hanya dibuat jika belum ada)
  // ---------------------------------------------------------------
  if ((await prisma.gallery.count()) === 0) {
    const galleries = [
      {
        title: "Kegiatan Pelayanan",
        description:
          "Suasana pelayanan perizinan dan nonperizinan di kantor dinas.",
        category: "Pelayanan",
        imageUrl: "/images/kegiatan-pelayanan.svg",
        order: 1,
      },
      {
        title: "Pelatihan Kerja",
        description:
          "Kegiatan pelatihan kompetensi tenaga kerja oleh UPTD BLKI.",
        category: "Pelatihan",
        imageUrl: "/images/pelatihan-kerja.svg",
        order: 2,
      },
      {
        title: "Sosialisasi Perizinan",
        description:
          "Sosialisasi perizinan berusaha kepada pelaku usaha dan masyarakat.",
        category: "Sosialisasi",
        imageUrl: "/images/sosialisasi-perizinan.svg",
        order: 3,
      },
      {
        title: "Pembangunan Transmigrasi",
        description:
          "Kegiatan pembangunan sarana dan prasarana kawasan transmigrasi.",
        category: "Transmigrasi",
        imageUrl: "/images/pembangunan-transmigrasi.svg",
        order: 4,
      },
    ];
    for (const g of galleries) {
      await prisma.gallery.create({ data: { ...g, status: "active" } });
    }
    console.log(`  ✓ ${galleries.length} galeri`);
  } else {
    console.log("  ✓ Galeri sudah ada, dilewati");
  }

  console.log("Data awal berhasil dibuat.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

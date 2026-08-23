# Website Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara

Website resmi pemerintahan untuk **Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara** (DPMTRANSNAKER ACEH UTARA).

Website ini menampilkan profil dinas, struktur bidang, layanan, berita, pengumuman, galeri, kontak, dan contact person tiap bidang, dilengkapi panel admin untuk mengelola seluruh konten.

Tagline: **"Melayani dengan Profesional, Transparan, dan Akuntabel"**

---

## 1. Deskripsi

- Halaman publik: Beranda, Profil, Bidang & Layanan, Berita, Tutorial, Galeri, Kontak, Kebijakan Privasi.
- Panel admin di `/admin` untuk mengelola pengaturan situs, profil dinas, bidang, layanan, contact person, berita, tutorial, galeri, dan pertanyaan masuk.
- Form kontak publik tersimpan ke database dan terlihat di panel admin.
- Tombol WhatsApp otomatis dibuat dari nomor contact person (format 08xx / +62 / 62 semuanya didukung).

## 2. Stack Teknologi

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL (Neon untuk deploy, bisa Postgres lokal untuk development)
- `@vercel/blob` (penyimpanan upload video/gambar langsung di Vercel, opsional)
- bcryptjs (hash password)
- jose (session cookie JWT)
- zod (validasi)
- react-markdown + remark-gfm (konten markdown)
- date-fns (format tanggal Indonesia)
- lucide-react (ikon)
- sonner (toast notification)
- clsx (gabung class)

## 3. Fitur Utama

- Topbar alamat/telepon/email/jam layanan, navbar sticky dengan menu mobile.
- Hero beranda, layanan unggulan, daftar bidang, berita terbaru, galeri, kontak cepat, lokasi & jam layanan.
- Halaman detail bidang dengan tugas/fungsi, layanan, contact person, dan berita terkait.
- Halaman detail layanan dengan persyaratan, prosedur, tautan aplikasi eksternal, dan contact person.
- Berita dengan kategori, pencarian, dan pagination. Berita draft tidak tampil untuk publik.
- Tutorial video untuk panduan OSS, LKPM Online, AK1, dan layanan lainnya.
- Admin dapat mengunggah video MP4/WebM/OGG/MOV maksimal 100 MB atau menyimpan URL YouTube, Vimeo, dan MP4 eksternal.
- Galeri dengan filter kategori dan modal pratinjau gambar.
- Form kontak dengan validasi (nama & pesan wajib, email valid jika diisi, WA hanya angka) dan toast sukses.
- Floating WhatsApp button (muncul jika nomor utama diisi pada Pengaturan).
- SEO dasar: metadata, Open Graph, `sitemap.xml` dinamis, `robots.txt`.
- Keamanan: password di-hash, middleware melindungi `/admin`, validasi zod di semua input, pesan error ramah pengguna.
- Performa: halaman publik menggunakan ISR (cache 60 detik, direfresh otomatis di latar belakang). Perubahan dari panel admin langsung tampil karena setiap aksi admin memanggil `revalidatePath`. Jika data diubah langsung lewat Prisma Studio, tunggu maksimal 60 detik agar cache ter-refresh.

## 4. Cara Install di Windows

Syarat: **Node.js 18.18+ (disarankan 20 atau 22)** dan npm.

Buka PowerShell di folder proyek, lalu jalankan:

```powershell
npm install
```

## 5. Menyiapkan Database (PostgreSQL via Neon, gratis)

Website ini memakai PostgreSQL agar bisa di-deploy ke Vercel (database SQLite tidak berjalan di serverless).

1. Buka **https://neon.tech** dan buat akun gratis.
2. Buat project baru (region: **Singapore**).
3. Buka halaman **Connection Details**, salin **Pooled connection string** (bentuknya `postgresql://...`).
4. Tempel string tersebut ke `DATABASE_URL` pada file `.env`.
5. Buat tabel dan isi data awal:

```powershell
npx prisma db push
npx prisma db seed
```

Perintah `db push` membuat seluruh tabel di database, dan `db seed` mengisi data awal: pengaturan situs, profil, user admin, 6 bidang, 9 layanan, 6 contact person, 3 berita, 3 tutorial video, dan 4 galeri placeholder.

> Alternatif lokal tanpa internet: install PostgreSQL di komputer (atau Docker), lalu isi `DATABASE_URL` dengan koneksi lokal, misalnya `postgresql://postgres:password@localhost:5432/dpmtransnaker`. Langkah selanjutnya sama.

## 6. Seed Data Awal

Sudah dijalankan pada langkah 5. Jika ingin mengulang:

```powershell
npx prisma db seed
```

> Seed bersifat idempotent untuk sebagian besar data (bidang, layanan, berita memakai upsert). Contact person dan galeri hanya dibuat jika tabel masih kosong. Password admin TIDAK di-reset saat seed diulang.

## 7. Menjalankan Website

Mode pengembangan (lokal saja):

```powershell
npm run dev
```

Akses lokal: **http://localhost:3000**

## 8. Akses dari PC Lain dalam WiFi yang Sama

Cara termudah: klik dua kali **`start.bat`** — script ini otomatis menginstall dependensi, menyiapkan database, membuka aturan firewall (lewat `fix-firewall.bat` sekali saja), dan menampilkan alamat akses untuk HP/PC lain.

Manual:

```powershell
npm run dev:lan
```

Akses dari PC/HP lain (dalam satu jaringan WiFi):

```
http://IP_KOMPUTER_SERVER:3000
```

Cara melihat IP komputer server:

```powershell
ipconfig
```

Catatan: jika HP/PC lain tidak bisa membuka website, jalankan `fix-firewall.bat` dengan **Run as administrator** satu kali (Windows memblokir port 3000 pada jaringan bertipe Public).

Untuk mode produksi:

```powershell
npm run build
npm run start:lan
```

## 9. Akun Admin Default

| Field    | Nilai          |
| -------- | -------------- |
| Username | `admin`        |
| Password | `Admin123!`    |

Masuk melalui **http://localhost:3000/admin**

## 10. Cara Mengganti Password Admin

1. Matikan server (Ctrl+C).
2. Buka `npx prisma studio`, buka tabel User, klik ganti password dengan hash bcrypt baru yang dibuat lewat skrip kecil, contoh:

```ts
// simpan sebagai file sementara lalu jalankan npx tsx file.ts
import bcrypt from "bcryptjs";
console.log(await bcrypt.hash("PasswordBaru123!", 10));
```

3. Jalankan ulang server, lalu login dengan password baru.

## 11. Cara Mengganti Logo

Website otomatis menampilkan `/logo-aceh-utara.png` jika ada. Jika tidak ada atau gagal dimuat, fallback ke `/logo-aceh-utara.svg`.

1. Siapkan logo resmi milik dinas (disarankan PNG transparan, minimal 240x240).
2. Simpan ke `public/logo-aceh-utara.png` (atau timpa `public/logo-aceh-utara.svg` dengan logo resmi format SVG).
3. Selesai — logo langsung tampil di header, footer, dan panel admin.

> Logo bawaan (`public/logo-aceh-utara.svg`) hanyalah placeholder bergaya lambang daerah dan **bukan logo resmi**. Harap ganti dengan logo resmi dinas sebelum digunakan secara resmi.

## 12. Cara Mengganti Contact Person Tiap Bidang

1. Login ke panel admin.
2. Buka menu **Contact Person**.
3. Klik Edit pada contact person, lalu ganti nama, jabatan, telepon, WhatsApp, dan email dengan data resmi.
4. Simpan. Tombol WhatsApp di website otomatis menyesuaikan nomor baru.

Format nomor WhatsApp bebas: `081234567890`, `+6281234567890`, atau `6281234567890` semuanya dikonversi otomatis ke link `wa.me`.

## 13. Cara Mengganti Alamat, Telepon, Email, WhatsApp, Media Sosial

1. Login ke panel admin.
2. Buka menu **Pengaturan**.
3. Ubah nama dinas, singkatan, tagline, alamat, telepon, email, WhatsApp, Facebook, Instagram, YouTube, jam layanan, dan link embed Google Maps.
4. Simpan. Seluruh halaman langsung diperbarui.

## 14. Cara Mengganti Link OSS, Sincantik, Siapkerja, Siskop2mi

1. Login ke panel admin.
2. Buka menu **Layanan**.
3. Edit layanan yang diinginkan (mis. Perizinan OSS).
4. Ubah **Tautan Aplikasi Eksternal** (wajib diawali `https://`) dan **Label Tombol Eksternal**.
5. Simpan. Tombol di halaman detail layanan langsung berubah.

## 15. Cara Menambah Bidang, Layanan, Berita, Tutorial, dan Galeri

- **Bidang**: menu Bidang → Tambah Bidang. Isi nama, slug (otomatis), deskripsi, tugas & fungsi, ikon, urutan.
- **Layanan**: menu Layanan → Tambah Layanan. Pilih bidang, isi persyaratan/prosedur (mendukung Markdown, gunakan `-` untuk list dan `1.` untuk langkah).
- **Berita**: menu Berita → Tambah Berita. Konten mendukung Markdown (`##` judul, `-` list, `**tebal**`). Pilih status Draft/Terbit. Berita Terbit langsung tampil di publik.
- **Tutorial**: menu Tutorial → Tambah Tutorial. Pilih file video maksimal 100 MB atau masukkan URL video eksternal. Simpan tutorial sebagai Draft/Terbit. URL YouTube/Vimeo otomatis ditampilkan sebagai embed, sedangkan MP4/WebM/OGG/MOV diputar dengan pemutar video.
- **Galeri**: menu Galeri → Tambah Galeri. Letakkan file gambar di folder `public/images/`, lalu isi URL gambar dengan `/images/nama-file.jpg`.
- **Sambutan/Visi Misi/Tupoksi**: menu **Profil Dinas**.

## 16. Cara Backup Database dan Folder Gambar

- **Database**: dari dashboard Neon (https://console.neon.tech) gunakan menu **Export/Backup**, atau jalankan `npx prisma studio` untuk ekspor data. Untuk Postgres lokal, gunakan `pg_dump`.
- **Gambar/logo/video lokal**: salin folder `public/` (khususnya `public/images/`, `public/uploads/tutorials/`, dan `public/logo-aceh-utara.png`).

## 17. Cara Deploy ke Internet

### Vercel + Neon Postgres (GRATIS, disarankan)

> GitHub Pages **tidak bisa** dipakai: GitHub Pages hanya melayani file statis, sedangkan website ini butuh server Node.js (API login, form kontak, panel admin) dan database. Vercel + Neon adalah alternatif gratis yang setara dengan alur git push otomatis.

**Langkah 1 — Siapkan database (sekali saja, dari komputer ini)**

1. Buka **https://neon.tech**, buat akun gratis, lalu buat project (region Singapore).
2. Salin **Pooled connection string** dari halaman Connection Details.
3. Tempel ke `DATABASE_URL` pada file `.env` di proyek ini.
4. Jalankan:

```powershell
npx prisma db push
npx prisma db seed
```

**Langkah 2 — Push kode ke GitHub**

1. Buat repository baru di github.com (mis. `dpmtransnaker-aceh-utara`).
2. Di PowerShell folder proyek:

```powershell
git add .
git commit -m "Website DPMTRANSNAKER Aceh Utara"
git branch -M main
git remote add origin https://github.com/USERNAME/dpmtransnaker-aceh-utara.git
git push -u origin main
```

**Langkah 3 — Deploy di Vercel**

1. Buka **https://vercel.com**, daftar dengan akun GitHub.
2. Klik **Add New → Project**, pilih repository tadi, klik Import.
3. Pada halaman konfigurasi, isi **Environment Variables**:
   - `DATABASE_URL` — Pooled connection string Neon (sama seperti di `.env`)
   - `AUTH_SECRET` — string acak panjang yang berbeda dari lokal
   - `NEXT_PUBLIC_SITE_URL` — `https://nama-proyek.vercel.app` (sesuaikan setelah deploy)
   - `NEXT_PUBLIC_BLOB_UPLOAD_ENABLED` — `true` jika ingin upload video/gambar langsung dari PC di Vercel
   - `BLOB_READ_WRITE_TOKEN` — otomatis tersedia setelah membuat/menghubungkan Vercel Blob Storage
4. Klik **Deploy**. Tunggu sampai selesai.
5. Setelah deploy, pastikan `NEXT_PUBLIC_SITE_URL` berisi URL final, lalu klik **Redeploy**.

Website langsung online di `https://nama-proyek.vercel.app` dengan admin panel berfungsi penuh.

**Catatan penting Vercel:**

- Perubahan **konten** (berita, layanan, pengaturan) cukup dari panel admin — tidak perlu deploy ulang.
- Perubahan **kode** otomatis ter-deploy setiap kali `git push`.
- File gambar di folder `public/` ikut ter-deploy. Untuk upload video/gambar langsung dari panel admin di Vercel, buka **Project Settings → Storage → Create Blob Store**, lalu aktifkan `NEXT_PUBLIC_BLOB_UPLOAD_ENABLED=true` dan redeploy. Upload dilakukan langsung dari browser ke Vercel Blob sehingga tidak terkena batas body API 4,5 MB. Tanpa Blob Storage, gunakan URL YouTube/Vimeo/MP4/gambar eksternal. Upload file lokal cocok untuk komputer kantor atau VPS.
- Free tier Vercel & Neon cukup untuk website dinas dengan traffic normal.

### Troubleshooting Upload dan Peta

- **Video gagal diunggah di Vercel**: filesystem Vercel bersifat sementara dan API biasa memiliki batas ukuran request. Buat Blob Store di menu Storage Vercel, pastikan `BLOB_READ_WRITE_TOKEN` tersedia, set `NEXT_PUBLIC_BLOB_UPLOAD_ENABLED=true`, lalu redeploy. Setelah itu menu Tutorial dapat menerima upload video langsung dari PC hingga batas yang ditentukan.
- **Upload gambar berita**: buka menu Berita → Tambah/Edit Berita → pilih file pada bagian Gambar Cover → klik Unggah. Alternatifnya, masukkan URL gambar. File lokal memakai `public/uploads/news/`, sedangkan Vercel memakai Blob Storage jika diaktifkan.
- **Peta tidak tampil dari `maps.app.goo.gl`**: URL tersebut adalah link berbagi, bukan URL iframe. Website akan mencoba membuat embed berdasarkan alamat dinas dan menyediakan tombol Buka di Google Maps. Untuk hasil paling akurat, masukkan URL dari Google Maps melalui Bagikan → Sematkan peta → salin nilai `src` pada menu Pengaturan.

### VPS (alternatif berbayar, tanpa perubahan kode)

1. Install Node.js 20 LTS + PM2 di VPS.
2. Salin proyek (tanpa `node_modules`), jalankan `npm install`.
3. Isi `.env` dengan `DATABASE_URL` (Postgres di VPS), `AUTH_SECRET`, dan `NEXT_PUBLIC_SITE_URL` domain Anda.
4. Jalankan:

```bash
npx prisma db push
npx prisma db seed
npm run build
pm2 start npm --name dpmtransnaker -- run start
```

5. Arahkan domain ke VPS dan pasang reverse proxy (Nginx/Caddy) dengan HTTPS.

## 18. Catatan Penting: Data Placeholder

**Semua data awal adalah placeholder dan WAJIB diganti dengan data resmi dinas sebelum dipublikasikan secara resmi**, termasuk:

- Nama, jabatan, nomor WhatsApp, dan email contact person.
- Alamat, telepon, email, WhatsApp, media sosial, dan link peta.
- Sambutan kepala dinas, visi misi, tupoksi, dan nilai pelayanan.
- Link aplikasi OSS, Sincantik, Siapkerja, Siskop2mi.
- Video tutorial dan thumbnail (materi seed hanyalah placeholder).
- Logo (placeholder SVG bukan logo resmi).
- Foto galeri (SVG placeholder, bukan foto kegiatan asli).

Semua dapat diganti melalui panel admin tanpa mengubah kode.

## Struktur Folder

```
├── public/                 # Logo, gambar placeholder, aset statis
│   ├── logo-aceh-utara.svg
│   ├── logo-aceh-utara.png.example
│   └── images/
├── prisma/
│   ├── schema.prisma       # Skema database
│   └── seed.ts             # Data awal
├── src/
│   ├── app/
│   │   ├── (public)/       # Halaman publik
│   │   ├── admin/          # Panel admin
│   │   ├── api/            # API auth & inquiries
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/         # Komponen UI, layout, publik, admin
│   ├── lib/                # db, auth, utils, whatsapp, validasi, actions
│   └── middleware.ts       # Proteksi /admin
├── .env                    # Konfigurasi (DATABASE_URL, AUTH_SECRET)
├── .env.example
├── start.bat
├── fix-firewall.bat
├── scripts/
│   └── db-ready.ts
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Perintah Lengkap

| Perintah              | Fungsi                                      |
| --------------------- | ------------------------------------------- |
| `npm install`         | Install dependensi + generate Prisma client |
| `npm run dev`         | Jalankan dev server (localhost)             |
| `npm run dev:lan`     | Jalankan dev server (akses jaringan WiFi)   |
| `npm run build`       | Build produksi                              |
| `npm run start`       | Jalankan mode produksi (localhost)          |
| `npm run start:lan`   | Jalankan mode produksi (akses WiFi)         |
| `npm run db:push`     | Sinkronkan skema ke database                |
| `npm run db:setup`    | db push + seed (setup pertama kali)         |
| `npm run db:seed`     | Isi data awal                               |
| `npm run db:migrate`  | Migrasi Prisma (untuk tim/pengembangan)     |
| `npm run db:studio`   | Buka Prisma Studio (lihat/edit data)        |

@echo off
chcp 65001 >nul
title Website DPMTRANSNAKER Aceh Utara
cd /d "%~dp0"

echo ==================================================
echo   Website Dinas Penanaman Modal, Transmigrasi
echo   dan Tenaga Kerja Kabupaten Aceh Utara
echo ==================================================
echo.

rem ---- Cek Node.js ----
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js tidak ditemukan.
  echo Silakan install Node.js versi 18 ke atas dari https://nodejs.org
  echo lalu jalankan start.bat ini lagi.
  echo.
  pause
  exit /b 1
)

rem ---- Cek file .env ----
if not exist ".env" (
  echo [INFO] File .env belum ada. Membuat dari .env.example...
  copy ".env.example" ".env" >nul
)

rem ---- Install dependensi jika belum ada ----
if not exist "node_modules" (
  echo [INFO] Pertama kali dijalankan. Menginstall dependensi...
  echo       Proses ini membutuhkan internet dan bisa beberapa menit.
  echo.
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install gagal. Periksa koneksi internet lalu coba lagi.
    echo.
    pause
    exit /b 1
  )
)

rem ---- Cek DATABASE_URL di .env masih placeholder atau belum ----
findstr /c:"USERNAME:PASSWORD@" ".env" >nul 2>&1
if not errorlevel 1 (
  echo.
  echo [PERHATIAN] DATABASE_URL di file .env masih placeholder.
  echo   Cara mengisinya:
  echo   1. Buka https://neon.tech lalu buat akun gratis
  echo   2. Buat project baru, pilih region Singapore
  echo   3. Buka Connection Details, salin Pooled connection string
  echo   4. Tempel ke DATABASE_URL pada file .env
  echo   5. Jalankan start.bat ini lagi
  echo.
  echo   File .env akan dibuka dengan Notepad...
  start notepad ".env"
  pause
  exit /b 1
)

rem ---- Cek database dan tabel Tutorial ----
call npx tsx scripts/db-ready.ts >nul 2>&1
if errorlevel 2 (
  echo [INFO] Menyinkronkan skema database...
  call npm run db:push
  if errorlevel 1 (
    echo.
    echo [ERROR] Sinkronisasi database gagal.
    echo         Periksa DATABASE_URL di file .env dan koneksi internet.
    echo.
    pause
    exit /b 1
  )
  call npx tsx scripts/db-ready.ts >nul 2>&1
)

rem ---- Seed hanya untuk database yang benar-benar kosong ----
if errorlevel 1 (
  echo [INFO] Mengisi database dengan data awal pertama kali...
  echo.
  call npm run db:seed
  if errorlevel 1 (
    echo.
    echo [ERROR] Gagal menyiapkan database.
    echo         Periksa DATABASE_URL di file .env dan koneksi internet.
    echo.
    pause
    exit /b 1
  )
)

rem ---- Ambil alamat IP untuk akses dari HP/PC lain ----
set "LANIP="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do set "LANIP=%%a"
set "LANIP=%LANIP: =%"

rem ---- Cek aturan firewall untuk akses dari HP/PC lain ----
netsh advfirewall firewall show rule name="DPMPTTK Website Port 3000" >nul 2>&1
if errorlevel 1 (
  echo.
  echo [PERHATIAN] Aturan firewall port 3000 belum terpasang.
  echo             Jika HP/PC lain tidak bisa membuka website,
  echo             klik kanan fix-firewall.bat lalu pilih
  echo             "Run as administrator" satu kali saja.
)

echo.
echo ==================================================
echo   Server mulai berjalan!
echo.
echo   Akses dari komputer ini : http://localhost:3000
if not "%LANIP%"=="" echo   Akses dari HP/PC lain  : http://%LANIP%:3000
echo   Panel Admin             : http://localhost:3000/admin
echo   Username : admin   Password : Admin123!
echo.
echo   JANGAN tutup jendela ini selama website digunakan.
echo   Tekan Ctrl+C untuk menghentikan server.
echo ==================================================
echo.

call npm run dev:lan

echo.
echo Server dihentikan.
pause

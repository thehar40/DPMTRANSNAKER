@echo off
chcp 65001 >nul
title Perbaikan Firewall - Website DPMPTTK Aceh Utara
cd /d "%~dp0"

rem ---- Minta izin Administrator jika belum ada ----
net session >nul 2>&1
if %errorlevel%==0 goto :run

echo Meminta izin Administrator (klik "Yes" pada jendela UAC)...
powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
exit /b

:run
echo ==================================================
echo   Menambahkan aturan firewall port 3000
echo   agar HP/PC lain di WiFi bisa membuka website
echo ==================================================
echo.

netsh advfirewall firewall add rule name="DPMPTTK Website Port 3000" dir=in action=allow protocol=TCP localport=3000 >nul
if errorlevel 1 (
  echo [ERROR] Gagal menambahkan aturan firewall.
  echo         Coba jalankan ulang file ini dengan klik kanan - Run as administrator.
  echo.
  pause
  exit /b 1
)

echo [OK] Aturan firewall berhasil ditambahkan.
echo.
echo Sekarang HP/PC lain bisa mengakses:
echo   http://IP_KOMPUTER_INI:3000
echo.
echo IP komputer ini tertera pada jendela start.bat.
echo.
pause

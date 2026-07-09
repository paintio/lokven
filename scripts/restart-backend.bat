@echo off
chcp 65001 >nul
title Lokven - Перезапуск бэкенда

echo ========================================
echo   🔄 Lokven - Перезапуск бэкенда
echo ========================================
echo.

cd /d E:\lokven\apps\backend

echo 📦 Остановка текущего процесса...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq Lokven Backend*" 2>nul
timeout /t 2 /nobreak >nul

echo 📦 Очистка кеша...
if exist dist rmdir /s /q dist

echo 📦 Сборка проекта...
call npm run build

echo 📦 Запуск бэкенда...
start "Lokven Backend" cmd /k "npm run start:prod"

echo.
echo ✅ Бэкенд перезапущен!
echo 📍 http://localhost:5000
echo.
pause
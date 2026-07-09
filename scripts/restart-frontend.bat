@echo off
chcp 65001 >nul
title Lokven - Перезапуск фронтенда

echo ========================================
echo   🔄 Lokven - Перезапуск фронтенда
echo ========================================
echo.

cd /d E:\lokven\apps\frontend

echo 📦 Остановка текущего процесса...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq Lokven Frontend*" 2>nul
timeout /t 2 /nobreak >nul

echo 📦 Очистка кеша...
if exist .next rmdir /s /q .next

echo 📦 Запуск фронтенда...
start "Lokven Frontend" cmd /k "npm run dev"

echo.
echo ✅ Фронтенд перезапущен!
echo 📍 http://localhost:3002
echo.
pause
@echo off
chcp 65001 >nul
title Lokven - Полная перезагрузка

echo ========================================
echo   🔄 Lokven - Полная перезагрузка
echo ========================================
echo.

echo 📦 Остановка всех Node.js процессов...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq Lokven*" 2>nul
timeout /t 3 /nobreak >nul

cd /d E:\lokven

echo 📦 Перезапуск бэкенда...
start "Lokven Backend" cmd /k "cd apps\backend && npm run start:dev"
timeout /t 3 /nobreak >nul

echo 📦 Перезапуск фронтенда...
start "Lokven Frontend" cmd /k "cd apps\frontend && npm run dev"

echo.
echo ✅ Все сервисы перезапущены!
echo 📍 Бэкенд: http://localhost:5000
echo 📍 Фронтенд: http://localhost:3002
echo.
pause
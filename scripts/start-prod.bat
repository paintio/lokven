@echo off
chcp 65001 >nul
title Lokven - PRODUCTION

echo ========================================
echo   🚀 Lokven - Запуск в PRODUCTION
echo ========================================
echo.

cd /d E:\lokven

echo 📦 Сборка бэкенда...
cd apps\backend
call npm run build

echo 📦 Сборка фронтенда...
cd ..\frontend
call npm run build

echo 📦 Запуск в production...
cd ..\..

start "Lokven Backend" cmd /k "cd apps\backend && npm run start:prod"
timeout /t 3 /nobreak >nul
start "Lokven Frontend" cmd /k "cd apps\frontend && npm run start"

echo.
echo ✅ Production режим запущен!
echo 📍 Бэкенд: http://localhost:5000
echo 📍 Фронтенд: http://localhost:3002
echo.
pause
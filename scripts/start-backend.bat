@echo off
chcp 65001 >nul
title Lokven - Бэкенд

echo ========================================
echo   ⚙️ Lokven - Запуск бэкенда
echo ========================================
echo.

cd /d E:\lokven\apps\backend

echo 📍 Запуск NestJS сервера...
echo 📍 Порт: 5000
echo.

npm run start:dev

pause
@echo off
chcp 65001 >nul
title Lokven - Фронтенд

echo ========================================
echo   🌐 Lokven - Запуск фронтенда
echo ========================================
echo.

cd /d E:\lokven\apps\frontend

echo 📍 Запуск Next.js сервера...
echo 📍 Порт: 3002
echo.

npm run dev

pause
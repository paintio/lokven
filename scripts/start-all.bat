@echo off
chcp 65001 >nul
title Lokven - Запуск всех сервисов

echo ========================================
echo   🚀 Lokven - Запуск всех сервисов
echo ========================================
echo.

cd /d E:\lokven

start "Lokven Backend" cmd /k "cd apps\backend && npm run start:dev"
timeout /t 3 /nobreak >nul
start "Lokven Frontend" cmd /k "cd apps\frontend && npm run dev"

echo.
echo ✅ Бэкенд и фронтенд запущены!
echo.
echo 📍 Бэкенд: http://localhost:5000
echo 📍 Фронтенд: http://localhost:3002
echo.
echo Нажмите любую клавишу для выхода...
pause >nul
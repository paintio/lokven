@echo off
chcp 65001 >nul
title Lokven - Статус сервисов

echo ========================================
echo   📊 Lokven - Статус сервисов
echo ========================================
echo.

echo 🔍 Проверка портов:
echo.

netstat -ano | findstr :5000 >nul
if %errorlevel%==0 (
    echo ✅ Бэкенд: ЗАПУЩЕН (порт 5000)
) else (
    echo ❌ Бэкенд: ОСТАНОВЛЕН
)

netstat -ano | findstr :3002 >nul
if %errorlevel%==0 (
    echo ✅ Фронтенд: ЗАПУЩЕН (порт 3002)
) else (
    echo ❌ Фронтенд: ОСТАНОВЛЕН
)

echo.
echo 📌 Процессы Node.js:
tasklist | findstr node.exe

echo.
pause
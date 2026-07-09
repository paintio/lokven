@echo off
chcp 65001 >nul
title Lokven - Обновление зависимостей

echo ========================================
echo   📦 Lokven - Обновление зависимостей
echo ========================================
echo.

cd /d E:\lokven

echo 📦 Обновление корневых зависимостей...
call npm install

echo 📦 Обновление бэкенда...
cd apps\backend
call npm install
call npx prisma generate

echo 📦 Обновление фронтенда...
cd ..\frontend
call npm install

echo.
echo ✅ Все зависимости обновлены!
echo.
pause
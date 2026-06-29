#!/bin/bash

echo "🚀 Starting Lokven setup..."

# Бэкенд
echo "📦 Setting up backend..."
cd ../apps/backend
npm install
npx prisma generate
npx prisma migrate dev --name init

# Фронтенд
echo "📦 Setting up frontend..."
cd ../frontend
npm install

# Корень
echo "📦 Setting up root..."
cd ../..
npm install

echo "✅ Lokven is ready!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "Or individually:"
echo "  Backend: cd apps/backend && npm run start:dev"
echo "  Frontend: cd apps/frontend && npm run dev"
echo ""
echo "Prisma Studio: cd apps/backend && npx prisma studio"

#!/bin/bash

# Stop on any error
set -e

echo "🚀 Starting deployment..."

echo "⬇️  Pulling latest changes..."
# Discard local lockfile changes to avoid merge conflicts
git checkout package-lock.json yarn.lock 2>/dev/null || true
git pull

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Updating database schema..."
npm run db:push

echo "🏗️  Building project..."
npm run build

echo "🔄 Restarting server..."
pm2 restart all || true

echo "✅ Deployment preparation complete!"
echo "👉 Now go to aaPanel Node Manager and click 'Restart' on your project."

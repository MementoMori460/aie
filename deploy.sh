#!/bin/bash

# Stop on any error
set -e

echo "🚀 Starting deployment..."

echo "⬇️  Pulling latest changes..."
# Discard local lockfile changes to avoid merge conflicts
# Discard local lockfile changes to avoid merge conflicts
# Discard local lockfile changes to avoid merge conflicts
git config --global --add safe.directory /www/wwwroot/aie
git reset --hard HEAD
git clean -fd
git pull

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Updating database schema..."
npm run db:push

echo "🏗️  Building project..."
npm run build

echo "🔄 Restarting server..."
echo "🔄 Restarting server..."
# Try to source bashrc to make sure we have the right PATH (including pm2)
[ -f ~/.bashrc ] && source ~/.bashrc

# Restart specific app if name is known, otherwise all
# Note: In aaPanel, project name is often the folder name or domain
pm2 restart all || echo "⚠️ PM2 restart failed. If you use aaPanel Node Manager, it might manage the process differently."

echo "✅ Deployment preparation complete!"
echo "👉 Now go to aaPanel Node Manager and click 'Restart' on your project."

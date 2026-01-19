#!/bin/bash

# Stop on any error
set -e

echo "🚀 Starting deployment..."

echo "⬇️  Pulling latest changes..."
git pull

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Updating database schema..."
npm run db:push

echo "🏗️  Building project..."
npm run build

echo "✅ Deployment preparation complete!"
echo "👉 Now go to aaPanel Node Manager and click 'Restart' on your project."

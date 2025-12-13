#!/bin/bash

# Konkur Platform Deployment Script
# Usage: ./deploy.sh

echo "🚀 Starting Deployment..."

# 1. Pull latest changes
# git pull origin main

# 2. Install PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

# 3. Run Migrations
echo "🗄️  Migrating Database..."
php artisan migrate --force

# 4. Install Node dependencies & Build
echo "🎨 Building Frontend..."
npm install
npm run build

# 5. Clear & Cache Configs
echo "🧹 Optimizing..."
php artisan optimize:clear
php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache

# 6. Storage Link
if [ ! -L public/storage ]; then
    echo "🔗 Linking Storage..."
    php artisan storage:link
fi

echo "✅ Deployment Completed Successfully!"

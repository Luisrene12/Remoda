#!/bin/sh
set -e

cd /var/www/html

if [ -f artisan ]; then
    echo "==> Running Laravel migrations..."
    php artisan migrate --force
fi

echo "==> Starting PHP-FPM and Nginx..."
php-fpm -D
exec nginx -g "daemon off;"
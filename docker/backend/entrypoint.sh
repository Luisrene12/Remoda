#!/bin/sh
set -e

cd /var/www/html

# Verificar que el driver pdo_pgsql esté disponible
echo "==> Checking PHP extensions..."
php -m | grep -i pdo
php -m | grep -i pgsql

# Generar APP_KEY si no existe
if [ -z "$APP_KEY" ]; then
    echo "==> Generating APP_KEY..."
    php artisan key:generate --force
fi

# Limpiar caché de config para forzar lectura de env vars
echo "==> Clearing config cache..."
php artisan config:clear

# Optimizar para producción
echo "==> Caching config and routes..."
php artisan config:cache
php artisan route:cache

# Ejecutar migraciones
echo "==> Running Laravel migrations..."
php artisan migrate --force

echo "==> Starting PHP-FPM and Nginx..."
php-fpm -D
exec nginx -g "daemon off;"
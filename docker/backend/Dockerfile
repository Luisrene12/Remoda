FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    curl libpng-dev libxml2-dev zip unzip git \
    oniguruma-dev libzip-dev bash nginx mysql-client

RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

RUN sed -i \
    -e 's/^pm.max_children = .*/pm.max_children = 5/' \
    -e 's/^pm.start_servers = .*/pm.start_servers = 2/' \
    -e 's/^pm.min_spare_servers = .*/pm.min_spare_servers = 1/' \
    -e 's/^pm.max_spare_servers = .*/pm.max_spare_servers = 3/' \
    /usr/local/etc/php-fpm.d/www.conf

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copia el código de Laravel
COPY backend/ /var/www/html

# Instala dependencias en build time (más rápido que en runtime)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Config de nginx
COPY docker/backend/nginx.conf /etc/nginx/http.d/default.conf

COPY docker/backend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["start"]
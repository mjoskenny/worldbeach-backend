FROM composer:2 AS builder

WORKDIR /build

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --no-scripts --optimize-autoloader


FROM node:20-alpine AS assets

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

COPY resources ./resources
COPY public ./public  
COPY vite.config.js babel.config.js ./
RUN npm run build


FROM php:8.2-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev libzip-dev unzip \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY app ./app
COPY config ./config
COPY database ./database
COPY routes ./routes
COPY bootstrap ./bootstrap
COPY resources ./resources
COPY public ./public
COPY artisan ./artisan
COPY composer.json composer.lock ./

COPY --from=builder /build/vendor ./vendor
COPY --from=assets /build/public/build ./public/build

RUN php artisan package:discover --ansi || true

COPY docker/apache-site.conf /etc/apache2/sites-available/000-default.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint

RUN chmod +x /usr/local/bin/entrypoint \
    && mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint"]
CMD ["apache2-foreground"]

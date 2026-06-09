#!/bin/sh
set -e

mkdir -p \
    /var/www/html/storage/framework/cache \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/testing \
    /var/www/html/storage/framework/views \
    /var/www/html/storage/logs \
    /var/www/html/bootstrap/cache

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true
chmod -R ug+rwx /var/www/html/storage /var/www/html/bootstrap/cache || true

if [ ! -L /var/www/html/public/storage ]; then
    php artisan storage:link --no-interaction || true
fi

if [ "$RUN_MIGRATIONS" = "true" ]; then
    attempts=0
    until php artisan migrate --force; do
        attempts=$((attempts + 1))

        if [ "$attempts" -ge 5 ]; then
            exit 1
        fi

        sleep 5
    done
fi

if [ "$RUN_ADMIN_SEEDER" = "true" ]; then
    php artisan db:seed --class=AdminSeeder --force
fi

exec "$@"

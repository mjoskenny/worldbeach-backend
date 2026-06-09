# Deploy to andasy.io

This project is a Laravel app with a Vite-built React frontend. The safest production setup is:

- Domain: `https://andasy.io`
- Optional alias: `https://www.andasy.io`
- Web root / document root: the app's `public/` directory
- PHP: `8.1+`
- MySQL: required
- Permanent uploads: required, use S3-compatible storage such as Cloudflare R2, AWS S3, or DigitalOcean Spaces

## 1. Upload the project

Upload the whole `worldbeach-backend` project to your hosting account, for example:

- `/home/USERNAME/worldbeach-backend`

Do not use the project root itself as the public web root.

## 2. Point the domain to `public/`

Set the domain document root to:

- `/home/USERNAME/worldbeach-backend/public`

If your host does not allow changing the document root, stop there and use a host that does, or ask me and I will prepare the fallback "public_html" layout.

## 3. Create the production `.env`

Copy values from [.env.production.example](/c:/xampp/htdocs/worldbeach/worldbeach-backend/.env.production.example:1) into the server `.env`.

Minimum values to set correctly:

- `APP_KEY`
- `APP_URL=https://andasy.io`
- `ASSET_URL=https://andasy.io`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `SESSION_DOMAIN=.andasy.io`
- `SANCTUM_STATEFUL_DOMAINS=andasy.io,www.andasy.io`
- `CORS_ALLOWED_ORIGINS=https://andasy.io,https://www.andasy.io`
- `FILESYSTEM_DISK=s3`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_BUCKET`
- `AWS_URL`
- `AWS_ENDPOINT`

Generate `APP_KEY` with:

```bash
php artisan key:generate
```

## 4. Install dependencies

Run on the server if SSH is available:

```bash
composer install --no-dev --optimize-autoloader
npm install
npm run build
```

If your host does not support Node.js on the server, build locally first and upload:

- `public/build`
- updated `public/build/manifest.json`

## 5. Run Laravel setup commands

```bash
php artisan migrate --force
php artisan db:seed --class=AdminSeeder --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 6. Permanent image storage

Do not rely on your laptop storage or Render's free local filesystem for uploads. Files stored there disappear when the machine sleeps, restarts, redeploys, or is turned off.

Use an S3-compatible bucket and set:

```bash
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=auto
AWS_BUCKET=your_bucket_name
AWS_URL=https://your-public-bucket-domain
AWS_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
AWS_USE_PATH_STYLE_ENDPOINT=true
```

For AWS S3, use the real region such as `eu-west-1`, leave `AWS_ENDPOINT` empty, and set `AWS_USE_PATH_STYLE_ENDPOINT=false`.

After changing these values on the server, run:

```bash
php artisan optimize:clear
php artisan config:cache
```

New uploads will be saved to the cloud bucket and stored as public URLs in the database. Existing local uploads must be re-uploaded from the admin panel or manually copied to the bucket.

## 7. File permissions

Make sure these are writable:

- `storage/`
- `bootstrap/cache/`

On Linux hosting:

```bash
chmod -R 775 storage bootstrap/cache
```

## 8. SSL

Enable SSL for:

- `andasy.io`
- `www.andasy.io`

Then force the final `.env` to use:

- `APP_URL=https://andasy.io`
- `SESSION_SECURE_COOKIE=true`

## 9. Admin login

After seeding, the admin account is:

- Email: `admin@worldbeach.com`
- Password: `@Worldbeach25`

Change this password immediately after first login.

## 10. Post-deploy checks

Verify these pages:

- `/`
- `/admin`
- menu checkout
- reservation form
- host event form

Verify uploads work:

- gallery image upload
- event image upload
- service image upload
- space image upload

## 11. Common issues

`419 / CSRF token mismatch`

- confirm `APP_URL` is `https://andasy.io`
- confirm SSL is active
- confirm `SESSION_DOMAIN=.andasy.io`
- clear browser cookies for the domain
- run `php artisan optimize:clear`

`Images not loading`

- if `FILESYSTEM_DISK=public`, run `php artisan storage:link` and confirm `public/storage` exists
- if `FILESYSTEM_DISK=s3`, confirm the bucket is public/readable through `AWS_URL`
- confirm `AWS_URL` opens uploaded image URLs in a browser

`Admin login loops or session not kept`

- confirm cookies are not blocked
- confirm `SESSION_SECURE_COOKIE=true` on HTTPS
- confirm the domain really serves over `https://andasy.io`

## 12. Keep the site always live

The site cannot stay live from your laptop when the laptop is off. Deploy it to hosting that runs the Laravel app 24/7.

For Render, do not use the free plan if you need it awake all the time. Use an always-on paid web service such as `starter`, plus S3/R2 for uploads. The included `render.yaml` is set to `starter` and `FILESYSTEM_DISK=s3` for this reason.

## Recommended deploy order

```bash
php artisan down
composer install --no-dev --optimize-autoloader
npm run build
php artisan migrate --force
php artisan db:seed --class=AdminSeeder --force
php artisan storage:link
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan up
```

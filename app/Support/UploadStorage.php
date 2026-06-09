<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadStorage
{
    public static function store(UploadedFile $file, string $directory): string
    {
        $disk = self::disk();
        $path = $file->store($directory, $disk);

        return self::url($disk, $path);
    }

    public static function storeAs(UploadedFile $file, string $directory, string $filename): string
    {
        $disk = self::disk();
        $path = $file->storeAs($directory, $filename, $disk);

        return self::url($disk, $path);
    }

    public static function delete(?string $storedPath): void
    {
        if (!$storedPath) {
            return;
        }

        $path = self::normalizePath($storedPath);

        if ($path) {
            Storage::disk(self::disk())->delete($path);
        }
    }

    private static function disk(): string
    {
        return config('filesystems.default') ?: 'public';
    }

    private static function url(string $disk, string $path): string
    {
        if ($disk === 'public') {
            return '/storage/' . ltrim($path, '/');
        }

        return Storage::disk($disk)->url($path);
    }

    private static function normalizePath(string $storedPath): string
    {
        $path = str_replace('\\', '/', trim($storedPath));

        if (Str::startsWith($path, ['http://', 'https://'])) {
            $diskUrl = rtrim((string) config('filesystems.disks.' . self::disk() . '.url'), '/');

            if ($diskUrl && Str::startsWith($path, $diskUrl . '/')) {
                $path = Str::after($path, $diskUrl . '/');
            } else {
                $parsedPath = parse_url($path, PHP_URL_PATH) ?: '';
                $path = ltrim($parsedPath, '/');
            }
        }

        if (Str::startsWith($path, 'storage/')) {
            return Str::after($path, 'storage/');
        }

        if (Str::startsWith($path, '/storage/')) {
            return Str::after($path, '/storage/');
        }

        if (Str::startsWith($path, 'public/')) {
            return Str::after($path, 'public/');
        }

        return ltrim($path, '/');
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        Gallery::create([
            'category' => 'hero',
            'image' => 'placeholders/hero.jpg',
            'title' => 'Hero Image',
            'position' => 1
        ]);
    }
}


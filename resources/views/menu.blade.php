<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>World Beach</title>

  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/feather-icons"></script>


  <!-- AOS (Animate on Scroll) -->
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />

  <style>
    :root{
      --aqua: #00b4d8;
      --sand: #f7d9a4;
      --dark: #042029;
      --mini-dark: #00749aff;
    }

    body {
      transition: background-color 0.4s, color 0.4s;
    }

    .dark body {
      background-color: #0f172a;
      color: #f1f5f9;
    }

    .bg-beach {
      position: fixed;
      inset: 0;
      background-image: url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80&auto=format&fit=crop");
      background-size: cover;
      background-position: center;
      filter: blur(6px) saturate(0.85) contrast(0.95);
      opacity: 0.18;
      z-index: 0;
      pointer-events: none;
    }

    .page-overlay {
      position: fixed;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,180,216,0.06), rgba(0,120,170,0.06));
      z-index: 1;
      pointer-events: none;
    }

/* Navbar default: transparent */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  background: transparent;
  z-index: 50;
  color #ffffff;
}

/* After scrolling: blurred background */
.navbar.scrolled {
  background: rgb(255 255 255 / 61%);
   /* light blur */
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: var(--dark);
}

.dark .navbar.scrolled {
  background: rgba(255, 255, 255, 0.04); /* light blur */
  
}

/* Category navbar default: transparent */
.category-navbar {
  transition: all 0.3s ease;
  background: transparent;
  margin: 10px 0;
}

/* After scrolling: blurred background like main nav */
.category-navbar.scrolled {
  background: rgb(255 255 255 / 61%);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgb(226 232 240 / 1);
  padding: 5px 0;
}

.dark .category-navbar.scrolled {
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgb(51 65 85 / 1);
}

    .content {
      position: relative;
      z-index: 2;
    }

    .card-glass {
      background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.88));
      border: 1px solid rgba(2,6,23,0.04);
      box-shadow: 0 8px 20px rgba(2,6,23,0.06);
      min-height: 538px;
    }

    .thumb {
      width: 72px;
      height: 72px;
      border-radius: 12px;
      object-fit: cover;
      flex: 0 0 72px;
      box-shadow: 0 6px 12px rgba(2,6,23,0.08);
    }

    .price-badge {
      background: linear-gradient(90deg,var(--aqua),#0077b6);
      color: white;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 0.95rem;
    }

    html { scroll-behavior: smooth; }

    /* dark mode adjustments */
    .dark .card-glass,
    .dark .card {
      background: rgba(30,41,59,0.9);
      color: #e2e8f0;
      border-color: rgba(255,255,255,0.08);
    }
    .dark .price-badge {
      background: linear-gradient(90deg,#0077b6,#00b4d8);
    }
    .dark .text-slate-600 {
      color: #94a3b8;
    }

    .dark .text-slate-600 {
      color: #94a3b8;
    }
    
    .dark .open-time {
      background-color:rgba(30, 41, 59, 0.9);
    }

    .hero-section {
  min-height: 20vh; /* keeps section height consistent */
  max-width: 300px;
}

.category-link {
  transition: color 0.2s ease;
}

.dark .category-link {
  color: #f8fafc;
}

.dark .category-link:hover {
  color: #f7d9a4;
}

/* Cursor blink animation */
#typingText {
  display: inline-block;
  text-align: left;
}

/* Blinking cursor */
#typingText::after {
  content: '|';
  animation: blink 0.8s infinite;
}


/* ---------- SCROLLABLE NAV HELPERS ---------- */
.scrollable {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
.scrollable::-webkit-scrollbar {
  height: 6px;
}
.scrollable::-webkit-scrollbar-track {
  background: transparent;
}
.scrollable::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.35);
  border-radius: 999px;
  transition: background 0.2s ease, opacity 0.2s ease;
}
.scrollable:hover::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.75);
}
.scrollable {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.35) transparent;
}

/* back to top button */
#backToTop {
  position: fixed;
  right: 28px;
  bottom: 28px;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: var(--aqua);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  z-index: 90;
  box-shadow: 0 8px 30px rgba(0,180,216,0.18);
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: all .28s ease;
}
#backToTop.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
#backToTop:hover { background: #00a3c0; }

.hover-glow:hover {
  box-shadow: 0 0 12px rgba(0,180,216,0.5);
}

.modal-gallery {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(3, 10, 24, 0.92);
  padding: 0.5rem;
}

.modal-gallery.hidden {
  display: none;
}

.modal-gallery__panel {
  position: relative;
  width: min(100vw, 1600px);
  height: calc(95vh - 1rem);
  border-radius: 2rem;
  overflow: hidden;
  background: rgba(10, 15, 30, 0.96);
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.45);
}

.modal-gallery__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 30;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.modal-gallery__close:hover {
  background: rgba(255, 255, 255, 0.18);
}

.modal-gallery__header {
  position: absolute;
  top: 1.25rem;
  left: 1.5rem;
  z-index: 20;
}

.modal-gallery__slider-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider,
.modal-gallery__slider {
  touch-action: pan-y;
}

.modal-gallery__slider {
  height: 100%;
  display: flex;
  transition: transform 0.45s ease;
}

.modal-gallery__slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.modal-gallery__slide img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.modal-gallery__nav {
  position: absolute;
  bottom: 1rem;
  z-index: 20;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 1.85rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.modal-gallery__nav:hover {
  background: rgba(15, 23, 42, 0.95);
  transform: translateY(-50%) scale(1.03);
}

.modal-gallery__nav--left {
  left: 2rem;
}

.modal-gallery__nav--right {
  right: 2rem;
}

.modal-gallery__dots {
  position: absolute;
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 20;
}

.modal-gallery__dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.72);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.modal-gallery__dot:hover {
  border-color: rgba(255, 255, 255, 1);
  transform: scale(1.2);
  background: transparent;
}

.modal-gallery__dot.active {
  background: transparent;
  border-color: rgba(255, 255, 255, 1);
  transform: scale(1.35);
}
    
  </style>
</head>

<body class="antialiased text-slate-900 leading-relaxed">
@php
  $normalizeQrAsset = function ($path, $fallback = null) {
      $path = trim((string) ($path ?: $fallback));

      if ($path === '') {
          return '';
      }

      if (\Illuminate\Support\Str::startsWith($path, ['http://', 'https://', 'data:', 'blob:'])) {
          return $path;
      }

      if (\Illuminate\Support\Str::startsWith($path, ['/storage/', 'storage/', '/build/', 'build/'])) {
          return asset(ltrim($path, '/'));
      }

      if (\Illuminate\Support\Str::startsWith($path, '/')) {
          return asset(ltrim($path, '/'));
      }

      return asset('storage/' . ltrim($path, '/'));
  };

  $qrLogoLight = $normalizeQrAsset($qrLogoLight ?? null, asset('storage/menu_images/logo (2).png'));
  $qrLogoDark = $normalizeQrAsset($qrLogoDark ?? null, asset('storage/menu_images/logo.png'));
@endphp

  <!-- fixed background -->
  <div class="bg-beach" aria-hidden="true"></div>
  <div class="page-overlay" aria-hidden="true"></div>

  <div class="content">

    <!-- 🆕 NAVBAR -->
    <nav class="navbar top-0 left-0 right-0 z-50">
      <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <!-- Logo and name -->
        <div class="flex items-center gap-3">
          <img id="siteLogo" src="{{ $qrLogoLight }}" alt="World Beach logo" class="w-14 h-14 object-contain">
          
        </div>

<div class="text-right">
          <div class="open-time inline-block px-4 py-2 rounded-full bg-white shadow-md">
            <span class="text-sm font-medium" style="color:var(--aqua)">Open • 09:00 — 23:00</span>
          </div>
        </div>
        <!-- Dark mode toggle -->
        <button id="themeToggle" class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          <svg id="sunIcon" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.36 6.36l.7.7M6.34 6.34l-.7-.7m0 12.72l.7-.7m12.02 0l-.7.7M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          <svg id="moonIcon" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-800 dark:text-slate-100 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        </button>
      </div>
    </nav>

    <div class="pt-24"> <!-- push content below navbar -->
      
      <!-- header -->
      
      <header class="max-w-5xl mx-auto px-4 pt-2 pb-2">
      <div class="flex items-center justify-between">
      <section class="hero-section flex flex-col">
  <div>
    <h1 class="text-3xl md:text-4xl font-extrabold dark-text">
     WELCOME TO <span id="typingText" style="color:var(--aqua);"></span>
    </h1>
    <p class="mt-2 text-sm md:text-base text-slate-600">
      Beachside flavors • Fresh catch • Tropical cocktails
    </p>
  </div>
</section>


        
      </div>
    </header>

    @if(session('table_number'))
      <div class="max-w-6xl mx-auto px-4 mb-4">
        <div class="rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 shadow-sm">
          <p class="text-sm font-medium">Table <strong>{{ session('table_number') }}</strong> selected. Your QR scan has been registered for this session.</p>
        </div>
      </div>
    @endif


@php
  $defaultHeroCarouselImages = [
      asset('storage/menu_images/download (8).jpeg'),
      asset('storage/menu_images/download (12).jpeg'),
      asset('storage/menu_images/images (1).jpeg'),
  ];

  $heroCarouselImages = collect($heroCarouselImages ?? [])
      ->filter()
      ->map(fn ($image) => $normalizeQrAsset($image))
      ->values()
      ->all();

  if (empty($heroCarouselImages)) {
      $heroCarouselImages = $defaultHeroCarouselImages;
  }
@endphp

     <!-- hero section with slider -->
<section class="max-w-6xl mx-auto px-4 mb-6">
  <div class="card-glass rounded-2xl p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center">
    
    <!-- Image Slider -->
    <div class="relative">
      <div class="overflow-hidden rounded-lg shadow-md h-60 md:h-72">
        <div class="slider flex transition-transform duration-500">
          @foreach($heroCarouselImages as $index => $image)
            <img src="{{ $image }}" alt="World Beach carousel image {{ $index + 1 }}" class="w-full flex-shrink-0 object-cover">
          @endforeach
        </div>
      </div>

      <!-- Arrows -->
      <button id="prevSlide" class="absolute top-1/2 -left-3 hidden transform -translate-y-1/2 bg-white bg-opacity-70 p-1 rounded-full shadow-md hover:bg-opacity-100">&#10094;</button>
      <button id="nextSlide" class="absolute top-1/2 -right-3 hidden transform -translate-y-1/2 bg-white bg-opacity-70 p-1 rounded-full shadow-md hover:bg-opacity-100">&#10095;</button>
    </div>

    <!-- Text Content -->
    <div class="md:col-span-2">
      <h2 id="slideTitle" class="text-2xl md:text-3xl font-bold dark-text">Beachside Delight — A Taste of World Beach </h2>
      <p id="slideDesc" class="mt-3 text-slate-600">Freshly prepared with rich flavors and quality ingredients, made to give you a delicious and satisfying dining experience by the beach.</p>
      <div class="mt-4 flex flex-wrap gap-3 items-center">
        <a href="#menuList" class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold" style="background: linear-gradient(90deg,var(--aqua),#0077b6);">
          View Menu
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
        <span id="slideTime" class="text-sm text-slate-500">Available until 22:00</span>
      </div>
    </div>
  </div>
</section>


      <!-- ===== category nav (REPLACE your old nav block) ===== -->
<nav id="categoryNav" class="category-navbar sticky top-20 z-40">
  <div class="max-w-6xl mx-auto px-4">
    <div id="categoryContainer" class="scrollable flex gap-3 overflow-x-auto py-3">
      @foreach($categories as $category)
        <button type="button" onclick="openCategoryGallery({{ $category->id }})"
          class="category-link flex-shrink-0 open-time px-4 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow text-sm font-medium transition hover:shadow-xl ">
          {{ $category->name }}
        </button>
      @endforeach
    </div>
  </div>
</nav>

      <!-- category collection cards -->
      <main id="menuList" class="max-w-6xl mx-auto pb-20 px-4">
        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          @foreach($categories as $category)
            
            <article onclick="openCategoryGallery({{ $category->id }})"
              class="group cursor-pointer overflow-hidden rounded-[2rem] bg-white/90 dark:bg-slate-900/90 shadow-2xl transition hover:-translate-y-1 hover:shadow-2xl">
              <div class="relative h-72 overflow-hidden">
                <img src="{{ $category->display_image_url ?? asset('storage/menu_images/image_placeholder.png') }}" alt="{{ $category->name }} cover" class="w-full h-full object-cover transition duration-500 group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent"></div>
                <div class="absolute inset-x-0 bottom-0 p-6">
                  <span class="inline-flex rounded-full bg-white/10  text-xs uppercase tracking-[0.2em] text-slate-100">Collection</span>
                  <h3 class=" text-3xl font-semibold text-white">{{ $category->name }}</h3>
                  <p class="mt-2 text-sm text-slate-300">{{ $category->menuItems->count() }} images</p>
                </div>
              </div>
            </article>
          @endforeach
        </div>
      </main>

<div id="categoryGalleryModal" class="modal-gallery hidden" aria-hidden="true" onclick="closeCategoryGallery()">
  <div class="modal-gallery__panel" onclick="event.stopPropagation()">
    <button type="button" class="modal-gallery__close" onclick="closeCategoryGallery()" aria-label="Close gallery">×</button>
    <div class="modal-gallery__header">
      <div>
        <h2 id="galleryCategoryTitle" class="text-3xl font-bold text-white"></h2>
        <p id="galleryCategoryCount" class="mt-2 text-sm text-slate-300"></p>
      </div>
    </div>
    <div class="modal-gallery__slider-wrapper">
      <div id="gallerySlider" class="modal-gallery__slider"></div>
      <button type="button" class="modal-gallery__nav modal-gallery__nav--left" onclick="changeGallerySlide(-1)">‹</button>
      <button type="button" class="modal-gallery__nav modal-gallery__nav--right" onclick="changeGallerySlide(1)">›</button>
    </div>
    <div id="galleryDots" class="modal-gallery__dots"></div>
  </div>
</div>
<button id="backToTop" title="Back to Top">↑</button>

      <footer class="relative mt-16 border-t border-gray-700 dark:border-slate-700 bg-[var(--dark)] text-gray-300 py-12">
  <div class="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">

    <!-- Brand / About -->
    <div>
      <h2 class="text-2xl font-extrabold mb-4" style="color: var(--aqua);">World Beach</h2>
      <p class="leading-relaxed text-slate-300 dark:text-slate-400">
        Discover the best food and drinks with a vibe that feels like the beach 
        relaxed, premium, and unforgettable.
      </p>
    </div>

    <!-- Quick Links -->
    <div>
      <h3 class="text-lg font-semibold mb-4" style="color: var(--sand);">Quick Links</h3>
      <ul class="space-y-2">
        <li><a href="menu" class="hover:text-[var(--aqua)] transition">Menu</a></li>
        <li><a href="about" class="hover:text-[var(--aqua)] transition">About Us</a></li>
        <li><a href="gallery" class="hover:text-[var(--aqua)] transition">Gallery</a></li>
        <li><a href="contact" class="hover:text-[var(--aqua)] transition">Contact</a></li>
      </ul>
    </div>

    <!-- Social -->
    <div>
      <h3 class="text-lg font-semibold mb-4" style="color: var(--sand);">Follow Us</h3>
      <div class="flex space-x-4">
        <a href="https://www.facebook.com/worldbeachbuja/" class="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--mini-dark)] hover:bg-[var(--aqua)] transition text-white">
          <i data-feather="facebook"></i>
        </a>
        <a href="https://www.instagram.com/worldbeach.buja/" class="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--mini-dark)] hover:bg-[var(--aqua)] transition text-white">
          <i data-feather="instagram"></i>
        </a>
        <a href="https://www.youtube.com/watch?v=KM6DuJ0vcis" class="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--mini-dark)] hover:bg-[var(--aqua)] transition text-white">
          <i data-feather="youtube"></i>
        </a>
      </div>
    </div>

  </div>

  <!-- Divider line -->
  <div class="border-t border-slate-700 mt-10"></div>

  <!-- Copyright -->
  <div class="text-center text-gray-400 text-sm mt-6">
    © {{ date('Y') }} <span style="color: var(--aqua); font-weight:600;">World Beach Bujumbura</span>. All rights reserved.
  </div>

  <!-- Decorative wave overlay -->
  <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--aqua)] to-[var(--mini-dark)]"></div>
</footer>





    </div>
  </div>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    feather.replace();
  });
</script>

  <!-- AOS JS -->
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  
  <script>
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  
  const scrollThreshold = 50;
  
  if (window.scrollY > scrollThreshold) {
    navbar.classList.add('scrolled');
    
  } else {
    navbar.classList.remove('scrolled');
    
  }
});
</script>

<script>
window.addEventListener('scroll', function() {
  
  const categoryNav = document.querySelector('.category-navbar');
  const scrollThreshold = 750;
  
  if (window.scrollY > scrollThreshold) {
    
    categoryNav.classList.add('scrolled');
  } else {
    
    categoryNav.classList.remove('scrolled');
  }
});
</script>

@php
  $categoriesGallery = $categories->map(function ($category) {
      return [
          'id' => $category->id,
          'name' => $category->name,
          'images' => $category->menuItems->map(function ($item) {
          return $item->display_image_url ?? asset('storage/menu_images/image_placeholder.png');
          })->all(),
      ];
  })->all();
@endphp

<script>
const categoriesGallery = @json($categoriesGallery);

let galleryState = {
  activeCategory: null,
  currentIndex: 0,
};

function openCategoryGallery(categoryId) {
  const category = categoriesGallery.find(c => c.id === categoryId);
  if (!category) return;

  galleryState.activeCategory = category;
  galleryState.currentIndex = 0;

  document.getElementById('galleryCategoryTitle').textContent = category.name;
  document.getElementById('galleryCategoryCount').textContent = `${category.images.length} images`;

  const slider = document.getElementById('gallerySlider');
  slider.innerHTML = category.images.length
    ? category.images.map((src, index) => `
        <div class="modal-gallery__slide">
          <img src="${src}" alt="${category.name} image ${index + 1}" />
        </div>
      `).join('')
    : `
        <div class="modal-gallery__slide flex items-center justify-center bg-slate-900 text-white text-lg font-medium">
          No images available yet.
        </div>
      `;

  renderGalleryDots(category.images.length);
  setGallerySlide(0);

  if (!slider.dataset.touchAttached) {
    slider.addEventListener('touchstart', handleGalleryTouchStart, { passive: true });
    slider.addEventListener('touchmove', handleGalleryTouchMove, { passive: true });
    slider.addEventListener('touchend', handleGalleryTouchEnd);
    slider.dataset.touchAttached = 'true';
  }

  const modal = document.getElementById('categoryGalleryModal');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCategoryGallery() {
  const modal = document.getElementById('categoryGalleryModal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function setGallerySlide(index) {
  if (!galleryState.activeCategory) return;
  const slidesCount = galleryState.activeCategory.images.length || 1;
  galleryState.currentIndex = ((index % slidesCount) + slidesCount) % slidesCount;
  const slider = document.getElementById('gallerySlider');
  slider.style.transform = `translateX(-${galleryState.currentIndex * 100}%)`;

  const dots = document.querySelectorAll('.modal-gallery__dot');
  dots.forEach((dot, idx) => dot.classList.toggle('active', idx === galleryState.currentIndex));

  // Update nav button visibility
  const leftBtn = document.querySelector('.modal-gallery__nav--left');
  const rightBtn = document.querySelector('.modal-gallery__nav--right');
  if (slidesCount <= 1) {
    leftBtn.style.display = 'none';
    rightBtn.style.display = 'none';
  } else if (galleryState.currentIndex === 0) {
    leftBtn.style.display = 'none';
    rightBtn.style.display = 'block';
  } else if (galleryState.currentIndex === slidesCount - 1) {
    leftBtn.style.display = 'block';
    rightBtn.style.display = 'none';
  } else {
    leftBtn.style.display = 'block';
    rightBtn.style.display = 'block';
  }
}

function changeGallerySlide(direction) {
  if (!galleryState.activeCategory) return;
  const slidesCount = galleryState.activeCategory.images.length || 1;
  setGallerySlide(galleryState.currentIndex + direction);
}

function renderGalleryDots(count) {
  const dotsContainer = document.getElementById('galleryDots');
  dotsContainer.innerHTML = '';

  if (count <= 1) return;

  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'modal-gallery__dot';
    dot.addEventListener('click', () => setGallerySlide(i));
    dotsContainer.appendChild(dot);
  }
}

const galleryTouch = {
  startX: 0,
  endX: 0,
};

function handleGalleryTouchStart(event) {
  galleryTouch.startX = event.touches[0].clientX;
}

function handleGalleryTouchMove(event) {
  galleryTouch.endX = event.touches[0].clientX;
}

function handleGalleryTouchEnd() {
  const diff = galleryTouch.startX - galleryTouch.endX;
  if (Math.abs(diff) > 50) {
    changeGallerySlide(diff > 0 ? 1 : -1);
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeCategoryGallery();
  }

  if (!document.getElementById('categoryGalleryModal').classList.contains('hidden')) {
    if (event.key === 'ArrowLeft') {
      changeGallerySlide(-1);
    }
    if (event.key === 'ArrowRight') {
      changeGallerySlide(1);
    }
  }
});
</script>


<script>
document.addEventListener('DOMContentLoaded', () => {

  // Slide data
  const heroCarouselImages = @json($heroCarouselImages);
  const slideCopy = [
    {
      title: "Beachside Delight — A Taste of World Beach",
      desc: "Freshly prepared with rich flavors and quality ingredients, made to give you a delicious and satisfying dining experience by the beach.",
      time: "Available until 22:00"
    },
    {
      title: "Chef’s Pick — Made with Care",
      desc: "A flavorful dish crafted with attention to detail, bringing together freshness, taste, and the perfect touch for every bite.",
      time: "Available until 21:30"
    },
    {
      title: "World Beach Favorite — Fresh & Delicious",
      desc: "Prepared daily with care and served in a relaxing beachside atmosphere, perfect for enjoying good food and great moments.",
      time: "Available until 20:00"
    }
  ];
  const slidesData = heroCarouselImages.map((img, index) => ({
    ...slideCopy[index % slideCopy.length],
    img
  }));


  const slider = document.querySelector('.slider');
  const slides = slider.children;
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');

  const slideTitle = document.getElementById('slideTitle');
  const slideDesc = document.getElementById('slideDesc');
  const slideTime = document.getElementById('slideTime');

  let index = 0;

  function showSlide(i) {
    index = (i + slides.length) % slides.length;
    slider.style.transform = `translateX(-${index * 100}%)`;

    // Update text content
    slideTitle.textContent = slidesData[index].title;
    slideDesc.textContent = slidesData[index].desc;
    slideTime.textContent = slidesData[index].time;
  }

  const heroTouch = {
    startX: 0,
    endX: 0,
  };

  function handleHeroTouchStart(event) {
    heroTouch.startX = event.touches[0].clientX;
  }

  function handleHeroTouchMove(event) {
    heroTouch.endX = event.touches[0].clientX;
  }

  function handleHeroTouchEnd() {
    const diff = heroTouch.startX - heroTouch.endX;
    if (Math.abs(diff) > 50) {
      showSlide(diff > 0 ? index + 1 : index - 1);
    }
  }

  slider.addEventListener('touchstart', handleHeroTouchStart, { passive: true });
  slider.addEventListener('touchmove', handleHeroTouchMove, { passive: true });
  slider.addEventListener('touchend', handleHeroTouchEnd);

  prevBtn.addEventListener('click', () => showSlide(index - 1));
  nextBtn.addEventListener('click', () => showSlide(index + 1));

  // Auto-slide every 5s
  setInterval(() => showSlide(index + 1), 5000);

  // Initialize first slide
  showSlide(0);

});
</script>

<script>
const texts = ["WORLD BEACH", "WHERE GOOD VIBES MEET GREAT TASTE."];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";
let isDeleting = false;

function type() {
  currentText = texts[count];
  if (isDeleting) {
    letter = currentText.substring(0, --index);
  } else {
    letter = currentText.substring(0, ++index);
  }

  document.getElementById("typingText").textContent = letter;

  let speed = isDeleting ? 60 : 100;

  if (!isDeleting && letter.length === currentText.length) {
    speed = 1500;
    isDeleting = true;
  } else if (isDeleting && letter.length === 0) {
    isDeleting = false;
    count = (count + 1) % texts.length;
    speed = 500;
  }

  setTimeout(type, speed);
}

document.addEventListener("DOMContentLoaded", type);
</script>


  <script>
  AOS.init({ duration: 700, offset: 120, once: true });

  // 🆕 Dark mode toggle with persistence
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  const qrLogoLight = @json($qrLogoLight);
  const qrLogoDark = @json($qrLogoDark);

  function setTheme(isDark) {
  const logo = document.getElementById('siteLogo');

  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    sunIcon?.classList.remove('hidden');
    moonIcon?.classList.add('hidden');

    if (logo) logo.src = qrLogoDark;
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    moonIcon?.classList.remove('hidden');
    sunIcon?.classList.add('hidden');

    if (logo) logo.src = qrLogoLight;
  }
}


  // 🔹 Determine default theme
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    // Use stored preference
    setTheme(storedTheme === 'dark');
  } else {
    // No preference: set based on time
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour >= 18; // Night: 6 PM – 6 AM
    setTheme(isNight);
  }

  // Toggle manually
  themeToggle.addEventListener('click', () => {
    setTheme(!document.documentElement.classList.contains('dark'));
  });
</script>


</body>
</html>

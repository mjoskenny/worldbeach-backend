<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - @yield('title')</title>

    <!-- Vite CSS & JS -->
    @vite('resources/css/app.css')

    <!-- Feather Icons (optional) -->
    <script src="https://unpkg.com/feather-icons"></script>
    
    <!-- Alpine.js (optional, for interactivity) -->
    <script src="//unpkg.com/alpinejs" defer></script>
</head>
<body class="bg-gray-100 flex h-screen" x-data="{ sidebarOpen: false, sidebarExpanded: true }">

    <!-- Mobile Overlay Sidebar -->
    <div class="fixed inset-0 z-40 lg:hidden" x-show="sidebarOpen" x-transition.opacity>
        <div class="absolute inset-0 bg-black/50" @click="sidebarOpen = false"></div>
        <aside class="fixed inset-y-0 left-0 w-64 bg-white/10 backdrop-blur-lg shadow-xl p-6"
               x-transition:enter="transition transform duration-300"
               x-transition:enter-start="-translate-x-full"
               x-transition:enter-end="translate-x-0"
               x-transition:leave="transition transform duration-300"
               x-transition:leave-start="translate-x-0"
               x-transition:leave-end="-translate-x-full">
            @include('admin.partials.sidebar-links')
        </aside>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex flex-col justify-between p-6 bg-white/10 backdrop-blur-lg shadow-xl"
           :class="sidebarExpanded ? 'w-64' : 'w-20'">
        @include('admin.partials.sidebar-links', ['desktop' => true])
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
        @include('admin.partials.header', ['sidebarExpanded' => 'sidebarExpanded'])
        <main class="flex-1 p-6">
            @yield('content')
        </main>
        @include('admin.partials.footer')
    </div>

    <script>
        feather.replace()
    </script>
</body>
</html>

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>
        

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite('resources/css/app.css')
        <script src="//unpkg.com/alpinejs" defer></script>
    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
            @include('layouts.navigation')

            <nav class="bg-gray-900 text-white p-4 flex justify-between">
    <div>
        <a href="/admin" class="font-bold text-lg">World Beach Admin</a>
    </div>
    <div class="space-x-4">
        <a href="{{ route('admin.categories.index') }}">Categories</a>
        <a href="{{ route('admin.menu-items.index') }}">Menu Items</a>
        <form method="POST" action="{{ route('logout') }}" class="inline">
            @csrf
            <button class="text-red-400 hover:text-red-600">Logout</button>
        </form>
    </div>
</nav>


            <!-- Page Heading -->
            @if (isset($header))
                <header class="bg-white dark:bg-gray-800 shadow">
                    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {{ $header }}
                    </div>
                </header>
            @endif

            <!-- Page Content -->
           <main>
    @yield('content')
</main>
        </div>
    </body>
</html>

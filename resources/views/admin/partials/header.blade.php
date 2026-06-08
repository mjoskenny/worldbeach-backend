<header class="bg-white shadow flex justify-between items-center px-6 py-4">
    <h1 class="text-xl font-semibold text-gray-800">@yield('page_title', 'Dashboard')</h1>
    <div class="flex items-center space-x-4">
        <span class="text-gray-600">Hello, {{ Auth::user()->name ?? 'Admin' }}</span>
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                Logout
            </button>
        </form>
    </div>
</header>

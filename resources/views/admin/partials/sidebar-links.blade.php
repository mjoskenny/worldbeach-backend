<div class="flex flex-col h-full justify-between">
    <!-- Links -->
    <div class="flex flex-col gap-4">
        <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-3 p-3 rounded-lg text-white font-medium hover:opacity-90 bg-gradient-to-r from-blue-500 to-blue-700">
            <i data-feather="home"></i>
            @if(!isset($desktop) || $desktop && $sidebarExpanded) <span>Dashboard</span> @endif
        </a>
        <a href="{{ route('admin.categories.index') }}" class="flex items-center gap-3 p-3 rounded-lg text-white font-medium hover:opacity-90 bg-gradient-to-r from-blue-500 to-blue-700">
            <i data-feather="tag"></i>
            @if(!isset($desktop) || $desktop && $sidebarExpanded) <span>Categories</span> @endif
        </a>
        <a href="{{ route('admin.menu-items.index') }}" class="flex items-center gap-3 p-3 rounded-lg text-white font-medium hover:opacity-90 bg-gradient-to-r from-blue-500 to-blue-700">
            <i data-feather="coffee"></i>
            @if(!isset($desktop) || $desktop && $sidebarExpanded) <span>Menu Items</span> @endif
        </a>
        <a href="{{ route('admin.users.index') }}" class="flex items-center gap-3 p-3 rounded-lg text-white font-medium hover:opacity-90 bg-gradient-to-r from-blue-500 to-blue-700">
            <i data-feather="users"></i>
            @if(!isset($desktop) || $desktop && $sidebarExpanded) <span>Users</span> @endif
        </a>
    </div>

    <!-- Logout -->
    <div>
        <a href="{{ route('logout') }}"
               onclick="event.preventDefault(); document.getElementById('logout-form').submit();"
               class="ml-4 text-red-500 hover:text-red-700 font-semibold px-4 py-2 rounded transition-colors">
                Logout
            </a>

            <!-- Hidden Logout Form -->
            <form id="logout-form" action="{{ route('logout') }}" method="POST" class="hidden">
                @csrf
            </form>
    </div>
</div>

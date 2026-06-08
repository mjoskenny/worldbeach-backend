import React, { useEffect, useRef, useState } from 'react';
import { CategoryNav } from '../components/CategoryNav';
import { MenuItemCard } from '../components/MenuItemCard';
import { Category, MenuItem } from '../types/menu';
import { Search, X, ArrowUp } from 'lucide-react';

/* =====================================================
   MENU PAGE
===================================================== */

export const Menu: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categoryRefs = useRef<Record<number, HTMLDivElement | null>>({});

  /* =========================
     FETCH DATA
     ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/menu-items'),
        ]);

        const cats: Category[] = await catRes.json();
        const items: MenuItem[] = await itemRes.json();

        setCategories(cats);
        setMenuItems(items);

        if (cats.length > 0) {
          setActiveCategory(cats[0].id);
        }
      } catch (error) {
        console.error('Menu fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================
     SCROLL TRACKING
     ========================= */
  useEffect(() => {
    if (!categories.length) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;

      for (const category of categories) {
        const el = categoryRefs.current[category.id];
        if (!el) continue;

        if (
          scrollPos >= el.offsetTop &&
          scrollPos < el.offsetTop + el.offsetHeight
        ) {
          setActiveCategory(category.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  /* =========================
     FILTERING
     ========================= */
  const filteredItems = menuItems.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.description ?? '').toLowerCase().includes(q)
    );
  });

  const groupedItems = categories.reduce<Record<number, MenuItem[]>>(
    (acc, category) => {
      acc[category.id] = filteredItems.filter(
        item => item.category_id === category.id
      );
      return acc;
    },
    {}
  );

  /* =========================
     LOADING STATE
     ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading menu...</p>
      </div>
    );
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-[#042029]/50">

      {/* HERO */}
      <div
        className="relative text-white py-20"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1618282013529-e22bcfc99131)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00B4D8]/90 to-[#0077B6]/90" />
        <div className="relative z-10 text-center px-4 py-16">
          <h1 className="text-4xl md:text-6xl mb-4">Our Menu</h1>
          <p className="max-w-xl mx-auto mb-6 text-white/90">
            Discover our handcrafted dishes and tropical flavors
          </p>

          {/* SEARCH */}
          <div className="relative max-w-xl mx-auto px-4 sm:px-0">
            <Search className="absolute left-6 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="w-full pl-11 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 md:py-4 rounded-full bg-white text-[#042029] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7D9A4] text-sm sm:text-base shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-6 sm:right-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CATEGORY NAV */}
      {activeCategory !== null && (
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={id => {
            setActiveCategory(id);
            const el = categoryRefs.current[id];
            if (el) {
              window.scrollTo({
                top: el.offsetTop - 140,
                behavior: 'smooth',
              });
            }
          }}
        />
      )}

      {/* MENU SECTIONS */}
      <div className="container mx-auto px-4 py-8">
        {categories.map(category => {
          const items = groupedItems[category.id] || [];

          if (searchQuery && items.length === 0) return null;
          const categoryItems = groupedItems[category.id];
          
          if (searchQuery && categoryItems.length === 0) {
            return null;
          }

          return (
            <section
              key={category.id}
              ref={el => (categoryRefs.current[category.id] = el)}
              className="mb-12"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#042029] dark:text-white mb-2">{category.name}</h2>
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[#00B4D8] to-[#0077B6] rounded-full mb-8" />
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-white/70">
                    {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* BACK TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#00B4D8] text-white flex items-center justify-center"
      >
        <ArrowUp />
      </button>
    </div>
  );
};

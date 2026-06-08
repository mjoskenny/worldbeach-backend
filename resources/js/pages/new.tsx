import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CategoryNav } from '../components/CategoryNav';
import { MenuItemCard } from '../components/MenuItemCard';
import { menuItems, categories } from '../data/menuData';
import { motion } from 'framer-motion';
import { Search, X, ArrowUp } from 'lucide-react';

export const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = categoryRefs.current[categoryId];
    if (element) {
      const headerHeight = 80;
      const categoryNavHeight = 60;
      const offset = headerHeight + categoryNavHeight + 20;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset + 200;

      for (const category of categories) {
        const element = categoryRefs.current[category.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const groupedItems = categories.reduce((acc, category) => {
    acc[category.id] = filteredItems.filter((item) => item.category === category.id);
    return acc;
  }, {} as { [key: string]: typeof menuItems });

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-[#042029]/50">
      {/* Hero Header */}
      <div 
        className="relative text-white py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1618282013529-e22bcfc99131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbWVudSUyMGZvb2R8ZW58MXx8fHwxNzY3MDA4MjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00B4D8]/90 to-[#0077B6]/90" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 md:mb-6">
              Our Menu
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 px-4 sm:px-0">
              Discover our selection of fresh seafood, handcrafted dishes, and tropical flavors
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto px-4 sm:px-0">
              <Search className="absolute left-6 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 md:py-4 rounded-full bg-white text-[#042029] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7D9A4] text-sm sm:text-base shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-6 sm:right-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </button>
              )}
            </div>

            {searchQuery && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm sm:text-base text-white/80"
              >
                Found {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Category Navigation */}
      <CategoryNav activeCategory={activeCategory} onCategoryClick={handleCategoryClick} />

      {/* Menu Sections */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 lg:py-16">
        {/* No Results Message */}
        {searchQuery && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-16 md:py-20"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-white/40" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 text-[#042029] dark:text-white">
              No menu items found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-white/60 mb-6 sm:mb-8">
              Try searching with different keywords
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg text-sm sm:text-base"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {/* Menu Categories */}
        {categories.map((category) => {
          const categoryItems = groupedItems[category.id];
          
          if (searchQuery && categoryItems.length === 0) {
            return null;
          }

          return (
            <section
              key={category.id}
              id={category.id}
              ref={(el) => (categoryRefs.current[category.id] = el)}
              className="mb-12 sm:mb-16 md:mb-20"
            >
              {/* Category Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 sm:mb-8 md:mb-10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#042029] dark:text-white mb-2">
                      {category.name}
                    </h2>
                    <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[#00B4D8] to-[#0077B6] rounded-full" />
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-white/70">
                    {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                  </div>
                </div>
                {category.description && (
                  <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-3xl">
                    {category.description}
                  </p>
                )}
              </motion.div>

              {/* Menu Items Grid */}
              {categoryItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {categoryItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ delay: Math.min(index * 0.05, 0.3) }}
                    >
                      <MenuItemCard item={item} />
                    </motion.div>
                  ))}
                </div>
              ) : !searchQuery ? (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-sm sm:text-base text-gray-500 dark:text-white/60">
                    No items available in this category
                  </p>
                </div>
              ) : null}
            </section>
          );
        })}

        {/* All Items Shown Message */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-8 sm:py-12 border-t border-gray-200 dark:border-white/10"
          >
            <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 mb-4">
              You've reached the end of our menu
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 sm:px-8 py-3 rounded-full border-2 border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-all text-sm sm:text-base w-full sm:w-auto"
              >
                Back to Top
              </button>
              <Link
                to="/contact"
                className="px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg text-sm sm:text-base w-full sm:w-auto text-center"
              >
                Reserve a Table
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-4 sm:right-6 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
    </div>
  );
};

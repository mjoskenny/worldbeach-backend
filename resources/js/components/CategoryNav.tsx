import React, { useEffect, useRef, useState } from 'react';
import { Category } from '../types/menu';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: number;
  onCategoryClick: (categoryId: number) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      setIsSticky(rect.top <= 80);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={navRef}
      className={`sticky top-20 z-40 transition-all duration-300 ${
        isSticky
          ? 'bg-white/95 dark:bg-[#042029]/95 backdrop-blur-lg shadow-lg'
          : 'bg-white dark:bg-[#042029]'
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto py-3 sm:py-4 hide-scrollbar">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className={`flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full whitespace-nowrap transition-all duration-200 text-sm sm:text-base ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-white/10 text-[#042029] dark:text-white hover:bg-[#F7D9A4]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { MenuItem } from '../types/menu';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'framer-motion';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all border border-gray-100 dark:border-white/10 h-full flex flex-col"
    >
      <Link to={`/menu/${item.id}`} className="flex-1 flex flex-col">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={
              item.image
                ? item.image.startsWith('http')
                  ? item.image
                  : `/storage/${item.image}`
                : '/placeholder.png'
            }
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {item.featured && (
            <span className="absolute top-4 left-4 z-10 rounded-full bg-[#FF6B35] px-4 py-1 text-sm font-semibold text-white shadow-lg">
              Featured
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-semibold mb-2 text-[#042029] dark:text-white">
            {item.name}
          </h3>

          {item.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-xl text-[#00B4D8] font-semibold">
              {Number(item.price).toLocaleString()} Fbu
            </p>

            <button
              onClick={handleAddToCart}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

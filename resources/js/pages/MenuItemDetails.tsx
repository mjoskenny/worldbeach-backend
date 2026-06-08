import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart, Star, Clock, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { MenuItemCard } from '../components/MenuItemCard';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  image: string;
  featured?: boolean;
  special?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export const MenuItemDetails: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [relatedItems, setRelatedItems] = useState<MenuItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH ITEM AND CATEGORY
  ========================= */
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);

        // Fetch item details
        const res = await fetch(`/api/menu-items/${itemId}`);
        if (!res.ok) throw new Error('Item not found');
        const data: MenuItem = await res.json();
        setItem(data);

        // Fetch category name
        const catRes = await fetch(`/api/categories/${data.category_id}`);
        if (!catRes.ok) throw new Error('Category not found');
        const catData: Category = await catRes.json();
        setCategoryName(catData.name);

        // Fetch related items from same category
        const relatedRes = await fetch(`/api/menu-items?category_id=${data.category_id}`);
        if (!relatedRes.ok) throw new Error('Failed to fetch related items');
        const relatedData: MenuItem[] = await relatedRes.json();
        setRelatedItems(relatedData.filter(i => i.id !== data.id).slice(0, 3));

      } catch (error) {
        console.error(error);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const increaseQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decreaseQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    if (!item) return;
    for (let i = 0; i < quantity; i++) addToCart(item);
    toast.success(`${quantity} x ${item.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-lg">Loading item...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Item Not Found</h1>
          <Link to="/menu" className="text-[#00B4D8] hover:underline">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Back Button */}
      <div className="container mx-auto py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#00B4D8] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Main Content */}
      <section className="container mx-auto pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-[500px] object-cover"
                />

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-3">
                  {item.featured && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B35] text-white shadow-xl">
                      <Star className="w-4 h-4 fill-current" />
                      Featured Item
                    </span>
                  )}
                  {item.special && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7D9A4] text-[#042029] shadow-xl">
                      Today's Special
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Category */}
            <div className="mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-[#00B4D8]/10 text-[#00B4D8]">
                {categoryName || 'Category'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl mb-4 text-foreground">
              {item.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl text-[#00B4D8]">
                {item.price.toLocaleString()}
                <span className="text-xl text-gray-500 dark:text-gray-400 ml-2">Fbu</span>
              </p>
            </div>

            {/* Description */}
            <div className="mb-8 p-6 rounded-2xl bg-gray-50 dark:bg-white/5">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {item.description || 'No description available.'}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <Clock className="w-6 h-6 text-[#00B4D8] mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Prep Time</p>
                <p className="text-foreground">15-20 min</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <ChefHat className="w-6 h-6 text-[#00B4D8] mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Cuisine</p>
                <p className="text-foreground">International</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm mb-3 text-gray-600 dark:text-gray-400">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decreaseQuantity}
                  className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center justify-center"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-2xl w-12 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center justify-center"
                  disabled={quantity >= 10}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#00B4D8] text-white hover:bg-[#0077B6] transition-all shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart - {(item.price * quantity).toLocaleString()} Fbu
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-white/5">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">
                You Might Also <span className="text-[#00B4D8]">Like</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                More delicious items from our {categoryName} menu
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedItems.map((relatedItem) => (
                <Link key={relatedItem.id} to={`/menu/${relatedItem.id}`}>
                  <MenuItemCard item={relatedItem} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

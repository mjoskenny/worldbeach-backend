import React from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { QuantityStepper } from './QuantityStepper';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { appImageUrl } from '../lib/api';

export const CartDrawer: React.FC = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-[#042029] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#00B4D8]" />
                <h2 className="text-xl text-[#042029] dark:text-white">
                  Your Cart ({cartCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-white/20 mb-4" />
                  <h3 className="text-lg mb-2 text-gray-900 dark:text-white">Your cart is empty</h3>
                  <p className="text-gray-500 dark:text-white/60 mb-6">
                    Add some delicious items to get started!
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/menu');
                    }}
                    className="px-6 py-3 rounded-full bg-[#00B4D8] text-white hover:bg-[#0077B6] transition-colors"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={
                            appImageUrl(item.image)
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="mb-1 text-[#042029] dark:text-white truncate">{item.name}</h4>
                        <p className="text-[#00B4D8] mb-2">
                          {item.price.toLocaleString()} Fbu
                        </p>
                        <div className="flex items-center justify-between">
                          <QuantityStepper
                            quantity={item.quantity}
                            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                          />
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#042029] dark:text-white">
                          {(item.price * item.quantity).toLocaleString()} Fbu
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 dark:border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-white/70">Subtotal</span>
                  <span className="text-xl text-[#042029] dark:text-white">
                    {cartTotal.toLocaleString()} Fbu
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-4 rounded-full bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90 transition-all hover:shadow-lg hover:shadow-[#FF6B35]/30"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

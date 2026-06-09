import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Sun, Moon, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import logoLight from '../assets/d4a16e8ef77a867b8280234ddb8f940ade2e365a.png';
import logoDark from '../assets/e4ffdc192823569086515323ccd66b5354680a76.png';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { appImageUrl } from '../lib/api';


export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { settings } = useSiteSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check for dark mode preference
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ];

  // Check if we're on the menu page
  const isMenuPage = location.pathname === '/menu';
  const logoSrc = settings.logo_path
    ? appImageUrl(settings.logo_path)
    : isScrolled
      ? (isDark ? logoDark : logoLight)
      : logoLight;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-[#042029]/95 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logoSrc} 
              alt={settings.business_name} 
              className="h-14 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative transition-colors ${ 
                  location.pathname === link.path
                    ? 'text-[#00B4D8] drop-shadow-md'
                    : isScrolled 
                      ? 'text-[#042029] dark:text-white hover:text-[#00B4D8]'
                      : 'text-white hover:text-[#00B4D8] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00B4D8]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Phone */}
            <a
              href={`tel:${settings.phone}`}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white hover:opacity-90 transition-all shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">Call Now</span>
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                isScrolled
                  ? 'hover:bg-gray-100 dark:hover:bg-white/10'
                  : 'hover:bg-white/20 dark:hover:bg-white/10'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-[#F7D9A4] drop-shadow-md" />
              ) : (
                <Moon className={`w-5 h-5 ${isScrolled ? 'text-[#042029]' : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'}`} />
              )}
            </button>

            {/* Cart - Only show on menu page */}
            {isMenuPage && (
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 rounded-full transition-colors ${
                  isScrolled
                    ? 'hover:bg-gray-100 dark:hover:bg-white/10'
                    : 'hover:bg-white/20 dark:hover:bg-white/10'
                }`}
                aria-label="Shopping cart"
              >
                <ShoppingCart className={`w-6 h-6 ${
                  isScrolled 
                    ? 'text-[#042029] dark:text-white' 
                    : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                }`} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF6B35] text-white text-xs flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-full transition-colors ${
                isScrolled
                  ? 'hover:bg-gray-100 dark:hover:bg-white/10'
                  : 'hover:bg-white/20 dark:hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${
                  isScrolled 
                    ? 'text-[#042029] dark:text-white' 
                    : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                }`} />
              ) : (
                <Menu className={`w-6 h-6 ${
                  isScrolled 
                    ? 'text-[#042029] dark:text-white' 
                    : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                }`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-t py-4 ${
                isScrolled 
                  ? 'border-gray-200 dark:border-white/10' 
                  : 'bg-white/95 dark:bg-[#042029]/95 backdrop-blur-lg border-white/20'
              }`}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'bg-[#00B4D8]/10 text-[#00B4D8]'
                      : 'text-[#042029] dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 mt-4 px-4 py-3 rounded-lg bg-[#F7D9A4] text-[#042029] justify-center"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

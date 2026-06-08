import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import logoFooter from '../assets/d4a16e8ef77a867b8280234ddb8f940ade2e365a.png';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { appAssetUrl } from '../lib/api';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { settings } = useSiteSettings();
  const footerLogoSrc = settings.logo_path
    ? appAssetUrl(`storage/${settings.logo_path.replace(/^\/+/, '')}`)
    : logoFooter;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#042029] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={footerLogoSrc} 
                alt={settings.business_name} 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-white/70 text-sm mb-4">{settings.tagline}</p>
            <div className="flex gap-3">
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00B4D8] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00B4D8] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={settings.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00B4D8] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Menu', 'About', 'Gallery', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="text-white/70 hover:text-[#00B4D8] transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/admin"
                  className="text-white/70 hover:text-[#00B4D8] transition-colors text-sm"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#00B4D8] flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="text-white/70 hover:text-[#00B4D8] transition-colors text-sm">
                  {settings.phone}
                </a>
              </li>
              {settings.secondary_phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#00B4D8] flex-shrink-0" />
                  <a href={`tel:${settings.secondary_phone}`} className="text-white/70 hover:text-[#00B4D8] transition-colors text-sm">
                    {settings.secondary_phone}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#00B4D8] flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-white/70 hover:text-[#00B4D8] transition-colors text-sm">
                  {settings.email}
                </a>
              </li>
              {settings.secondary_email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#00B4D8] flex-shrink-0" />
                  <a href={`mailto:${settings.secondary_email}`} className="text-white/70 hover:text-[#00B4D8] transition-colors text-sm">
                    {settings.secondary_email}
                  </a>
                </li>
              )}
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-white/70">Opening Hours</p>
              <p className="text-sm text-white/90 mt-1">Mon-Fri: {settings.weekday_hours}</p>
              <p className="text-sm text-white/90">Sat-Sun: {settings.weekend_hours}</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4">Newsletter</h3>
            <p className="text-white/70 text-sm mb-4">
              Subscribe to get special offers and updates
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white hover:opacity-90 transition-all shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} {settings.business_name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-white/50 hover:text-[#00B4D8] transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/50 hover:text-[#00B4D8] transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

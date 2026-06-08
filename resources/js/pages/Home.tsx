import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TypingText } from '../components/TypingText';
import { ImageSlider } from '../components/ImageSlider';
import { MenuItemCard } from '../components/MenuItemCard';
import { Clock, Phone, MapPin, Award, Utensils, Users, Waves, Ticket, Calendar, Mail, MapPinIcon, Camera, Info, Baby, PartyPopper, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ChevronRight } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

import { Space } from '../types/spaces'; // create a Space type like Event/MenuItem
import { Service } from '../types/services';

export const SpacesList: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const data: Space[] = await apiGet<Space[]>('/spaces');
        setSpaces(data);
      } catch (error) {
        console.error('Failed to fetch spaces', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  if (loading) return <p className="text-center text-gray-500 dark:text-white/50">Loading spaces...</p>;
  if (spaces.length === 0) return <p className="text-center text-gray-500 dark:text-white/50 mb-16">No spaces available.</p>;

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {spaces.map((space, index) => (
        <motion.div
          key={space.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
        >
          <div className="relative h-64 overflow-hidden">
            

            <ImageWithFallback
  src={
    space.image
      ? space.image.startsWith('http')
        ? space.image
        : appAssetUrl(space.image)
      : '/placeholder.png'
  }
  alt={space.title || 'Untitled'}
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#042029]/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl text-white">{space.title}</h3>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};



import { Event } from '../types/events';
import { Gallery } from '../types/gallery';
import { apiGet, appAssetUrl } from '../lib/api';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch upcoming events (you can filter in backend or frontend)
        const data: Event[] = await apiGet<Event[]>('/events');
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 dark:text-white/50">Loading events...</p>;
  }

  if (events.length === 0) {
    return <p className="text-center text-gray-500 dark:text-white/50 mb-16">No upcoming events.</p>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
        >
          <div className="relative h-48 overflow-hidden">
            
              <ImageWithFallback
                        src={event.image ? getGalleryImageSrc(event.image) : '/placeholder.png'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {event.featured && (
  <span className="absolute top-4 left-4 z-10 rounded-full bg-[#FF6B35] px-4 py-1 text-sm font-semibold text-white shadow-lg">
    Featured
  </span>
)}
            <div className="absolute inset-0 bg-gradient-to-t from-[#042029]/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FF6B35] text-white text-xs mb-2">
                {event.date}
              </span>
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-xl mb-2 text-[#042029] dark:text-white">{event.title}</h3>
            <p className="text-sm text-gray-600 dark:text-white/70 mb-3">
              <Clock className="w-4 h-4 inline mr-1" />
              {event.time}
            </p>
            <div className="flex items-center justify-between">
              {/* Show lowest price from variants */}
              <span className="text-lg text-[#00B4D8]">
                {event.variants.length > 0
                  ? `${Math.min(...event.variants.map(v => v.price)).toLocaleString()} Fbu`
                  : 'N/A'}
              </span>
              <Link
                to={`/events/${event.id}`}
                className="px-4 py-2 rounded-full bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors text-sm"
              >
                Get Tickets
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};



const getGalleryImageSrc = (image?: string) => {
  if (!image) return '/placeholder.png';

  const normalizedImage = image.replace(/\\/g, '/').trim();

  if (normalizedImage.startsWith('http://') || normalizedImage.startsWith('https://')) {
    return normalizedImage;
  }

  if (normalizedImage.startsWith('/storage/')) {
    return appAssetUrl(normalizedImage);
  }

  if (normalizedImage.startsWith('storage/')) {
    return appAssetUrl(normalizedImage);
  }

  if (normalizedImage.startsWith('/')) {
    return appAssetUrl(normalizedImage);
  }

  return appAssetUrl(`storage/${normalizedImage.replace(/^\/+/, '')}`);
};

const GalleryList: React.FC<{ galleries: Gallery[]; loading: boolean }> = ({ galleries, loading }) => {
  if (loading) {
    return <p className="text-center text-gray-500 dark:text-white/50">Loading gallery...</p>;
  }

  if (galleries.length === 0) {
    return <p className="text-center text-gray-500 dark:text-white/50 mb-16">No gallery items available.</p>;
  }

  return (
    <>
      {/* First Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {galleries.slice(0, 4).map((gallery, index) => (
          <motion.div
            key={gallery.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
          >
            <ImageWithFallback
              src={getGalleryImageSrc(gallery.image)}
              alt={gallery.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#042029]/90 via-[#042029]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-xs text-[#F7D9A4] mb-1">{gallery.date}</p>
              <h3 className="text-white text-sm">{gallery.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {galleries.slice(4, 8).map((gallery, index) => (
          <motion.div
            key={gallery.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
          >
            <ImageWithFallback
              src={getGalleryImageSrc(gallery.image)}
              alt={gallery.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#042029]/90 via-[#042029]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-xs text-[#F7D9A4] mb-1">{gallery.date}</p>
              <h3 className="text-white text-sm">{gallery.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};


import { MenuItem } from '../types/menu';

export const Home: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const { settings } = useSiteSettings();
  const businessNameParts = (settings.business_name || 'World Beach Burundi').trim().split(/\s+/);
  const heroTitlePrimary = businessNameParts.slice(0, 2).join(' ') || settings.business_name;
  const heroTitleSecondary =
    businessNameParts.slice(2).join(' ') ||
    businessNameParts.slice(0, 1).join(' ') ||
    settings.business_name;

  const [previewItems, setPreviewItems] = useState<MenuItem[]>([]);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState<Gallery[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const fetchPreviewItems = async () => {
      try {
        const res = await fetch('/api/menu-items?featured=true');
        const data: MenuItem[] = await res.json();

        // Shuffle array (Fisher–Yates)
        const shuffled = [...data].sort(() => 0.5 - Math.random());

        // Take first 3 random items
        setPreviewItems(shuffled.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch menu preview', error);
      } finally {
        setPreviewLoading(false);
      }
    };

    fetchPreviewItems();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data: Service[] = await apiGet<Service[]>('/services');
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services', error);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const data: Gallery[] = await apiGet<Gallery[]>('/gallery-data');
        setGalleryItems(data);
      } catch (error) {
        console.error('Failed to fetch galleries', error);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const getGalleryByCategory = (category: string) =>
    galleryItems.filter((item) => item.category === category);

  const heroGallery = getGalleryByCategory('hero');
  const aboutGallery = getGalleryByCategory('about');
  const homeGallery = getGalleryByCategory('gallery');
  const carouselGallery = getGalleryByCategory('carousel');
  const upcomingEventGallery = getGalleryByCategory('upcoming_event');
  const hostEventGallery = getGalleryByCategory('host_event');

  const heroBackgroundImage = getGalleryImageSrc(heroGallery[0]?.image);
  const aboutImages = (aboutGallery.length > 0 ? aboutGallery : homeGallery).slice(0, 4);
  const upcomingEventImage = getGalleryImageSrc(upcomingEventGallery[0]?.image || homeGallery[0]?.image);
  const hostEventImage = getGalleryImageSrc(hostEventGallery[0]?.image || homeGallery[0]?.image);
  const galleryPreviewImage = getGalleryImageSrc(homeGallery[0]?.image || aboutGallery[0]?.image);

  const typingPhrases = [
    'Fresh Seafood by the Lake',
    'Tropical Cocktails & Sunsets',
    'Where Every Meal is a Celebration',
    'Your Beach Escape in Burundi',
  ];




  const heroSlides = carouselGallery.map((slide, index) => {
    const actions = [
      { buttonText: 'View Events', buttonLink: '/events', buttonColor: 'bg-[#FF6B35]' },
      { buttonText: 'View Menu', buttonLink: '/menu', buttonColor: 'bg-[#00B4D8]' },
      { buttonText: 'Book Now', buttonLink: '/host-event', buttonColor: 'bg-[#F7D9A4] text-[#042029]' },
    ];
    const action = actions[index] || { buttonText: 'Learn More', buttonLink: '/gallery', buttonColor: 'bg-[#00B4D8]' };

    return {
      id: String(slide.id),
      image: getGalleryImageSrc(slide.image),
      title: slide.title || `Slide ${index + 1}`,
      description: slide.description || `Discover more at ${settings.business_name}.`,
      ...action,
    };
  });

  

  return (
    <div className="min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBackgroundImage})`
          }}
        />

        {/* Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#042029]/70 via-[#042029]/50 to-[#042029]/70"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6">
                <span className="block mb-3 bg-gradient-to-r from-white via-[#F7D9A4] to-white bg-clip-text text-transparent drop-shadow-2xl font-extrabold tracking-tight">
                  {heroTitlePrimary}
                </span>
                {heroTitleSecondary && heroTitleSecondary !== heroTitlePrimary && (
                  <span className="text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-[#F7D9A4] via-[#FFE4B5] to-[#F7D9A4] bg-clip-text text-transparent drop-shadow-2xl font-bold italic tracking-wide">
                    {heroTitleSecondary}
                  </span>
                )}
              </h1>
              <div className="text-xl md:text-2xl mb-8 h-16 flex items-center justify-center">
                <TypingText phrases={typingPhrases} className="text-[#00B4D8]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center mb-12"
            >
              <Link
                to="/menu"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                View Menu
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                Book a Table
              </Link>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6 justify-center text-sm"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#F7D9A4]" />
                <span>Open: {settings.weekday_hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#F7D9A4]" />
                <a href={`tel:${settings.phone}`} className="hover:text-[#00B4D8] transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F7D9A4]" />
                <span>{settings.address}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Dynamic Carousel Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-[#042029] dark:to-[#042029]/80">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 p-8">
                <div className="h-80">
                  {heroSlides.length > 0 ? (
                    <ImageSlider slides={heroSlides} />
                  ) : (
                    <ImageWithFallback
                      src={heroBackgroundImage}
                      alt={settings.business_name}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="inline-block px-4 py-2 rounded-full bg-[#FF6B35] text-white text-sm mb-4 w-fit">
                    What's New
                  </span>
                  <h2 className="text-3xl mb-4 text-[#042029] dark:text-white">
                    Your Paradise Awaits
                  </h2>
                  <p className="text-gray-600 dark:text-white/70 mb-6">
                    From beachside dining to unforgettable events, {settings.business_name} offers the perfect setting for every occasion. Explore our menu, join our upcoming events, or host your own celebration by the lake.
                  </p>
                  <div className="flex gap-4">
                    <Link
                      to="/menu"
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
                    >
                      View Menu
                    </Link>
                    <Link
                      to="/events"
                      className="px-6 py-3 rounded-full border-2 border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors inline-block text-center"
                    >
                      See Events
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white dark:bg-[#042029] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-8 h-8 text-[#00B4D8]" />
                <h2 className="text-4xl text-[#042029] dark:text-white">
                  {settings.about_title || `About ${settings.business_name}`}
                </h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-white/70 mb-6">
                {settings.about_description ||
                  `Welcome to ${settings.business_name}, where great hospitality and memorable experiences come together.`}
              </p>
              <p className="text-lg text-gray-600 dark:text-white/70 mb-6">
                {settings.about_history ||
                  "Our restaurant combines fresh, locally-sourced ingredients with international culinary expertise to deliver dishes that celebrate both traditional and contemporary flavors."}
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all hover:shadow-lg group"
              >
                Learn More About Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <ImageWithFallback
                    src={getGalleryImageSrc(aboutImages[0]?.image)}
                    alt={aboutImages[0]?.title || `About ${settings.business_name}`}
                    className="rounded-2xl w-full h-48 object-cover"
                  />
                  <ImageWithFallback
                    src={getGalleryImageSrc(aboutImages[1]?.image || aboutImages[0]?.image)}
                    alt={aboutImages[1]?.title || `${settings.business_name} view`}
                    className="rounded-2xl w-full h-64 object-cover"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <ImageWithFallback
                    src={getGalleryImageSrc(aboutImages[2]?.image || aboutImages[0]?.image)}
                    alt={aboutImages[2]?.title || `${settings.business_name} dining`}
                    className="rounded-2xl w-full h-64 object-cover"
                  />
                  <ImageWithFallback
                    src={getGalleryImageSrc(aboutImages[3]?.image || aboutImages[1]?.image || aboutImages[0]?.image)}
                    alt={aboutImages[3]?.title || `${settings.business_name} moments`}
                    className="rounded-2xl w-full h-48 object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================
    MENU SNEAK PEEK
========================= */}
<section className="py-16 bg-white dark:bg-[#042029]">
  <div className="container mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <Sparkles className="w-8 h-8 text-[#F7D9A4]" />
        <h2 className="text-4xl text-[#042029] dark:text-white">
          Menu Sneak Peek
        </h2>
        <Sparkles className="w-8 h-8 text-[#F7D9A4]" />
      </div>

      <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
        A taste of our delicious offerings — freshly prepared and inspired by the coast.
      </p>
    </motion.div>

    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {previewLoading ? (
        <p className="col-span-3 text-center text-gray-500 dark:text-white/50">
          Loading menu...
        </p>
      ) : previewItems.length > 0 ? (
        previewItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <MenuItemCard item={item} />
          </motion.div>
        ))
      ) : (
        <p className="col-span-3 text-center text-gray-500 dark:text-white/50">
          No menu items available.
        </p>
      )}
    </div>

    <div className="text-center">
      <Link
        to="/menu"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white hover:opacity-90 transition-all shadow-lg hover:shadow-xl group"
      >
        Explore Full Menu
        <motion.div
          animate={{ x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </Link>
    </div>
  </div>
</section>


      {/* Upcoming Events */}
<section className="py-16 bg-gray-50 dark:bg-[#042029]/50">
  <div className="container mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-4xl mb-4 text-[#042029] dark:text-white">Upcoming Events</h2>
      <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
        Join us for live music, beach parties, and special celebrations
      </p>
    </motion.div>

    <EventList />

    <div className="text-center">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg group"
      >
        View All Events
        <motion.div
          animate={{ x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </Link>
    </div>
  </div>
</section>


      {/* Past Events / Gallery */}
      <section className="py-16 bg-white dark:bg-[#042029] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4 text-[#042029] dark:text-white">Past Events & Memories</h2>
            <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Relive the magic of our previous celebrations
            </p>
          </motion.div>

          <GalleryList galleries={homeGallery} loading={galleryLoading} />

          <div className="text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors group"
            >
              View Full Gallery
              <Camera className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Venue Spaces Gallery */}
      <section className="py-16 bg-gray-50 dark:bg-[#042029]/50">
  <div className="container mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-4xl mb-4 text-[#042029] dark:text-white">Our Spaces</h2>
      <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
        Explore our beautiful beachfront venue and facilities
      </p>
    </motion.div>

    <SpacesList />

    <div className="text-center">
      <Link
        to="/spaces"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg group"
      >
        Explore All Spaces
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </div>
</section>


      {/* Why Choose Us */}
      <section className="py-16 bg-white dark:bg-[#042029]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4 text-[#042029] dark:text-white">Why {settings.business_name}?</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Award className="w-12 h-12 text-[#00B4D8]" />,
                title: 'Award-Winning Cuisine',
                description: 'Recognized for excellence in fusion and seafood cuisine',
              },
              {
                icon: <Utensils className="w-12 h-12 text-[#00B4D8]" />,
                title: 'Fresh Ingredients',
                description: 'Daily fresh catch from Lake Tanganyika and local farms',
              },
              {
                icon: <Users className="w-12 h-12 text-[#00B4D8]" />,
                title: 'Exceptional Service',
                description: 'Our team is dedicated to making every visit memorable',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00B4D8]/10 dark:bg-white/5 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl mb-2 text-[#042029] dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services & Activities */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-[#042029]/80 dark:to-[#042029]">
      
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4 text-[#042029] dark:text-white">Activities & Services</h2>
            <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              More than just dining - enjoy our full range of beach activities and amenities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesLoading ? (
              <div className="col-span-4 text-center text-gray-500 dark:text-white/50 py-12">
                Loading services...
              </div>
            ) : services.length === 0 ? (
              <div className="col-span-4 text-center text-gray-500 dark:text-white/50 py-12">
                No services available.
              </div>
            ) : (
              services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={service.image ? getGalleryImageSrc(service.image) : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080'}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#042029]/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: service.color || '#00B4D8' }}
                      >
                        {service.title?.charAt(0) ?? 'S'}
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg mb-2 text-[#042029] dark:text-white">{service.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-white/70 mb-4">{service.description}</p>

                    {service.features?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Features:</p>
                        <ul className="grid grid-cols-2 gap-2">
                          {service.features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-[#00B4D8]" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {service.features.length > 4 && (
                          <p className="text-xs text-[#00B4D8] mt-2">+{service.features.length - 4} more</p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/services"
                className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
              >
                View All Services
              </Link>
              <Link
                to="/spaces"
                className="inline-block px-8 py-3 rounded-full border-2 border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors"
              >
                Explore Our Spaces
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events & Booking */}
      <section className="py-16 bg-white dark:bg-[#042029]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl mb-4 text-[#042029] dark:text-white">Events & Special Occasions</h2>
              <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
                Host your special events at {settings.business_name} - from corporate gatherings to weddings and parties
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-3xl overflow-hidden"
              >
                <div className="relative h-64">
                  <ImageWithFallback
                    src={upcomingEventImage}
                    alt={upcomingEventGallery[0]?.title || 'Upcoming Events'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#042029]/70 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket className="w-6 h-6 text-[#00B4D8]" />
                    <h3 className="text-2xl text-[#042029] dark:text-white">Upcoming Events</h3>
                  </div>
                  <p className="text-gray-600 dark:text-white/70 mb-4">
                    Join us for live music nights, beach parties, cultural festivals, and seasonal celebrations
                  </p>
                  <Link
                    to="/events"
                    className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
                  >
                    View All Events
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-3xl overflow-hidden"
              >
                <div className="relative h-64">
                  <ImageWithFallback
                    src={hostEventImage}
                    alt={hostEventGallery[0]?.title || 'Host Your Event'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#042029]/70 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-6 h-6 text-[#FF6B35]" />
                    <h3 className="text-2xl text-[#042029] dark:text-white">Host Your Event</h3>
                  </div>
                  <p className="text-gray-600 dark:text-white/70 mb-4">
                    Book our venue for weddings, corporate events, birthdays, and private parties. Customized packages available
                  </p>
                  <Link
                    to="/host-event"
                    className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white hover:opacity-90 transition-all shadow-lg"
                  >
                    Host Event
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Previews - About, Gallery, Contact */}
      <section className="py-16 bg-gray-50 dark:bg-[#042029]/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* About Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 hover:shadow-xl transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-[#00B4D8]/10 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Info className="w-8 h-8 text-[#00B4D8]" />
              </div>
              <h3 className="text-2xl mb-3 text-[#042029] dark:text-white">
                {settings.about_title || 'About Us'}
              </h3>
              <p className="text-gray-600 dark:text-white/70 mb-6">
                {settings.about_description ||
                  `Discover the story behind ${settings.business_name} - a unique destination combining exquisite dining with unforgettable atmosphere.`}
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#00B4D8] hover:gap-3 transition-all"
              >
                Learn More
                <span>→</span>
              </Link>
            </motion.div>

            {/* Gallery Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="relative h-48">
                <ImageWithFallback
                  src={galleryPreviewImage}
                  alt={homeGallery[0]?.title || 'Gallery'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042029]/70 to-transparent" />
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl mb-3 text-[#042029] dark:text-white">Gallery</h3>
                <p className="text-gray-600 dark:text-white/70 mb-4">
                  Browse our collection of stunning photos showcasing our venue, dishes, and memorable moments.
                </p>
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-2 text-[#00B4D8] hover:gap-3 transition-all"
                >
                  View Gallery
                  <span>→</span>
                </Link>
              </div>
            </motion.div>

            {/* Contact Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-8 hover:shadow-xl transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-[#FF6B35]/10 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8 text-[#FF6B35]" />
              </div>
              <h3 className="text-2xl mb-3 text-[#042029] dark:text-white">Get in Touch</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 text-gray-600 dark:text-white/70">
                  <Phone className="w-5 h-5 mt-1 text-[#00B4D8]" />
                  <div>
                    <p className="text-sm">{settings.phone}</p>
                    {settings.secondary_phone && <p className="text-sm">{settings.secondary_phone}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-600 dark:text-white/70">
                  <MapPinIcon className="w-5 h-5 mt-1 text-[#00B4D8]" />
                  <p className="text-sm whitespace-pre-line">{settings.address}</p>
                </div>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-[#FF6B35] hover:gap-3 transition-all"
              >
                Contact Us
                <span>→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

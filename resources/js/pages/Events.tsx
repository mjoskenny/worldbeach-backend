import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { appImageUrl } from '../lib/api';

export const Events: React.FC = () => {
  const { settings } = useSiteSettings();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    axios.get('/api/events')
      .then(res => setEvents(res.data))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  // Extract categories safely
  const eventCategories = [
    { id: 'all', name: 'All' },
    ...Array.from(new Set(events.map(e => e.category?.name || 'Uncategorized')))
      .map(catName => ({ id: catName.toLowerCase(), name: catName }))
  ];

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(e => (e.category?.name || 'uncategorized').toLowerCase() === selectedCategory);

  if (loading) return <p className="text-center py-20">Loading events...</p>;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#042029]/80 via-[#042029]/60 to-background" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl mb-4">
              Upcoming <span className="text-[#00B4D8]">Events</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Experience unforgettable moments at {settings.business_name}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-20 z-40 bg-white/95 dark:bg-[#042029]/95 backdrop-blur-lg shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {eventCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#00B4D8] text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-white/5 text-foreground hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 dark:text-gray-400">No events found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => {
                const totalCapacity = event.variants?.reduce((sum: number, v: any) => sum + Number(v.capacity || 0), 0) || 0;
                const totalSold = event.variants?.reduce((sum: number, v: any) => sum + Number(v.tickets_sold || 0), 0) || 0;
                const remaining = totalCapacity - totalSold;

                const availability =
                  remaining <= 0
                    ? { status: 'Sold Out', color: 'text-red-400' }
                    : remaining <= 20
                    ? { status: 'Almost Sold Out', color: 'text-yellow-400' }
                    : { status: 'Available', color: 'text-green-400' };

                const minPrice = event.variants?.length
                  ? Math.min(...event.variants.map((v: any) => Number(v.price || 0)))
                  : null;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <ImageWithFallback
                        src={appImageUrl(event.image)}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {event.featured && (
                        <span className="absolute top-4 left-4 z-10 rounded-full bg-[#FF6B35] px-4 py-1 text-sm font-semibold text-white shadow-lg">
                          Featured
                        </span>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <span className={`text-sm ${availability.color}`}>
                          {availability.status} • {remaining} tickets left
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl mb-2 text-foreground">{event.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-[#00B4D8]" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 text-[#00B4D8]" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 text-[#00B4D8]" />
                          <span>{event.location || settings.business_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4 text-[#00B4D8]" />
                          <span>Capacity: {totalCapacity}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                          <p className="text-xl text-[#00B4D8]">
                            {minPrice ? `${minPrice.toLocaleString()} Fbu` : 'N/A'}
                          </p>
                        </div>
                        <Link
                          to={`/events/${event.id}`}
                          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#00B4D8] text-white hover:bg-[#0077B6] transition-colors"
                        >
                          <Ticket className="w-4 h-4" />
                          Buy Ticket
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Host Event CTA */}
      <section className="py-16 bg-gradient-to-br from-[#00B4D8]/10 to-[#0077B6]/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl mb-6">
              Want to <span className="text-[#00B4D8]">Host an Event?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              {settings.business_name} is the perfect venue for your next event. From corporate functions to private celebrations, we've got you covered.
            </p>
            <Link
              to="/host-event"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#00B4D8] text-white hover:bg-[#0077B6] transition-all hover:shadow-lg"
            >
              Host Your Event
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

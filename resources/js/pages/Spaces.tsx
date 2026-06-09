import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Maximize, Calendar, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { appImageUrl } from '../lib/api';

export const Spaces: React.FC = () => {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'indoor' | 'outdoor' | 'private'>('all');

  const categories = [
    { id: 'all', name: 'All Spaces' },
    { id: 'indoor', name: 'Indoor' },
    { id: 'outdoor', name: 'Outdoor' },
    { id: 'private', name: 'Private' },
  ];

  useEffect(() => {
    axios.get('/api/spaces')
      .then(res => setSpaces(res.data))
      .catch(() => toast.error('Failed to load spaces'))
      .finally(() => setLoading(false));
  }, []);

  const filteredSpaces = selectedCategory === 'all'
    ? spaces
    : spaces.filter(space => space.category === selectedCategory);

  if (loading) return <p className="text-center py-20">Loading spaces...</p>;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section 
        className="relative h-[50vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1645689600188-1945e19b8228?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHZlbnVlJTIwc3BhY2V8ZW58MXx8fHwxNzY3MDA4MjIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#042029]/80 via-[#042029]/60 to-background" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl mb-4">
              Our <span className="text-[#00B4D8]">Spaces</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Beautiful venues for your perfect event
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-20 z-40 bg-white/95 dark:bg-[#042029]/95 backdrop-blur-lg shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
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

      {/* Spaces Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredSpaces.map((space, index) => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <ImageWithFallback
  src={
    space.image
      ? appImageUrl(space.image)
      : '/placeholder.png'
  }
  alt={space.title || 'Untitled'}
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
/>

                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#00B4D8] text-white text-sm capitalize">
                    {space.category || 'N/A'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl mb-2 text-foreground">{space.title || 'Untitled'}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {space.description || 'No description available'}
                  </p>

                  {/* Space Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#00B4D8]" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Capacity</p>
                        <p className="text-sm">{space.capacity || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize className="w-5 h-5 text-[#00B4D8]" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Size</p>
                        <p className="text-sm">{space.size || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-500 dark:text-gray-500 mb-3">Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {(space.features || []).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="w-4 h-4 text-[#00B4D8] flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/10">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Starting from</p>
                      <p className="text-xl text-[#00B4D8]">
  {space.price_per_hour ? Number(space.price_per_hour).toLocaleString() : '0'} Fbu
  <span className="text-sm text-gray-500">/hour</span>
</p>


                    </div>
                    <Link
                      to="/host-event"
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#00B4D8] text-white hover:bg-[#0077B6] transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#00B4D8]/10 to-[#0077B6]/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl mb-6">
              Need Help <span className="text-[#00B4D8]">Choosing?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Our event planning team will help you find the perfect space for your occasion.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/host-event"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#00B4D8] text-white hover:bg-[#0077B6] transition-all hover:shadow-lg"
              >
                Host an Event
              </Link>
              <a
                href="tel:+25722284567"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-all"
              >
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

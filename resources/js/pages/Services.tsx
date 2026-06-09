import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Waves, Baby, PartyPopper, Users, Heart, Dumbbell, Palmtree, Camera, Music, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { appImageUrl } from '../lib/api';

export const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const iconMap: Record<string, React.ComponentType<any>> = {
    swimming: Waves,
    kidsactivities: Baby,
    adultactivities: Users,
    entertainment: Music,
    events: PartyPopper,
    spawellness: Heart,
    fitness: Dumbbell,
    beachcabanas: Palmtree,
    photography: Camera,
    catering: Utensils,
    waves: Waves,
    baby: Baby,
    partypopper: PartyPopper,
    users: Users,
    heart: Heart,
    dumbbell: Dumbbell,
    palmtree: Palmtree,
    camera: Camera,
    music: Music,
    utensils: Utensils,
  };

  useEffect(() => {
    axios.get('/api/services')
      .then((res) => setServices(res.data))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center py-20">Loading services...</p>;
  }

  if (services.length === 0) {
    return (
      <div className="min-h-screen pt-20">
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-semibold mb-4">No services available yet.</h2>
          <p className="text-gray-600 dark:text-gray-400">Please check back later or add services in the admin panel.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#042029]/80 via-[#042029]/60 to-background" />
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl mb-4">
              Our <span className="text-[#00B4D8]">Services</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Everything you need for the perfect beach experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const iconKey = (service.icon || service.slug || service.name || '')
                .toString()
                .replace(/[-_\s]/g, '')
                .toLowerCase();

              const IconComponent = iconMap[iconKey] ?? Waves;
              const imageUrl = service.image
                ? appImageUrl(service.image.toString())
                : 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600';
              const features: string[] = Array.isArray(service.features) ? service.features : [];
              const title = service.title || service.name || 'Service';
              const description = service.description || 'Details coming soon.';
              const color = service.color || '#00B4D8';

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div 
                      className="absolute bottom-4 left-4 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl mb-2 text-foreground">{title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">Features:</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {features.slice(0, 4).map((feature: string, idx: number) => (
                          <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-[#00B4D8]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {features.length > 4 && (
                        <p className="text-xs text-[#00B4D8] mt-2">+{features.length - 4} more</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
              Ready to <span className="text-[#00B4D8]">Experience It?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Visit us today or contact our team to learn more about our services and packages.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#00B4D8] text-white hover:bg-[#0077B6] transition-all hover:shadow-lg"
              >
                Contact Us
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-all"
              >
                View Menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

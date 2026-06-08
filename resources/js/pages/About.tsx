import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Award, Users, Leaf } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const About: React.FC = () => {
  const { settings } = useSiteSettings();

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-[#FF6B35]" />,
      title: 'Passion',
      description: 'Every dish is crafted with love and dedication to culinary excellence',
    },
    {
      icon: <Award className="w-8 h-8 text-[#00B4D8]" />,
      title: 'Quality',
      description: 'We use only the freshest ingredients from local suppliers',
    },
    {
      icon: <Users className="w-8 h-8 text-[#F7D9A4]" />,
      title: 'Community',
      description: 'Building connections through food and hospitality',
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-500" />,
      title: 'Sustainability',
      description: 'Committed to sustainable practices and supporting local farmers',
    },
  ];

  const gallery = [
    'https://images.unsplash.com/photo-1758561087076-e647b2e2485a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc3RhdXJhbnQlMjBkaW5pbmd8ZW58MXx8fHwxNzYyNDM2OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1737569896174-440ba7a062d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGJhciUyMHN1bnNldHxlbnwxfHx8fDE3NjIzNDcwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1637027997087-5683522b715e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBiZWFjaCUyMHBhbG18ZW58MXx8fHwxNzYyMzQ2MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1697809311064-c7a3852206ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHN1bnNldCUyMG9jZWFufGVufDF8fHx8MTc2MjQzNDQ3OHww&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  return (
    <div className="min-h-screen pt-20">
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1758561087076-e647b2e2485a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc3RhdXJhbnQlMjBkaW5pbmd8ZW58MXx8fHwxNzYyNDM2OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#042029]/80 via-[#042029]/70 to-[#042029]/80" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl mb-4">{settings.about_title || 'Our Story'}</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {settings.about_description ||
                'A culinary journey inspired by Lake Tanganyika and the vibrant culture of Burundi'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-[#042029]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <h2 className="text-3xl mb-6 text-[#00B4D8]">Where the Lake Meets Luxury</h2>
              <p className="text-gray-700 dark:text-white/80 mb-4">{settings.about_history}</p>
              <p className="text-gray-700 dark:text-white/80 mb-4">{settings.about_mission}</p>
              <p className="text-gray-700 dark:text-white/80">{settings.about_vision}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-[#042029]/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4 text-[#042029] dark:text-white">Our Values</h2>
            <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-white/10 rounded-2xl p-6 border border-gray-200 dark:border-white/10 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl mb-2 text-[#042029] dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-white/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-[#042029]/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4 text-[#042029] dark:text-white">Our Location</h2>
            <p className="text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
              Paradise on the shores of Lake Tanganyika
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {gallery.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="aspect-square rounded-xl overflow-hidden"
              >
                <ImageWithFallback
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Phone, Mail, Check } from 'lucide-react';
import servicesData from '../data/servicesData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();

  const service = servicesData.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Service Not Found</h1>
          <Link to="/services" className="text-[#00B4D8] hover:underline">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const features = [
    'Professional equipment and setup',
    'Experienced staff and instructors',
    'Flexible scheduling options',
    'Group discounts available',
    'All safety equipment provided',
    'Refreshments included',
  ];

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

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <ImageWithFallback
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#042029] via-[#042029]/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container mx-auto pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-[#00B4D8] text-white">
                {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl mb-4 text-white">
              {service.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              {service.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Details */}
          <div className="lg:col-span-2">
            <div className="mb-12">
              <h2 className="text-3xl mb-6">About This <span className="text-[#00B4D8]">Service</span></h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {service.description}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Experience the best of what {settings.business_name} has to offer with our {service.title.toLowerCase()} service. 
                  Whether you're looking for relaxation, adventure, or entertainment, we have everything you need for an unforgettable time.
                </p>
              </div>
            </div>

            {/* What's Included */}
            <div className="mb-12">
              <h2 className="text-3xl mb-6">What's <span className="text-[#00B4D8]">Included</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#00B4D8]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#00B4D8]" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <h2 className="text-3xl mb-6">Photo <span className="text-[#00B4D8]">Gallery</span></h2>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
                  >
                    <ImageWithFallback
                      src={service.image}
                      alt={`${service.title} ${index}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="p-8 rounded-3xl bg-white dark:bg-white/5 shadow-xl border border-gray-200 dark:border-white/10">
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Starting From</p>
                  <p className="text-4xl text-[#00B4D8]">
                    {service.price?.toLocaleString() || '15,000'}
                    <span className="text-lg text-gray-500 dark:text-gray-400 ml-2">Fbu</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">per person</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Clock className="w-5 h-5 text-[#00B4D8]" />
                    <span>Available daily</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Users className="w-5 h-5 text-[#00B4D8]" />
                    <span>Groups of all sizes</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/contact"
                    className="block w-full text-center px-6 py-4 rounded-full bg-[#00B4D8] text-white hover:bg-[#0077B6] transition-all shadow-lg hover:shadow-xl"
                  >
                    Book Now
                  </Link>
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full border-2 border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Call to Inquire
                  </a>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full border-2 border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    Email Us
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Have questions? Our team is here to help!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

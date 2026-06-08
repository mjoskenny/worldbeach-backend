import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { apiPost } from '../lib/api';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const Contact: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const buildWhatsAppUrl = (bookingDetails: any) => {
    const whatsappNumber = (import.meta.env.VITE_WHATSAPP_ORDER_NUMBER || '+250795874742').replace(/\D/g, '');

    const message = [
      `Hello ${settings.business_name}, I want to confirm this table booking:`,
      `Reservation ID: ${bookingDetails.reservationId}`,
      `Name: ${bookingDetails.contact.name}`,
      `Phone: ${bookingDetails.contact.phone}`,
      bookingDetails.contact.email ? `Email: ${bookingDetails.contact.email}` : '',
      `Date: ${bookingDetails.date}`,
      `Time: ${bookingDetails.time}`,
      `Guests: ${bookingDetails.guests}`,
      bookingDetails.notes ? `Special Requests: ${bookingDetails.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await apiPost<{
        success: boolean;
        reservation: { reservation_id: string };
      }>('/reservations', {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        reservation_date: formData.date,
        reservation_time: formData.time,
        guest_count: Number(formData.guests),
        special_requests: formData.message || null,
      });

      const orderDetails = {
        reservationId: response.reservation.reservation_id,
        bookingType: 'reservation',
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests),
        notes: formData.message,
        contact: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        },
      };
      const whatsappUrl = buildWhatsAppUrl(orderDetails);

      toast.success('Booking request sent! We will confirm shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        message: '',
      });
      navigate('/confirm-payment', {
        state: {
          orderDetails,
          whatsappUrl,
        },
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(' ')
          : '') ||
        'Failed to send booking request';

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: <MapPin className="w-6 h-6 text-[#00B4D8]" />,
      title: 'Visit Us',
      content: settings.address,
      link: settings.map_url,
    },
    {
      icon: <Phone className="w-6 h-6 text-[#00B4D8]" />,
      title: 'Call Us',
      content: [settings.phone, settings.secondary_phone].filter(Boolean).join('\n'),
      link: `tel:${settings.phone}`,
    },
    {
      icon: <Mail className="w-6 h-6 text-[#00B4D8]" />,
      title: 'Email Us',
      content: [settings.email, settings.secondary_email].filter(Boolean).join('\n'),
      link: `mailto:${settings.email}`,
    },
    {
      icon: <Clock className="w-6 h-6 text-[#00B4D8]" />,
      title: 'Hours',
      content: `Mon-Fri: ${settings.weekday_hours}\nWeekend: ${settings.weekend_hours}`,
    },
  ];

  const normalizedAddress = settings.address?.trim() || '';
  const embeddedMapUrl = normalizedAddress
    ? `https://www.google.com/maps?q=${encodeURIComponent(normalizedAddress)}&output=embed`
    : '';
  const openMapUrl = normalizedAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalizedAddress)}`
    : settings.map_url;

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section 
        className="relative text-white py-16 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1763054761278-38579ad7225e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwcmVjZXB0aW9uJTIwZGVza3xlbnwxfHx8fDE3NjcwMDgyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00B4D8]/90 to-[#0077B6]/90" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl mb-4">Get In Touch</h1>
            <p className="text-white/90">
              Reserve your table, ask a question, or just say hello. We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white dark:bg-[#042029]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {card.link ? (
                  <a
                    href={card.link}
                    target={card.link.startsWith('http') ? '_blank' : undefined}
                    rel={card.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block h-full p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:shadow-lg transition-all group"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#00B4D8]/10 dark:bg-[#00B4D8]/20 mb-4 group-hover:bg-[#00B4D8] group-hover:text-white transition-colors">
                      {card.icon}
                    </div>
                    <h3 className="mb-2 text-[#042029] dark:text-white">{card.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-white/70 whitespace-pre-line">
                      {card.content}
                    </p>
                  </a>
                ) : (
                  <div className="h-full p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#00B4D8]/10 dark:bg-[#00B4D8]/20 mb-4">
                      {card.icon}
                    </div>
                    <h3 className="mb-2 text-[#042029] dark:text-white">{card.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-white/70 whitespace-pre-line">
                      {card.content}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl mb-6 text-[#042029] dark:text-white">Book a Table</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                    placeholder="+257 XX XXX XXX"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                      Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                      Guests *
                    </label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                    Special Requests
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8] resize-none"
                    placeholder="Any special occasions, dietary restrictions, or preferences?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white hover:from-[#FF6B35]/90 hover:to-[#FF8C5A]/90 transition-all hover:shadow-lg hover:shadow-[#FF6B35]/30 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Send Booking Request'}</span>
                </button>
              </form>
            </motion.div>

            {/* Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="rounded-2xl overflow-hidden h-96 bg-gray-200 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                {embeddedMapUrl ? (
                  <iframe
                    src={embeddedMapUrl}
                    title={`${settings.business_name} location map`}
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-[#00B4D8] mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-white/70">
                        {settings.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <a
                  href={openMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-opacity"
                >
                  Open in Maps
                </a>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-white/10 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                <h3 className="text-xl mb-4 text-[#042029] dark:text-white">Follow Us</h3>
                <p className="text-gray-600 dark:text-white/70 mb-4">
                  Stay updated with our latest dishes, events, and special offers
                </p>
                <div className="flex gap-3">
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
                  >
                    <Facebook className="w-5 h-5" />
                    <span className="text-sm">Facebook</span>
                  </a>
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="text-sm">Instagram</span>
                  </a>
                  <a
                    href={settings.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity"
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="text-sm">Twitter</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, Check, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { apiPost } from '../lib/api';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const HostEvent: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'party',
    date: '',
    startTime: '',
    endTime: '',
    expectedGuests: '',
    budget: '',
    description: '',
    specialRequirements: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const eventTypes = [
    { id: 'party', name: 'Party' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'corporate', name: 'Corporate Event' },
    { id: 'birthday', name: 'Birthday' },
    { id: 'concert', name: 'Concert' },
    { id: 'other', name: 'Other' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const buildWhatsAppUrl = (requestDetails: any) => {
    const whatsappNumber = (import.meta.env.VITE_WHATSAPP_ORDER_NUMBER || '+250795874742').replace(/\D/g, '');
    const message = [
      `Hello ${settings.business_name}, I want to confirm this host event request:`,
      `Request ID: ${requestDetails.requestId}`,
      `Event Name: ${requestDetails.eventName}`,
      `Event Type: ${requestDetails.eventType}`,
      `Date: ${requestDetails.date}`,
      requestDetails.startTime ? `Start Time: ${requestDetails.startTime}` : '',
      requestDetails.endTime ? `End Time: ${requestDetails.endTime}` : '',
      requestDetails.expectedGuests ? `Expected Guests: ${requestDetails.expectedGuests}` : '',
      requestDetails.budget ? `Budget: ${requestDetails.budget}` : '',
      requestDetails.description ? `Description: ${requestDetails.description}` : '',
      requestDetails.specialRequirements ? `Special Requirements: ${requestDetails.specialRequirements}` : '',
      '',
      `Contact Name: ${requestDetails.contact.name}`,
      `Phone: ${requestDetails.contact.phone}`,
      requestDetails.contact.email ? `Email: ${requestDetails.contact.email}` : '',
    ].filter(Boolean).join('\n');

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.eventName || !formData.date || !formData.contactName || !formData.contactEmail || !formData.contactPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await apiPost<{
        success: boolean;
        request: { request_id: string };
      }>('/host-event-requests', {
        event_name: formData.eventName,
        event_type: formData.eventType,
        event_date: formData.date,
        start_time: formData.startTime || null,
        end_time: formData.endTime || null,
        expected_guests: formData.expectedGuests ? Number(formData.expectedGuests) : null,
        budget: formData.budget || null,
        description: formData.description || null,
        special_requirements: formData.specialRequirements || null,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
      });

      const orderDetails = {
        hostRequestType: 'host-event',
        requestId: response.request.request_id,
        eventName: formData.eventName,
        eventType: formData.eventType,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        expectedGuests: formData.expectedGuests,
        budget: formData.budget,
        description: formData.description,
        specialRequirements: formData.specialRequirements,
        contact: {
          name: formData.contactName,
          phone: formData.contactPhone,
          email: formData.contactEmail,
        },
      };
      const whatsappUrl = buildWhatsAppUrl(orderDetails);

      toast.success('Your event request has been submitted!');
      toast.success('Our team will contact you within 24 hours.');

      setFormData({
        eventName: '',
        eventType: 'party',
        date: '',
        startTime: '',
        endTime: '',
        expectedGuests: '',
        budget: '',
        description: '',
        specialRequirements: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
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
        'Failed to submit event request';

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    'Professional event planning assistance',
    'Customizable menus and catering',
    'Full audio-visual equipment',
    'Dedicated event coordinator',
    'Flexible space configurations',
    'Beachfront location with stunning views',
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600)',
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
              Host Your <span className="text-[#00B4D8]">Event</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Create unforgettable moments at {settings.business_name}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-[#00B4D8] hover:text-[#0077B6] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-lg"
            >
              <h2 className="text-3xl mb-8">Event Details</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Information */}
                <div>
                  <h3 className="text-xl mb-4 text-[#00B4D8]">Event Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Event Name *</label>
                      <input
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                        placeholder="Enter your event name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Event Type *</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {eventTypes.map(type => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, eventType: type.id }))}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              formData.eventType === type.id
                                ? 'border-[#00B4D8] bg-[#00B4D8]/10'
                                : 'border-gray-300 dark:border-white/10 hover:border-[#00B4D8]/50'
                            }`}
                          >
                            <span className="text-xs">{type.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Event Date *</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Start Time</label>
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">End Time</label>
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Expected Guests</label>
                        <input
                          type="number"
                          name="expectedGuests"
                          value={formData.expectedGuests}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                          placeholder="Number of guests"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Estimated Budget (Fbu)</label>
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                          placeholder="Your budget"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Event Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00B4D8] resize-none"
                        placeholder="Tell us about your event..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Special Requirements</label>
                      <textarea
                        name="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00B4D8] resize-none"
                        placeholder="Any special requests or requirements..."
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-xl mb-4 text-[#00B4D8]">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Email *</label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                          placeholder="+257 XX XXX XXX"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#00B4D8] text-white hover:bg-[#0077B6] transition-all shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'Submitting...' : 'Submit Event Request'}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Benefits & Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-white/5 rounded-3xl p-6 shadow-lg sticky top-24"
            >
              <h3 className="text-xl mb-6">Why Host at {settings.business_name}?</h3>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#00B4D8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/20">
                <h4 className="text-sm mb-3 text-[#00B4D8]">Need Help?</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Our event planning team is here to help make your event unforgettable.
                </p>
                <a
                  href={`tel:${settings.phone}`}
                  className="block text-center py-2 px-4 rounded-lg bg-[#00B4D8] text-white text-sm hover:bg-[#0077B6] transition-colors"
                >
                  Call Us Now
                </a>
              </div>

              <div className="mt-6">
                <Link
                  to="/spaces"
                  className="block text-center py-3 px-4 rounded-lg border border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors"
                >
                  View Our Spaces
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

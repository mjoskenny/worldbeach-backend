import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Ticket, Phone, Mail, User, ArrowLeft, Smartphone, Building2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { apiPost } from '../lib/api';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const EventCheckout: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [ticketPurchase, setTicketPurchase] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const mobileMoneyOptions = [
    { id: 'lumicash', name: 'Lumicash', ussd: '*155#', color: 'bg-orange-500' },
    { id: 'ecocash', name: 'EcoCash', ussd: '*150#', color: 'bg-blue-500' },
  ];

  const bankOptions = [
    { id: 'bancobu', name: 'Bancobu E-Banking', ussd: '*147#', color: 'bg-green-600' },
    { id: 'enoti', name: 'E-noti', ussd: '*148#', color: 'bg-purple-600' },
    { id: 'bccb', name: 'BCCB Mobile', ussd: '*146#', color: 'bg-red-600' },
  ];

  const buildWhatsAppUrl = (orderDetails: any) => {
    const whatsappNumber = (import.meta.env.VITE_WHATSAPP_ORDER_NUMBER || '+250795874742').replace(/\D/g, '');

    const message = [
      `Hello ${settings.business_name}, I want to confirm this event ticket order:`,
      `Order ID: ${orderDetails.orderId}`,
      `Event: ${orderDetails.eventName}`,
      `Ticket Type: ${orderDetails.ticketVariant}`,
      `Quantity: ${orderDetails.quantity}`,
      `Total: ${orderDetails.total.toLocaleString()} Fbu`,
      `Payment Method: ${orderDetails.paymentMethod}`,
      orderDetails.ussdCode ? `USSD: ${orderDetails.ussdCode}` : '',
      '',
      `Name: ${orderDetails.contact.name}`,
      `Phone: ${orderDetails.contact.phone}`,
      orderDetails.contact.email ? `Email: ${orderDetails.contact.email}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    const storedPurchase = sessionStorage.getItem('eventTicketPurchase');
    if (storedPurchase) {
      setTicketPurchase(JSON.parse(storedPurchase));
    } else {
      navigate('/events');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSelect = (method: string, ussd?: string) => {
    setPaymentMethod(method);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticketPurchase?.event?.id || !ticketPurchase?.variant?.id) {
      toast.error('Your ticket selection is incomplete. Please choose your ticket again.');
      sessionStorage.removeItem('eventTicketPurchase');
      navigate('/events');
      return;
    }

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    const selectedPayment = [...mobileMoneyOptions, ...bankOptions].find(p => p.id === paymentMethod);

    try {
      setIsLoading(true);

      const response = await apiPost<{
        success: boolean;
        order: { order_id: string };
        event: any;
      }>('/event-ticket-orders', {
        event_id: String(ticketPurchase.event.id),
        event_variant_id: String(ticketPurchase.variant?.id),
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        quantity: ticketPurchase.quantity,
        payment_method: paymentMethod,
        ussd_code: selectedPayment?.ussd || null,
      });

      const orderDetails = {
        orderId: response.order.order_id,
        total: ticketPurchase.total,
        eventName: ticketPurchase.event.title,
        ticketVariant: ticketPurchase.variant?.name || 'General Admission',
        quantity: ticketPurchase.quantity,
        paymentMethod,
        ussdCode: selectedPayment?.ussd,
        contact: {
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },
      };
      const whatsappUrl = buildWhatsAppUrl(orderDetails);

      sessionStorage.removeItem('eventTicketPurchase');
      toast.success('Ticket order submitted successfully!');
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
        'Failed to submit ticket order';

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!ticketPurchase) {
    return null;
  }

  const { event, variant, quantity, total } = ticketPurchase;
  const selectedPayment = [...mobileMoneyOptions, ...bankOptions].find(
    (option) => option.id === paymentMethod
  );

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-2 text-[#00B4D8] hover:text-[#0077B6] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Event
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl mb-8 text-foreground">Ticket Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <h2 className="text-xl mb-4 text-foreground">Contact Information</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                        placeholder="Jean Dupont"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                        placeholder="jean@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-muted-foreground">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                        placeholder="+257 XX XXX XXX"
                      />
                    </div>
                  </div>

                  {/* Payment Method Section */}
                  <div className="pt-4">
                    <h3 className="text-lg mb-4 text-foreground">Payment Method *</h3>
                    
                    {/* Mobile Money */}
                    <div className="mb-4">
                      <h4 className="text-sm mb-3 text-muted-foreground flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Mobile Money
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {mobileMoneyOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handlePaymentSelect(option.id, option.ussd)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              paymentMethod === option.id
                                ? 'border-[#00B4D8] bg-[#00B4D8]/5'
                                : 'border-border hover:border-[#00B4D8]/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center`}>
                                <Smartphone className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{option.name}</p>
                                <p className="text-xs text-muted-foreground">Dial: {option.ussd}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bank Options */}
                    <div>
                      <h4 className="text-sm mb-3 text-muted-foreground flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Bank Transfer
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {bankOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handlePaymentSelect(option.id, option.ussd)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              paymentMethod === option.id
                                ? 'border-[#00B4D8] bg-[#00B4D8]/5'
                                : 'border-border hover:border-[#00B4D8]/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center`}>
                                <Building2 className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{option.name}</p>
                                <p className="text-xs text-muted-foreground">Code: {option.ussd}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedPayment && (
                      <div className="mt-4 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/5 p-4">
                        <p className="text-sm text-foreground">
                          Selected payment: <span className="font-medium">{selectedPayment.name}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Use code {selectedPayment.ussd} after submitting your order to complete payment.
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!paymentMethod || isLoading}
                    className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {isLoading ? 'Processing...' : 'Complete Purchase'}
                  </button>

                  <p className="text-xs text-center text-muted-foreground">
                    Your tickets will be sent to your email after payment confirmation
                  </p>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border sticky top-24">
                <h2 className="text-xl mb-4 text-foreground">Order Summary</h2>

                {/* Event Details */}
                <div className="mb-6 pb-6 border-b border-border">
                  <h3 className="text-lg mb-3 text-foreground">{event.title}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-[#00B4D8]" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-[#00B4D8]" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-[#00B4D8]" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="space-y-3 mb-6">
                  {variant && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ticket Type</span>
                      <span className="text-foreground">{variant.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="text-foreground">{quantity} {quantity === 1 ? 'ticket' : 'tickets'}</span>
                  </div>
                  {variant && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price per ticket</span>
                      <span className="text-foreground">{variant.price.toLocaleString()} Fbu</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-foreground">Total</span>
                    <span className="text-2xl text-[#00B4D8] font-semibold">
                      {total.toLocaleString()} Fbu
                    </span>
                  </div>
                </div>

                {/* Benefits */}
                {variant && variant.benefits && variant.benefits.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-[#00B4D8]/5 border border-[#00B4D8]/20">
                    <h4 className="text-sm font-medium mb-2 text-foreground">Included Benefits:</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {variant.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <Ticket className="w-3 h-3 text-[#00B4D8] mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

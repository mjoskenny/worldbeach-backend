import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Phone, CreditCard, Building2, ArrowRight, Home, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const ConfirmPayment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSiteSettings();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  useEffect(() => {
    // Get order details from location state
    const state = location.state as any;
    if (state?.orderDetails) {
      setOrderDetails(state.orderDetails);
      setWhatsappUrl(state.whatsappUrl || '');
    } else {
      // If no order details, redirect to home
      setTimeout(() => navigate('/'), 2000);
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!whatsappUrl) return;

    const redirectTimer = window.setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 800);

    return () => window.clearTimeout(redirectTimer);
  }, [whatsappUrl]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const getPaymentMethodIcon = () => {
    if (orderDetails.bookingType === 'reservation') {
      return <Clock className="w-12 h-12" />;
    }
    if (orderDetails.hostRequestType === 'host-event') {
      return <Clock className="w-12 h-12" />;
    }

    switch (orderDetails.paymentMethod) {
      case 'lumicash':
      case 'ecocash':
        return <Phone className="w-12 h-12" />;
      case 'bancobu':
      case 'enoti':
        return <Building2 className="w-12 h-12" />;
      case 'card':
        return <CreditCard className="w-12 h-12" />;
      default:
        return <Clock className="w-12 h-12" />;
    }
  };

  const getPaymentMethodName = () => {
    if (orderDetails.bookingType === 'reservation') {
      return 'Booking Request';
    }
    if (orderDetails.hostRequestType === 'host-event') {
      return 'Host Event Request';
    }

    switch (orderDetails.paymentMethod) {
      case 'lumicash':
        return 'Lumicash';
      case 'ecocash':
        return 'EcoCash';
      case 'bancobu':
        return 'Bancobu';
      case 'enoti':
        return 'E-noti';
      case 'card':
        return 'Credit Card';
      default:
        return 'Cash';
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-[#042029]/80">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Success Icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-6"
            >
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl mb-4 text-[#042029] dark:text-white"
            >
              {orderDetails.bookingType === 'reservation'
                ? 'Booking Request Sent!'
                : orderDetails.hostRequestType === 'host-event'
                ? 'Event Request Sent!'
                : 'Order Placed Successfully!'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-400"
            >
              {orderDetails.bookingType === 'reservation'
                ? 'Please confirm it on WhatsApp'
                : orderDetails.hostRequestType === 'host-event'
                ? 'Please confirm it on WhatsApp'
                : 'Thank you for your order'}
            </motion.p>
          </div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-xl mb-6"
          >
            <div className="border-b border-gray-200 dark:border-white/10 pb-6 mb-6">
              <h2 className="text-2xl mb-2 text-[#042029] dark:text-white">Order Details</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {orderDetails.bookingType === 'reservation'
                  ? `Reservation #${orderDetails.reservationId || 'RES' + Date.now().toString().slice(-6)}`
                  : orderDetails.hostRequestType === 'host-event'
                  ? `Request #${orderDetails.requestId || 'HOST' + Date.now().toString().slice(-6)}`
                  : `Order #${orderDetails.orderId || 'WB' + Date.now().toString().slice(-6)}`}
              </p>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#00B4D8]/10 dark:bg-white/5 flex items-center justify-center text-[#00B4D8]">
                  {getPaymentMethodIcon()}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                  <p className="text-xl text-[#042029] dark:text-white">{getPaymentMethodName()}</p>
                </div>
              </div>
              
              {orderDetails.ussdCode && (
                <div className="p-4 rounded-xl bg-[#00B4D8]/5 border border-[#00B4D8]/20">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">USSD Code</p>
                  <p className="text-2xl text-[#00B4D8] font-mono">{orderDetails.ussdCode}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Dial this code from your phone to complete the payment
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-3 mb-6">
              {orderDetails.bookingType === 'reservation' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Booking Date</span>
                    <span className="text-[#042029] dark:text-white">{orderDetails.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Booking Time</span>
                    <span className="text-[#042029] dark:text-white">{orderDetails.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Guests</span>
                    <span className="text-[#042029] dark:text-white">{orderDetails.guests}</span>
                  </div>
                </>
              ) : orderDetails.hostRequestType === 'host-event' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Event</span>
                    <span className="text-[#042029] dark:text-white">{orderDetails.eventName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type</span>
                    <span className="text-[#042029] dark:text-white">{orderDetails.eventType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date</span>
                    <span className="text-[#042029] dark:text-white">{orderDetails.date}</span>
                  </div>
                  {orderDetails.expectedGuests && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Guests</span>
                      <span className="text-[#042029] dark:text-white">{orderDetails.expectedGuests}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                  <span className="text-xl text-[#00B4D8]">{orderDetails.total?.toLocaleString() || '0'} Fbu</span>
                </div>
              )}
              {orderDetails.deliveryType && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delivery Type</span>
                  <span className="text-[#042029] dark:text-white capitalize">{orderDetails.deliveryType}</span>
                </div>
              )}
              {orderDetails.eventName && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Event</span>
                  <span className="text-[#042029] dark:text-white">{orderDetails.eventName}</span>
                </div>
              )}
              {orderDetails.notes && orderDetails.bookingType === 'reservation' && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Special Requests</span>
                  <span className="text-right text-[#042029] dark:text-white">{orderDetails.notes}</span>
                </div>
              )}
              {orderDetails.specialRequirements && orderDetails.hostRequestType === 'host-event' && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">Requirements</span>
                  <span className="text-right text-[#042029] dark:text-white">{orderDetails.specialRequirements}</span>
                </div>
              )}
            </div>

            {/* Contact Information */}
            {orderDetails.contact && (
              <div className="border-t border-gray-200 dark:border-white/10 pt-6">
                <h3 className="text-lg mb-3 text-[#042029] dark:text-white">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Name:</span> {orderDetails.contact.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Phone:</span> {orderDetails.contact.phone}
                  </p>
                  {orderDetails.contact.email && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Email:</span> {orderDetails.contact.email}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-[#00B4D8]/10 to-[#0077B6]/10 rounded-3xl p-8 mb-6"
          >
            <h3 className="text-xl mb-4 text-[#042029] dark:text-white">What's Next?</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>
                  {orderDetails.bookingType === 'reservation'
                    ? 'A WhatsApp message will open so you can confirm your booking with our team'
                    : orderDetails.hostRequestType === 'host-event'
                    ? 'A WhatsApp message will open so you can confirm your event request with our team'
                    : 'You\'ll receive a confirmation SMS/email shortly'}
                </span>
              </li>
              {orderDetails.bookingType !== 'reservation' && (
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Complete the payment using the provided USSD code if applicable</span>
                </li>
              )}
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>
                  {orderDetails.bookingType === 'reservation'
                    ? 'Once we confirm, we will share your table and visit details'
                    : orderDetails.hostRequestType === 'host-event'
                    ? 'Once we confirm, we will share the event hosting details with you'
                    : `Our team will prepare your order for ${orderDetails.deliveryType === 'delivery' ? 'delivery' : 'pickup'}`}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>For any questions, call us at {settings.phone}</span>
              </li>
            </ul>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {whatsappUrl && (
              <button
                onClick={() => {
                  window.location.href = whatsappUrl;
                }}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Send On WhatsApp
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
            <button
              onClick={() => navigate(orderDetails.bookingType === 'reservation' ? '/contact' : orderDetails.hostRequestType === 'host-event' ? '/host-event' : '/menu')}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-all"
            >
              {orderDetails.bookingType === 'reservation' ? 'Book Again' : orderDetails.hostRequestType === 'host-event' ? 'Request Again' : 'Order Again'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

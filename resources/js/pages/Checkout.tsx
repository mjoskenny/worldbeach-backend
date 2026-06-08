import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Clock, MapPin, User, Phone, Mail, CheckCircle, Smartphone, Building2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { apiUrl } from '../lib/api';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const Checkout: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Table data from QR code session
  const [tableData, setTableData] = useState<{
    table_number: number | null;
    table_id: number | null;
    has_table: boolean;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tableNumber: '',
    tableTime: '',
    address: '',
    notes: '',
  });

  // Fetch table data from session on component mount
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const res = await fetch(apiUrl('session-data'), {
          credentials: 'same-origin',
        });
        const data = await res.json();
        setTableData({
          table_number: data.table_number,
          table_id: data.table_id,
          has_table: data.has_table
        });
        
        // If table data exists, set order type to dine-in and autofill table number
        if (data.has_table) {
          setOrderType('dine-in');
          setFormData(prev => ({
            ...prev,
            tableNumber: data.table_number?.toString() || ''
          }));
        }
      } catch (error) {
        console.error('Failed to fetch table data:', error);
      }
    };

    fetchTableData();
  }, []);

  const mobileMoneyOptions = [
    { id: 'lumicash', name: 'Lumicash', ussd: '*155#', color: 'bg-orange-500' },
    { id: 'ecocash', name: 'EcoCash', ussd: '*150#', color: 'bg-blue-500' },
  ];

  const bankOptions = [
    { id: 'bancobu', name: 'Bancobu E-Banking', ussd: '*147#', color: 'bg-green-600' },
    { id: 'enoti', name: 'E-noti', ussd: '*148#', color: 'bg-purple-600' },
    { id: 'bccb', name: 'BCCB Mobile', ussd: '*146#', color: 'bg-red-600' },
  ];

  const buildWhatsAppUrl = (orderDetails: any, items: typeof cartItems) => {
    const whatsappNumber = (import.meta.env.VITE_WHATSAPP_ORDER_NUMBER || '+250795874742').replace(/\D/g, '');
    const itemsText = items
      .map((item) => `- ${item.name} x${item.quantity} (${(item.price * item.quantity).toLocaleString()} Fbu)`)
      .join('\n');

    const message = [
      `Hello ${settings.business_name}, I want to confirm this order:`,
      `Order ID: ${orderDetails.orderId}`,
      `Name: ${orderDetails.contact.name}`,
      `Phone: ${orderDetails.contact.phone}`,
      orderDetails.contact.email ? `Email: ${orderDetails.contact.email}` : '',
      `Order Type: ${orderDetails.deliveryType}`,
      orderDetails.tableNumber ? `Table Number: ${orderDetails.tableNumber}` : '',
      orderDetails.address ? `Delivery Address: ${orderDetails.address}` : '',
      '',
      'Items:',
      itemsText,
      '',
      `Total: ${orderDetails.total.toLocaleString()} Fbu`,
      `Payment Method: ${orderDetails.paymentMethod}`,
      orderDetails.ussdCode ? `USSD: ${orderDetails.ussdCode}` : '',
      orderDetails.notes ? `Notes: ${orderDetails.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentSelect = (method: string, ussd?: string) => {
    setPaymentMethod(method);
    
    if (ussd) {
      // Create a tel: link that will open the phone dialer with the USSD code
      window.location.href = `tel:${encodeURIComponent(ussd)}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast.error('Please fill in name and phone number');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (orderType === 'delivery' && !formData.address) {
      toast.error('Please enter delivery address');
      return;
    }

    const selectedPayment = [...mobileMoneyOptions, ...bankOptions].find(p => p.id === paymentMethod);
    
    setIsLoading(true);

    try {
      // Prepare order data
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        order_type: orderType,
        table_number: orderType === 'dine-in' ? (formData.tableNumber || tableData?.table_number) : null,
        table_id: tableData?.table_id != null ? String(tableData.table_id) : null,
        delivery_address: orderType === 'delivery' ? formData.address : null,
        special_notes: formData.notes,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total_amount: cartTotal + (orderType === 'delivery' ? 2000 : 0),
        payment_method: paymentMethod,
        ussd_code: selectedPayment?.ussd,
      };

      // Send order to backend
      const res = await fetch(apiUrl('orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const validationMessage = errorData?.message;
        const fieldErrors = errorData?.errors
          ? Object.values(errorData.errors).flat().join(' ')
          : '';

        throw new Error(validationMessage || fieldErrors || 'Failed to create order');
      }

      const response = await res.json();
      
      const orderDetails = {
        orderId: response.order_id,
        total: orderData.total_amount,
        deliveryType: orderType,
        paymentMethod,
        ussdCode: selectedPayment?.ussd,
        tableNumber: tableData?.table_number,
        address: orderType === 'delivery' ? formData.address : '',
        notes: formData.notes,
        contact: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        },
      };
      const whatsappUrl = buildWhatsAppUrl(orderDetails, cartItems);

      // Clear cart
      clearCart();

      // Navigate to confirmation page with order details
      navigate('/confirm-payment', { 
        state: { 
          orderDetails,
          whatsappUrl,
        } 
      });

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4 text-[#042029] dark:text-white">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-white/70 mb-6">Add some items to get started!</p>
          <button
            onClick={() => navigate('/menu')}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-[#042029]/50">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl mb-8 text-[#042029] dark:text-white">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Table Info Alert */}
              {tableData?.has_table && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-[#00B4D8]/10 to-[#0077B6]/10 rounded-2xl p-4 border border-[#00B4D8]/30 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#042029] dark:text-white">Table Order</p>
                    <p className="text-sm text-gray-600 dark:text-white/70">
                      Table #{tableData.table_number} - Your order will be served at this table
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Order Type */}
              <div className="bg-white dark:bg-white/10 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                <h2 className="text-xl mb-4 text-[#042029] dark:text-white">
                  {tableData?.has_table ? 'Confirm Order Type' : 'Order Type'}
                </h2>
                {tableData?.has_table ? (
                  <div className="p-4 rounded-xl bg-[#00B4D8]/10 text-[#042029] dark:text-white border border-[#00B4D8]/20">
                    <p className="font-medium">Dine-in at Table #{tableData.table_number}</p>
                    <p className="text-sm text-gray-600 dark:text-white/70 mt-1">
                      Your order will be prepared and served to your table
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                    { value: 'dine-in', label: 'Dine In', icon: <User className="w-5 h-5" /> },
                    { value: 'takeaway', label: 'Takeaway', icon: <MapPin className="w-5 h-5" /> },
                    {
                      value: 'delivery',
                      label: 'Delivery',
                      icon: <MapPin className="w-5 h-5" />,
                    },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setOrderType(type.value as any)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                        orderType === type.value
                          ? 'bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-white/5 text-[#042029] dark:text-white hover:bg-gray-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {type.icon}
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="bg-white dark:bg-white/10 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                <h2 className="text-xl mb-4 text-[#042029] dark:text-white">Your Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                        Phone Number *
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
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                      placeholder="jean@example.com"
                    />
                  </div>

                  {orderType === 'dine-in' && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                            Table Number {tableData?.has_table ? '' : '(Optional)'}
                          </label>
                          <input
                            type="text"
                            name="tableNumber"
                            value={formData.tableNumber}
                            onChange={handleInputChange}
                            required={tableData?.has_table}
                            disabled={tableData?.has_table}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8] disabled:opacity-70 disabled:cursor-not-allowed"
                            placeholder="e.g., 5 or A1"
                          />
                          {tableData?.has_table && (
                            <p className="text-xs text-[#00B4D8] mt-1">Auto-filled from QR code</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                            Preferred Time *
                          </label>
                          <input
                            type="datetime-local"
                            name="tableTime"
                            value={formData.tableTime}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {orderType !== 'dine-in' && !tableData?.has_table && (
                    <div>
                      <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                        Preferred Time (Optional)
                      </label>
                      <input
                        type="datetime-local"
                        name="tableTime"
                        value={formData.tableTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                      />
                    </div>
                  )}

                  {orderType === 'delivery' && (
                    <div>
                      <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required={orderType === 'delivery'}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                        placeholder="Street, Building, Apartment"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                      Special Instructions
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8] resize-none"
                      placeholder="Any allergies or special requests?"
                    />
                  </div>

                  {/* Payment Method Section */}
                  <div className="pt-4">
                    <h3 className="text-lg mb-4 text-[#042029] dark:text-white">Payment Method *</h3>
                    
                    {/* Mobile Money */}
                    <div className="mb-4">
                      <h4 className="text-sm mb-3 text-gray-600 dark:text-gray-400 flex items-center gap-2">
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
                                : 'border-gray-200 dark:border-white/10 hover:border-[#00B4D8]/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center`}>
                                <Smartphone className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#042029] dark:text-white">{option.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Dial: {option.ussd}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bank Options */}
                    <div>
                      <h4 className="text-sm mb-3 text-gray-600 dark:text-gray-400 flex items-center gap-2">
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
                                : 'border-gray-200 dark:border-white/10 hover:border-[#00B4D8]/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center`}>
                                <Building2 className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#042029] dark:text-white">{option.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Code: {option.ussd}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!paymentMethod || isLoading}
                    className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Place Order</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white dark:bg-white/10 rounded-2xl p-6 border border-gray-200 dark:border-white/10 sticky top-24">
                <h2 className="text-xl mb-4 text-[#042029] dark:text-white">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={
                            item.image
                              ? item.image.startsWith('http')
                                ? item.image
                                : `/storage/${item.image}`
                              : '/placeholder.png'
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm mb-1 text-[#042029] dark:text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-white/60">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#042029] dark:text-white">
                          {(item.price * item.quantity).toLocaleString()} Fbu
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-white/70">Subtotal</span>
                    <span className="text-[#042029] dark:text-white">
                      {cartTotal.toLocaleString()} Fbu
                    </span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-white/70">Delivery Fee</span>
                      <span className="text-[#042029] dark:text-white">2,000 Fbu</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 dark:border-white/10 pt-3">
                    <span className="text-[#042029] dark:text-white">Total</span>
                    <span className="text-xl text-[#00B4D8]">
                      {(cartTotal + (orderType === 'delivery' ? 2000 : 0)).toLocaleString()} Fbu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, Check, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { apiDelete, apiGet, apiPost, apiPut, getCsrfHeaders } from '../../lib/api';

// Types
interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: any[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: string;
  date: string;
  notes: string;
  tableNumber?: number;
  tableId?: number;
  orderType?: string;
  deliveryAddress?: string;
}

interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  table: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string;
  confirmationNotes?: string;
}

interface Space {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  images: string[];
  features: string[];
  available: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  category: string;
  available: boolean;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  variants: any[];
  status: 'upcoming' | 'past' | 'cancelled';
}

// Orders Tab with Full Management
export const OrdersTab: React.FC<{ orders: Order[]; setOrders: (orders: Order[]) => void }> = ({ orders, setOrders }) => {
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders', {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Handle pagination - orders are in data.data
        const ordersData = data.data || data;
        // Transform API data to match frontend format
        const transformedOrders = ordersData.map((order: any) => ({
          id: order.order_id,
          customerName: order.customer_name,
          customerEmail: order.customer_email || '',
          customerPhone: order.customer_phone,
          items: order.items || [],
          total: order.total_amount,
          status: order.order_status,
          paymentStatus: order.payment_method === 'cash' ? 'paid' : 'pending', // Simple mapping
          paymentMethod: order.payment_method,
          date: new Date(order.ordered_at).toLocaleDateString(),
          notes: order.special_notes || '',
          tableNumber: order.table_number,
          tableId: order.table_id,
          orderType: order.order_type,
          deliveryAddress: order.delivery_address
        }));
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...getCsrfHeaders(),
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updated = orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        );
        setOrders(updated);
        toast.success('Order status updated');
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handlePaymentStatusChange = (orderId: string, paymentStatus: Order['paymentStatus']) => {
    // For now, we'll just update locally since payment status might need more complex logic
    const updated = orders.map(order =>
      order.id === orderId ? { ...order, paymentStatus } : order
    );
    setOrders(updated);
    toast.success('Payment status updated');
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      // Note: You might want to add a delete endpoint to your API
      // For now, we'll just update the local state
      const updated = orders.filter(order => order.id !== orderId);
      setOrders(updated);
      toast.success('Order deleted');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  if (viewingOrder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setViewingOrder(null)}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-white/20 text-[#042029] dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-2xl text-[#042029] dark:text-white">Order Details</h2>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg mb-4 text-[#042029] dark:text-white">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {viewingOrder.customerName}</p>
                <p><strong>Email:</strong> {viewingOrder.customerEmail}</p>
                <p><strong>Phone:</strong> {viewingOrder.customerPhone}</p>
                <p><strong>Date:</strong> {viewingOrder.date}</p>
                {viewingOrder.tableNumber && (
                  <p><strong>Table:</strong> {viewingOrder.tableNumber}</p>
                )}
                {viewingOrder.orderType && (
                  <p><strong>Order Type:</strong> {viewingOrder.orderType}</p>
                )}
                {viewingOrder.deliveryAddress && (
                  <p><strong>Delivery Address:</strong> {viewingOrder.deliveryAddress}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg mb-4 text-[#042029] dark:text-white">Order Status</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-2">Order Status</label>
                  <select
                    value={viewingOrder.status}
                    onChange={(e) => handleStatusChange(viewingOrder.id, e.target.value as Order['status'])}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Payment Status</label>
                  <select
                    value={viewingOrder.paymentStatus}
                    onChange={(e) => handlePaymentStatusChange(viewingOrder.id, e.target.value as Order['paymentStatus'])}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <p className="text-sm"><strong>Payment Method:</strong> {viewingOrder.paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-white/10 pt-6">
            <h3 className="text-lg mb-4 text-[#042029] dark:text-white">Order Items</h3>
            <div className="space-y-3">
              {viewingOrder.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                  <div>
                    <p className="text-[#042029] dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-white/60">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-[#00B4D8]">{(item.price * item.quantity).toLocaleString()} Fbu</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center">
              <p className="text-lg text-[#042029] dark:text-white">Total</p>
              <p className="text-2xl text-[#00B4D8] font-semibold">{viewingOrder.total.toLocaleString()} Fbu</p>
            </div>
          </div>

          {viewingOrder.notes && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm"><strong>Notes:</strong> {viewingOrder.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl text-[#042029] dark:text-white">Orders Management</h2>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
          />
        </div>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#00B4D8] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white/70">Loading orders...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Orders', value: orders.length, color: 'blue' },
              { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'yellow' },
              { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: 'green' },
              { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: 'red' }
            ].map((stat, index) => (
              <div key={index} className="glass-card rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-white/70 mb-1">{stat.label}</p>
                <p className="text-2xl text-[#042029] dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Orders Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-white/50">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Customer</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Date</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Total</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Status</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Payment</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="px-4 py-3 text-sm text-[#042029] dark:text-white">{order.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-white/70">{order.customerName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-white/70">{order.date}</td>
                        <td className="px-4 py-3 text-sm text-[#00B4D8]">{order.total.toLocaleString()} Fbu</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                            order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setViewingOrder(order)}
                              className="p-1.5 rounded bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Reservations Tab
export const ReservationsTab: React.FC<{ reservations: Reservation[]; setReservations: (res: Reservation[]) => void }> = ({ reservations, setReservations }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    guests: 2,
    table: '',
    status: 'pending' as 'pending' | 'confirmed' | 'cancelled',
    notes: '',
    confirmationNotes: ''
  });

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await apiGet<any[]>('/admin/reservations');
      setReservations(
        data.map((reservation) => ({
          id: reservation.reservation_id,
          customerName: reservation.customer_name,
          customerEmail: reservation.customer_email,
          customerPhone: reservation.customer_phone,
          date: reservation.reservation_date,
          time: reservation.reservation_time,
          guests: Number(reservation.guest_count || 0),
          table: reservation.table_name || '',
          status: reservation.status,
          notes: reservation.special_requests || '',
          confirmationNotes: reservation.confirmation_notes || '',
        }))
      );
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const buildCustomerWhatsAppUrl = (reservation: Reservation) => {
    const whatsappNumber = reservation.customerPhone.replace(/\D/g, '');
    const message = [
      `Hello ${reservation.customerName},`,
      'Your booking at World Beach has been confirmed.',
      `Reservation ID: ${reservation.id}`,
      `Date: ${reservation.date}`,
      `Time: ${reservation.time}`,
      `Guests: ${reservation.guests}`,
      reservation.table ? `Table: ${reservation.table}` : '',
      reservation.confirmationNotes ? `Details: ${reservation.confirmationNotes}` : '',
      'If you need any change, please reply here or call us.',
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleAdd = () => {
    setIsEditing(true);
    setCurrentReservation(null);
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: '',
      time: '',
      guests: 2,
      table: '',
      status: 'pending',
      notes: '',
      confirmationNotes: ''
    });
  };

  const handleEdit = (reservation: Reservation) => {
    setIsEditing(true);
    setCurrentReservation(reservation);
    setFormData(reservation);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      try {
        await apiDelete(`/admin/reservations/${id}`);
        const updated = reservations.filter(res => res.id !== id);
        setReservations(updated);
        toast.success('Reservation deleted');
      } catch (error) {
        console.error('Error deleting reservation:', error);
        toast.error('Failed to delete reservation');
      }
    }
  };

  const handleSave = async () => {
    if (!formData.customerName || !formData.date || !formData.time) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        reservation_date: formData.date,
        reservation_time: formData.time,
        guest_count: Number(formData.guests),
        table_name: formData.table || null,
        status: formData.status,
        special_requests: formData.notes || null,
        confirmation_notes: formData.confirmationNotes || null,
      };

      if (currentReservation) {
        const response = await apiPut<{ just_confirmed?: boolean }>(`/admin/reservations/${currentReservation.id}`, payload);
        toast.success('Reservation updated');

        if (formData.status === 'confirmed') {
          const confirmedReservation: Reservation = {
            ...currentReservation,
            ...formData,
            confirmationNotes: formData.confirmationNotes,
          };

          const shouldOpenWhatsapp = response?.just_confirmed || !!formData.confirmationNotes || !!formData.table;

          if (shouldOpenWhatsapp) {
            window.open(buildCustomerWhatsAppUrl(confirmedReservation), '_blank');
          }
        }
      } else {
        await apiPost('/reservations', payload);
        toast.success('Reservation added');
      }

      await fetchReservations();
      setIsEditing(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(' ')
          : '') ||
        'Failed to save reservation';

      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-[#042029] dark:text-white">Reservations</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Reservation
        </button>
      </div>

      {isEditing ? (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-[#042029] dark:text-white">{currentReservation ? 'Edit Reservation' : 'New Reservation'}</h3>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Customer Name</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Email</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Phone</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Guests</label>
              <input
                type="number"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                min="1"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Table</label>
              <input
                type="text"
                value={formData.table}
                onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                placeholder="e.g., Beach View Table 5"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Confirmation Details for Customer</label>
              <textarea
                value={formData.confirmationNotes}
                onChange={(e) => setFormData({ ...formData, confirmationNotes: e.target.value })}
                rows={3}
                placeholder="Example: Your table is Beach View Table 5. Please arrive 10 minutes early."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-white/60">
                This message is sent to the customer on WhatsApp when the reservation is confirmed.
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-white/20 text-[#042029] dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-[#00B4D8] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-white/70">Loading reservations...</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">ID</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Customer</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Guests</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Table</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Status</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {reservations.map(res => (
                  <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-[#042029] dark:text-white">{res.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-white/70">{res.customerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-white/70">{res.date} {res.time}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-white/70">{res.guests}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-white/70">{res.table}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        res.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(res)}
                          className="p-1.5 rounded bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(res.id)}
                          className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

// Continue with Spaces, Services, Past Events, About, Gallery, and Settings tabs...

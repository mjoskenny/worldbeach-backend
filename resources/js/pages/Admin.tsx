import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Utensils,
  Calendar,
  Image as ImageIcon,
  Settings,
  Users,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  LogOut,
  Eye,
  ShoppingBag,
  MapPin,
  Info,
  History,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Package,
  FileText,
  Ticket,
  Building2,
  Mail,
  Zap,
  Tag,
  Bell,
  LoaderCircle
} from 'lucide-react';
import { menuItems as initialMenuItems } from '../data/menuData';
import { toast } from 'sonner';
import { MenuTab, EventsTab } from '../components/admin/AdminTabs';
import { OrdersTab, ReservationsTab } from '../components/admin/AdminTabsExtended';
import { SpacesTab, ServicesTab, PastEventsTab, AboutTab, GalleryTab, SettingsTab } from '../components/admin/AdminTabsFinal';
import { HostEventRequestsTab, ActivitiesTab, CategoriesTab, NotificationsTab } from '../components/admin/AdminTabsAdvanced';
import { useAutoTheme } from '../hooks/useAutoTheme';
import { apiAuthGet, apiGet, apiPost } from '../lib/api';
import { useSiteSettings } from '../context/SiteSettingsContext';

type AdminTab = 'dashboard' | 'menu' | 'events' | 'past-events' | 'reservations' | 'spaces' | 'services' | 'gallery' | 'orders' | 'about' | 'settings' | 'host-requests' | 'activities' | 'categories' | 'notifications';

interface EventVariant {
  id: string;
  name: string;
  price: number;
  capacity: number;
  ticketsSold: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  variants: EventVariant[];
  status: 'upcoming' | 'past' | 'cancelled';
}

interface ApiEvent {
  id: number | string;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  status: 'upcoming' | 'past' | 'cancelled';
  variants?: Array<{
    id: number | string;
    name: string;
    price: number;
    capacity: number;
    tickets_sold?: number;
    ticketsSold?: number;
  }>;
}

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

interface ApiReservation {
  reservation_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  table_name?: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests?: string | null;
  confirmation_notes?: string | null;
}

interface HostEventRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  guests: number;
  message: string;
  budget?: string;
  spacePreference?: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'declined';
  submittedAt: string;
  confirmationNotes?: string;
  eventName?: string;
  startTime?: string;
  endTime?: string;
}

interface ApiHostEventRequest {
  request_id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  start_time?: string | null;
  end_time?: string | null;
  expected_guests?: number | null;
  budget?: string | null;
  description?: string | null;
  special_requirements?: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'declined';
  submitted_at: string;
  confirmation_notes?: string | null;
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

interface GalleryImage {
  id: number;
  category: string;
  image: string;
  title?: string;
  description?: string;
  date?: string;
  position?: number;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

export const Admin: React.FC = () => {
  const { settings } = useSiteSettings();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  // State management
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [events, setEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hostRequests, setHostRequests] = useState<HostEventRequest[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);

  useEffect(() => {
    const bootstrapAdmin = async () => {
      loadData();
      fetchEvents();
      fetchGalleryImages();

      try {
        const session = await apiAuthGet<{ authenticated: boolean; user: AdminUser }>('/admin/auth/me');
        setIsAuthenticated(Boolean(session.authenticated));
        setAdminUser(session.user);
        await Promise.all([fetchReservations(), fetchHostEventRequests()]);
      } catch (error) {
        setIsAuthenticated(false);
        setAdminUser(null);
      } finally {
        setAuthChecked(true);
      }
    };

    bootstrapAdmin();
  }, []);

  const mapApiEvent = (event: ApiEvent): Event => ({
    id: String(event.id),
    title: event.title,
    date: event.date,
    time: event.time,
    description: event.description || '',
    image: event.image || '',
    status: event.status,
    variants: (event.variants || []).map((variant) => ({
      id: String(variant.id),
      name: variant.name,
      price: Number(variant.price || 0),
      capacity: Number(variant.capacity || 0),
      ticketsSold: Number(variant.tickets_sold ?? variant.ticketsSold ?? 0),
    })),
  });

  const fetchEvents = async () => {
    try {
      const data = await apiGet<ApiEvent[]>('/events');
      const normalizedEvents = data.map(mapApiEvent);
      setEvents(normalizedEvents.filter((event) => event.status !== 'past'));
      setPastEvents(normalizedEvents.filter((event) => event.status === 'past'));
    } catch (error) {
      console.error('Failed to fetch events', error);
      toast.error('Failed to load events from the database');
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const data = await apiGet<GalleryImage[]>('/gallery-data');
      setGalleryImages(data);
    } catch (error) {
      console.error('Failed to fetch gallery images', error);
      toast.error('Failed to load gallery images from the database');
    }
  };

  const fetchReservations = async () => {
    try {
      const data = await apiGet<ApiReservation[]>('/admin/reservations');
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
      console.error('Failed to fetch reservations', error);
      if (isAuthenticated) {
        toast.error('Failed to load reservations from the database');
      }
    }
  };

  const fetchHostEventRequests = async () => {
    try {
      const data = await apiGet<ApiHostEventRequest[]>('/admin/host-event-requests');
      setHostRequests(
        data.map((request) => ({
          id: request.request_id,
          name: request.contact_name,
          email: request.contact_email,
          phone: request.contact_phone,
          eventType: request.event_type,
          date: request.event_date,
          guests: Number(request.expected_guests || 0),
          message: request.description || request.special_requirements || '',
          budget: request.budget || '',
          spacePreference: '',
          status: request.status,
          submittedAt: request.submitted_at,
          confirmationNotes: request.confirmation_notes || '',
          eventName: request.event_name,
          startTime: request.start_time || '',
          endTime: request.end_time || '',
        }))
      );
    } catch (error) {
      console.error('Failed to fetch host event requests', error);
      if (isAuthenticated) {
        toast.error('Failed to load host event requests from the database');
      }
    }
  };

  const loadData = () => {
    // Menu Items
    const storedMenu = localStorage.getItem('menuItems');
    if (storedMenu) setMenuItems(JSON.parse(storedMenu));
    
    // Orders - Remove localStorage loading, will be fetched by OrdersTab
    // const storedOrders = localStorage.getItem('orders');
    // if (storedOrders) {
    //   setOrders(JSON.parse(storedOrders));
    // } else {
    //   const sampleOrders: Order[] = [
    //     // ... sample data removed
    //   ];
    //   setOrders(sampleOrders);
    //   localStorage.setItem('orders', JSON.stringify(sampleOrders));
    // }

    // Spaces
    const storedSpaces = localStorage.getItem('spaces');
    if (storedSpaces) {
      setSpaces(JSON.parse(storedSpaces));
    } else {
      const sampleSpaces: Space[] = [
        {
          id: 's1',
          name: 'Beachfront Dining Area',
          description: 'Open-air dining with stunning lake views',
          capacity: 100,
          price: 500000,
          images: ['https://images.unsplash.com/photo-1763771056927-557d39cb5e02?w=1080'],
          features: ['Lake View', 'Outdoor Seating', 'Bar Access', 'Music System'],
          available: true
        },
        {
          id: 's2',
          name: 'VIP Lounge',
          description: 'Exclusive private lounge area',
          capacity: 30,
          price: 300000,
          images: ['https://images.unsplash.com/photo-1657593088889-5105c637f2a8?w=1080'],
          features: ['Private Bar', 'AC', 'Premium Sound System', 'Dedicated Staff'],
          available: true
        }
      ];
      setSpaces(sampleSpaces);
      localStorage.setItem('spaces', JSON.stringify(sampleSpaces));
    }

    // Services
    const storedServices = localStorage.getItem('services');
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      const sampleServices: Service[] = [
        {
          id: 'srv1',
          name: 'Wedding Package',
          description: 'Complete wedding planning and execution',
          price: 2000000,
          duration: 'Full Day',
          image: 'https://images.unsplash.com/photo-1752600827346-335f3e0603f1?w=1080',
          category: 'Events',
          available: true
        },
        {
          id: 'srv2',
          name: 'Live Music Entertainment',
          description: 'Professional band for your event',
          price: 500000,
          duration: '3 Hours',
          image: 'https://images.unsplash.com/photo-1704830657561-a6a663931172?w=1080',
          category: 'Entertainment',
          available: true
        }
      ];
      setServices(sampleServices);
      localStorage.setItem('services', JSON.stringify(sampleServices));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiPost<{ user: AdminUser }>(
        '/admin/auth/login',
        {
          email,
          password,
        }
      );

      setAdminUser(response.user);
      setIsAuthenticated(true);
      await Promise.all([fetchReservations(), fetchHostEventRequests()]);
      toast.success('Welcome back to the admin dashboard.');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(' ')
          : '') ||
        'Unable to sign in.';

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiPost('/admin/auth/logout', {});
    } catch (error) {
      // Keep local state cleanup even if the session already expired.
    }

    setIsAuthenticated(false);
    setAdminUser(null);
    setPassword('');
    toast.success('Logged out successfully');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-[#00B4D8] to-[#0077B6] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-[#042029] rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <LoaderCircle className="w-10 h-10 animate-spin text-[#00B4D8] mx-auto mb-4" />
          <h1 className="text-2xl text-[#042029] dark:text-white mb-2">Checking admin session</h1>
          <p className="text-gray-600 dark:text-white/70">Connecting to the real admin backend...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-[#00B4D8] to-[#0077B6] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#042029] rounded-3xl shadow-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] mx-auto mb-4 flex items-center justify-center">
              <LayoutDashboard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl mb-2 text-[#042029] dark:text-white">Admin Panel</h1>
            <p className="text-gray-600 dark:text-white/70">{settings.business_name}</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Admin email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                placeholder="admin@worldbeach.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                placeholder="Enter password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-[#042029]/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl mb-2 text-[#042029] dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-white/70">
              {adminUser ? `${adminUser.name} is managing ${settings.business_name}` : `Manage your ${settings.business_name} content`}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-4 sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                  { id: 'menu', icon: Utensils, label: 'Menu' },
                  { id: 'events', icon: Calendar, label: 'Events' },
                  { id: 'past-events', icon: History, label: 'Past Events' },
                  { id: 'orders', icon: ShoppingBag, label: 'Orders' },
                  { id: 'reservations', icon: FileText, label: 'Reservations' },
                  { id: 'host-requests', icon: Mail, label: 'Host Requests' },
                  { id: 'spaces', icon: Building2, label: 'Spaces' },
                  { id: 'services', icon: Package, label: 'Services' },
                  { id: 'activities', icon: Zap, label: 'Activities' },
                  { id: 'categories', icon: Tag, label: 'Categories' },
                  { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
                  { id: 'about', icon: Info, label: 'About' },
                  { id: 'notifications', icon: Bell, label: 'Notifications' },
                  { id: 'settings', icon: Settings, label: 'Settings' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as AdminTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white shadow-lg'
                        : 'text-[#042029] dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {activeTab === 'dashboard' && <DashboardTab menuItems={menuItems} events={events} />}
            {activeTab === 'menu' && <MenuTab menuItems={menuItems} setMenuItems={setMenuItems} />}
            {activeTab === 'events' && <EventsTab events={events} setEvents={setEvents} />}
            {activeTab === 'past-events' && <PastEventsTab pastEvents={pastEvents} setPastEvents={setPastEvents} />}
            {activeTab === 'orders' && <OrdersTab orders={orders} setOrders={setOrders} />}
            {activeTab === 'reservations' && <ReservationsTab reservations={reservations} setReservations={setReservations} />}
            {activeTab === 'spaces' && <SpacesTab spaces={spaces} setSpaces={setSpaces} />}
            {activeTab === 'services' && <ServicesTab services={services} setServices={setServices} />}
            {activeTab === 'gallery' && <GalleryTab images={galleryImages} setImages={setGalleryImages} />}
            {activeTab === 'about' && <AboutTab />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'host-requests' && <HostEventRequestsTab requests={hostRequests} setRequests={setHostRequests} />}
            {activeTab === 'activities' && <ActivitiesTab activities={activities} setActivities={setActivities} />}
            {activeTab === 'categories' && <CategoriesTab categories={allCategories} setCategories={setAllCategories} />}
            {activeTab === 'notifications' && <NotificationsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab: React.FC<{ menuItems: any[]; events: Event[] }> = ({ menuItems, events }) => {
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/admin/dashboard');
        setDashboard(data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <LoaderCircle className="w-8 h-8 animate-spin text-[#00B4D8] mx-auto mb-4" />
        <p className="text-gray-600 dark:text-white/70">Loading live dashboard data...</p>
      </div>
    );
  }

  const stats = dashboard?.stats ?? {};
  const quickStats = dashboard?.quick_stats ?? {};
  const statusBreakdown = dashboard?.status_breakdown?.orders ?? {};
  const recentOrders = dashboard?.recent_orders ?? [];
  const salesTrend = dashboard?.sales_trend ?? [];
  const recentOrderCards = recentOrders.map((order: any) => ({
    ...order,
    customerName: order.customer_name,
    items: Array.from({ length: Number(order.items_count ?? 0) }),
    paymentStatus: order.status,
    total: Number(order.total_amount || 0),
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-[#042029] dark:text-white">Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `${Number(stats.total_revenue || 0).toLocaleString()} Fbu`, icon: DollarSign, color: 'from-green-500 to-emerald-600' },
          { label: 'Pending Orders', value: stats.pending_orders ?? 0, icon: ShoppingBag, color: 'from-[#FF6B35] to-[#FF8C5A]' },
          { label: 'Reservations', value: stats.confirmed_reservations ?? 0, icon: FileText, color: 'from-[#00B4D8] to-[#0077B6]' },
          { label: 'Tickets Sold', value: stats.tickets_sold ?? 0, icon: Ticket, color: 'from-purple-500 to-pink-600' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-600 dark:text-white/70 text-xs mb-1">{stat.label}</p>
            <p className="text-xl sm:text-2xl text-[#042029] dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-lg mb-3 text-[#042029] dark:text-white">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Menu Items</span>
              <span className="text-[#042029] dark:text-white font-semibold">{menuItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Upcoming Events</span>
              <span className="text-[#042029] dark:text-white font-semibold">{stats.upcoming_events ?? events.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Total Orders</span>
              <span className="text-[#042029] dark:text-white font-semibold">{quickStats.menu_orders_total ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Pending Host Requests</span>
              <span className="text-[#042029] dark:text-white font-semibold">{stats.host_requests_pending ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-lg mb-3 text-[#042029] dark:text-white">Live Snapshot</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Today Revenue</span>
              <span className="text-green-600 font-semibold">{Number(stats.today_revenue || 0).toLocaleString()} Fbu</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Unread Alerts</span>
              <span className="text-yellow-600 font-semibold">{stats.unread_notifications ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Total Users</span>
              <span className="text-red-600 font-semibold">{stats.users_total ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-lg mb-3 text-[#042029] dark:text-white">Order Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Completed</span>
              <span className="text-green-600 font-semibold">{statusBreakdown.completed ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Pending</span>
              <span className="text-yellow-600 font-semibold">{statusBreakdown.pending ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-white/70">Cancelled</span>
              <span className="text-red-600 font-semibold">{statusBreakdown.cancelled ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl mb-4 text-[#042029] dark:text-white">7-Day Sales Trend</h3>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {salesTrend.map((day: any) => (
            <div key={day.date} className="rounded-xl bg-gray-50 dark:bg-white/5 p-4">
              <p className="text-xs text-gray-500 dark:text-white/50 mb-2">{day.label}</p>
              <p className="text-lg text-[#042029] dark:text-white">{Number(day.revenue || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-white/50">{day.orders ?? 0} orders</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl mb-4 text-[#042029] dark:text-white">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 dark:text-white/50 text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrderCards.map((order: any) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg gap-2">
                <div className="flex-1">
                  <p className="text-[#042029] dark:text-white font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500 dark:text-white/60">{order.customerName} • {order.items.length} items</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                    order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {order.paymentStatus}
                  </span>
                  <p className="text-[#00B4D8] font-semibold">{order.total.toLocaleString()} Fbu</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Continue in next message due to length...

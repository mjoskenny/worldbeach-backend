export interface Order {
  id: string;
  type: 'menu' | 'event' | 'space';
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'contact' | 'event' | 'booking';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'archived';
  createdAt: string;
  reply?: string;
}

export interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    weekly: number;
    trend: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  events: {
    total: number;
    ticketsSold: number;
    revenue: number;
  };
  bookings: {
    total: number;
    spaces: number;
    revenue: number;
  };
  topItems: Array<{
    name: string;
    orders: number;
    revenue: number;
  }>;
  chartData: Array<{
    date: string;
    revenue: number;
    orders: number;
    events: number;
  }>;
}

// Sample data
export const sampleOrders: Order[] = [
  {
    id: 'ORD-001',
    type: 'menu',
    customer: {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      phone: '+257 22 284 567',
    },
    items: [
      { id: '1', name: 'Grilled Tilapia', quantity: 2, price: 12000 },
      { id: '2', name: 'Tropical Sunset', quantity: 2, price: 8000 },
    ],
    total: 40000,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'ORD-002',
    type: 'event',
    customer: {
      name: 'Marie Laurent',
      email: 'marie@example.com',
      phone: '+257 22 284 568',
    },
    items: [
      { id: '1', name: 'Sunset Beach Party - Ticket', quantity: 4, price: 15000 },
    ],
    total: 60000,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'ORD-003',
    type: 'menu',
    customer: {
      name: 'Pierre Martin',
      email: 'pierre@example.com',
      phone: '+257 22 284 569',
    },
    items: [
      { id: '3', name: 'Beach BBQ Platter', quantity: 1, price: 18000 },
      { id: '4', name: 'Passion Paradise', quantity: 2, price: 7000 },
    ],
    total: 32000,
    status: 'preparing',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];

export const sampleNotifications: Notification[] = [
  {
    id: 'NOT-001',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-003 from Pierre Martin',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    link: '/admin?tab=orders',
  },
  {
    id: 'NOT-002',
    type: 'contact',
    title: 'New Contact Message',
    message: 'Message from Sarah Johnson about event booking',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    link: '/admin?tab=contact',
  },
  {
    id: 'NOT-003',
    type: 'event',
    title: 'Event Ticket Sold',
    message: '4 tickets sold for Sunset Beach Party',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    link: '/admin?tab=events',
  },
];

export const sampleContactMessages: ContactMessage[] = [
  {
    id: 'MSG-001',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+257 22 284 570',
    subject: 'Wedding Reception Inquiry',
    message: 'Hi, I would like to inquire about hosting a wedding reception at World Beach for approximately 150 guests in December.',
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'MSG-002',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '+257 22 284 571',
    subject: 'Corporate Event',
    message: 'Looking to book the VIP Lounge for a corporate team building event. What packages do you offer?',
    status: 'replied',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    reply: 'Thank you for your interest! We offer several corporate packages...',
  },
];

export const analyticsData: AnalyticsData = {
  revenue: {
    total: 45200000,
    monthly: 12500000,
    weekly: 3200000,
    trend: 18.5,
  },
  orders: {
    total: 1234,
    pending: 12,
    completed: 1198,
    cancelled: 24,
  },
  events: {
    total: 8,
    ticketsSold: 989,
    revenue: 18500000,
  },
  bookings: {
    total: 45,
    spaces: 6,
    revenue: 8900000,
  },
  topItems: [
    { name: 'Grilled Tilapia', orders: 245, revenue: 2940000 },
    { name: 'Beach BBQ Platter', orders: 189, revenue: 3402000 },
    { name: 'Tropical Sunset', orders: 456, revenue: 3648000 },
    { name: 'Sunset Beach Party', orders: 145, revenue: 2175000 },
  ],
  chartData: [
    { date: '2025-11-01', revenue: 1200000, orders: 45, events: 12 },
    { date: '2025-11-02', revenue: 1500000, orders: 52, events: 15 },
    { date: '2025-11-03', revenue: 1800000, orders: 61, events: 18 },
    { date: '2025-11-04', revenue: 1400000, orders: 48, events: 14 },
    { date: '2025-11-05', revenue: 2200000, orders: 72, events: 22 },
    { date: '2025-11-06', revenue: 2800000, orders: 89, events: 28 },
    { date: '2025-11-07', revenue: 2100000, orders: 68, events: 20 },
  ],
};

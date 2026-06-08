import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api, { apiGet } from '../../lib/api'; // your axios wrapper
import { Event } from '../types/events'; // your Event interface
import axios from 'axios';






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
}



// Menu tabs Components

export const MenuTab: React.FC<{ menuItems: any[]; setMenuItems: (items: any[]) => void }> = ({ menuItems, setMenuItems }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    image: '' as string | File,
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Load menu and categories from backend
  const loadMenu = async () => {
    try {
      setLoading(true);
      const items = await apiGet('/menu-items');
      const cats = await apiGet('/categories');
      setMenuItems(items);
      setCategories(cats);
    } catch (err) {
      toast.error('Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleAdd = () => {
    setIsEditing(true);
    setCurrentItem(null);
    setFormData({ name: '', description: '', price: 0, category_id: '', image: '', featured: false });
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      image: item.image || '',
      featured: item.featured || false
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name } = target;

    if (target instanceof HTMLInputElement && target.type === 'file') {
      setFormData({
        ...formData,
        image: target.files?.[0] || ''
      });
      return;
    }

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: target.checked
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: name === 'price' ? Number(target.value) : target.value
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/admin/menu-items/${id}`);
      setMenuItems(menuItems.filter(item => item.id !== id));
      toast.success('Item deleted successfully');
    } catch {
      toast.error('Failed to delete item');
    }
  };

  const handleSave = async () => {
  if (!formData.name || !formData.description || formData.price <= 0 || !formData.category_id) {
    toast.error('Please fill all required fields');
    return;
  }

  try {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price.toString());
    data.append('category_id', formData.category_id.toString());
    data.append('featured', formData.featured ? '1' : '0');

    if (formData.image instanceof File) data.append('image', formData.image);

    if (currentItem) {
      data.append('_method', 'PUT');
      const updated = await api.post(`/admin/menu-items/${currentItem.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMenuItems(menuItems.map(item => (item.id === currentItem.id ? updated.data : item)));
      toast.success('Item updated successfully');
    } else {
      const newItem = await api.post('/admin/menu-items', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMenuItems([newItem.data, ...menuItems]);
      toast.success('Item added successfully');
    }

    setIsEditing(false);
    setCurrentItem(null);
    setFormData({ name: '', description: '', price: 0, category_id: '', image: '', featured: false });
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to save item');
  }
};

  if (loading) return <p>Loading menu...</p>;

  // Filter menu items by search
  const filteredMenu = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-[#042029] dark:text-white">Menu Items</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* Search input */}
      <div>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8] mb-4"
        />
      </div>

      {isEditing ? (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-[#042029] dark:text-white">{currentItem ? 'Edit Item' : 'Add New Item'}</h3>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Price (Fbu)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white"
              />
              {/* Preview */}
              {formData.image && typeof formData.image === 'string' && (
                <img src={`/storage/${formData.image}`} alt="preview" className="w-24 h-24 mt-2 object-cover rounded" />
              )}
              {formData.image && formData.image instanceof File && (
                <img src={URL.createObjectURL(formData.image)} alt="preview" className="w-24 h-24 mt-2 object-cover rounded" />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-[#00B4D8] focus:ring-[#00B4D8]"
              />
              <label className="text-[#042029] dark:text-white">Featured Item</label>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map(item => (
            <div key={item.id} className="glass-card rounded-2xl overflow-hidden">
              <img src={item.image ? `/storage/${item.image}` : '/placeholder.png'} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg mb-2 text-[#042029] dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-white/70 mb-3 line-clamp-2">{item.description}</p>
                <p className="text-[#00B4D8] mb-4">{item.price.toLocaleString()} Fbu</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};






/* =====================================================
   EVENTS TAB WITH BACKEND + NEW FEATURES
===================================================== */

export const EventsTab: React.FC<{ events: Event[]; setEvents: (events: Event[]) => void }> = ({ events, setEvents }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const mapApiEvent = (event: any): Event => ({
    id: String(event.id),
    title: event.title,
    date: event.date,
    time: event.time,
    description: event.description || '',
    image: event.image || '',
    status: event.status,
    categoryId: event.category_id ? String(event.category_id) : '',
    location: event.location || '',
    featured: Boolean(event.featured),
    variants: (event.variants || []).map((variant: any) => ({
      id: String(variant.id),
      name: variant.name,
      price: Number(variant.price || 0),
      capacity: Number(variant.capacity || 0),
      ticketsSold: Number(variant.tickets_sold ?? variant.ticketsSold ?? 0),
      benefits: variant.benefits || [],
    })),
  });

  const emptyEvent: Event = {
    id: '',
    title: '',
    date: '',
    time: '',
    description: '',
    image: '',
    status: 'upcoming',
    categoryId: '',
    location: '',
    featured: false,
    variants: [
      { id: 'tmp', name: 'General Admission', price: 0, capacity: 100, ticketsSold: 0, benefits: [] }
    ]
  };

  const [formData, setFormData] = useState<Event>(emptyEvent);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  /* ============================
     FETCH CATEGORIES
  ============================ */
  useEffect(() => {
    axios.get('/api/categories?type=event')
      .then(res => setCategories(res.data))
      .catch(() => toast.error('Failed to fetch categories'));
  }, []);

  /* ============================
     NORMALIZE PAYLOAD
  ============================ */
  const buildFormData = (event: Event) => {
    const fd = new FormData();

    fd.append('title', event.title);
    fd.append('date', event.date);
    fd.append('time', event.time);
    fd.append('description', event.description);
    fd.append('status', event.status);
    fd.append('category_id', event.categoryId || '');
    fd.append('location', event.location || '');
    fd.append('featured', event.featured ? '1' : '0');

    if (event.image instanceof File) fd.append('image', event.image);

    fd.append('variants', JSON.stringify(
      event.variants.map(v => ({
        name: v.name,
        price: v.price,
        capacity: v.capacity,
        tickets_sold: v.ticketsSold ?? 0,
        benefits: v.benefits || []
      }))
    ));

    return fd;
  };

  /* ============================
     FETCH EVENTS
  ============================ */
  useEffect(() => {
    axios.get('/api/events')
      .then(res => setEvents(res.data.map(mapApiEvent)))
      .catch(() => toast.error('Failed to fetch events'));
  }, [setEvents]);

  /* ============================
     CRUD ACTIONS
  ============================ */
  const handleAdd = () => { setCurrentEvent(null); setFormData(emptyEvent); setIsEditing(true); };
  const handleEdit = (event: Event) => { setCurrentEvent(event); setFormData(event); setIsEditing(true); };
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try { await axios.delete(`/api/admin/events/${id}`); setEvents(events.filter(e => e.id !== id)); toast.success('Event deleted'); }
    catch { toast.error('Failed to delete event'); }
  };

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { id: `tmp-${Date.now()}`, name: '', price: 0, capacity: 0, ticketsSold: 0, benefits: [] }]
    });
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, variants: updated });
  };

  const handleRemoveVariant = (index: number) => {
    const updated = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updated });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.date || !formData.time) { toast.error('Please fill all required fields'); return; }
    const payload = buildFormData(formData);

    try {
      let res;
      if (currentEvent) {
        res = await axios.post(`/api/admin/events/${currentEvent.id}?_method=PUT`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        setEvents(events.map(e => e.id === currentEvent.id ? mapApiEvent(res.data) : e));
        toast.success('Event updated');
      } else {
        res = await axios.post('/api/admin/events', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        setEvents([mapApiEvent(res.data), ...events]);
        toast.success('Event created');
      }
      setIsEditing(false); setCurrentEvent(null); setFormData(emptyEvent);
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to save event');
    }
  };



  // Event Details Modal
  if (viewingEvent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setViewingEvent(null)}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-white/20 text-[#042029] dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-2xl text-[#042029] dark:text-white">Event Details</h2>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Image Preview */}
    {viewingEvent.image && (
      <img
        src={
          viewingEvent.image instanceof File
            ? URL.createObjectURL(viewingEvent.image) // preview uploaded file
            : `/storage/${viewingEvent.image}` // preview saved image from storage
        }
        alt={viewingEvent.title}
        className="w-full h-64 object-cover rounded-lg"
      />
    )}
            
            <div>
              <h3 className="text-2xl mb-2 text-[#042029] dark:text-white">{viewingEvent.title}</h3>
              <p className="text-gray-600 dark:text-white/70 mb-4">{viewingEvent.description}</p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-white/70"><strong>Date:</strong> {viewingEvent.date}</p>
                <p className="text-gray-600 dark:text-white/70"><strong>Time:</strong> {viewingEvent.time}</p>
                <p className="text-gray-600 dark:text-white/70"><strong>Status:</strong> <span className="capitalize">{viewingEvent.status}</span></p>
              </div>
            </div>
          </div>

          <h4 className="text-lg mb-4 text-[#042029] dark:text-white">Ticket Variants</h4>
          <div className="space-y-4">
            {viewingEvent.variants.map(variant => {
              const isSoldOut = variant.ticketsSold >= variant.capacity;
              const percentageSold = (variant.ticketsSold / variant.capacity) * 100;
              return (
                <div key={variant.id} className="bg-gray-50 dark:bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="text-lg text-[#042029] dark:text-white">{variant.name}</h5>
                      <p className="text-[#00B4D8] text-xl">{variant.price.toLocaleString()} Fbu</p>
                    </div>
                    {isSoldOut && <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs">SOLD OUT</span>}
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-white/70">Tickets Sold</span>
                      <span className="text-[#042029] dark:text-white">{variant.ticketsSold} / {variant.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${isSoldOut ? 'bg-red-500' : 'bg-gradient-to-r from-[#00B4D8] to-[#0077B6]'}`}
                        style={{ width: `${Math.min(percentageSold, 100)}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-white/70">{variant.capacity - variant.ticketsSold} tickets remaining</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Main Grid & Add/Edit Form
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-[#042029] dark:text-white">Upcoming Events</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add Event
        </button>
      </div>

      {isEditing ? (
  <div className="glass-card rounded-2xl p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl text-[#042029] dark:text-white">{currentEvent ? 'Edit Event' : 'Add New Event'}</h3>
      <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>

    <div className="space-y-6">
      {/* Event Info Inputs */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2 text-[#042029] dark:text-white">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            placeholder="e.g., 18:00 - 23:00"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-[#042029] dark:text-white">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
          />
        </div>

        {/* New: Location */}
        <div>
          <label className="block text-sm mb-2 text-[#042029] dark:text-white">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Event location"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
          />
        </div>

        {/* New: Category */}
        <div>
          <label className="block text-sm mb-2 text-[#042029] dark:text-white">Category</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* New: Status */}
        <div>
          <label className="block text-sm mb-2 text-[#042029] dark:text-white">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
          >
            <option value="upcoming">Upcoming</option>
            <option value="cancelled">Cancelled</option>
            <option value="past">Past</option>
          </select>
        </div>

        {/* New: Featured */}
        <div className="flex items-center mt-6 gap-2 md:col-span-2">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4"
          />
          <label className="text-sm text-[#042029] dark:text-white">Mark as Featured</label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-2 text-[#042029] dark:text-white">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
          />
        </div>
      </div>

      {/* Ticket Variants with Benefits */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg text-[#042029] dark:text-white">Ticket Variants</h4>
          <button
            onClick={handleAddVariant}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Add Variant
          </button>
        </div>

        <div className="space-y-4">
          {formData.variants.map((variant, index) => (
            <div key={variant.id} className="bg-gray-50 dark:bg-white/5 rounded-lg p-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-white/70">Variant Name</label>
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                    placeholder="e.g., VIP"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-white/70">Price (Fbu)</label>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-white/70">Capacity</label>
                  <input
                    type="number"
                    value={variant.capacity}
                    onChange={(e) => handleVariantChange(index, 'capacity', parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                  />
                </div>

                <div className="flex items-end">
                  {formData.variants.length > 1 && (
                    <button
                      onClick={() => handleRemoveVariant(index)}
                      className="w-full px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  )}
                </div>

                {/* New: Benefits */}
                <div className="md:col-span-4 mt-2">
                  <label className="block text-xs mb-1 text-gray-600 dark:text-white/70">Benefits (comma separated)</label>
                  <input
                    type="text"
                    value={variant.benefits?.join(', ')}
                    onChange={(e) => handleVariantChange(index, 'benefits', e.target.value.split(',').map(b => b.trim()))}
                    placeholder="e.g., Free drink, Backstage access"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save / Cancel Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
        >
          <Save className="w-5 h-5" /> Save
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-white/20 text-[#042029] dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
) : (
        <div className="grid md:grid-cols-2 gap-6">
          {events.map(event => {
            const totalCapacity = event.variants.reduce((sum, v) => sum + v.capacity, 0);
            const totalSold = event.variants.reduce((sum, v) => sum + v.ticketsSold, 0);
            const soldOutVariants = event.variants.filter(v => v.ticketsSold >= v.capacity).length;

            return (
              <div key={event.id} className="glass-card rounded-2xl overflow-hidden">
                
                <img
  src={
    event.image instanceof File
      ? URL.createObjectURL(event.image)
      : event.image
        ? `/storage/${event.image}`
        : '/placeholder.png'
  } className="w-full h-48 object-cover"
/>

                <div className="p-4">
                  <h3 className="text-lg mb-2 text-[#042029] dark:text-white">{event.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-white/70 mb-2">{event.date} • {event.time}</p>
                  <p className="text-sm text-gray-600 dark:text-white/70 mb-3">{totalSold}/{totalCapacity} tickets sold</p>
                  {soldOutVariants > 0 && (
                    <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-xs text-red-600 dark:text-red-400">{soldOutVariants} variant(s) sold out</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => setViewingEvent(event)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-colors text-sm">
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button onClick={() => handleEdit(event)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors text-sm">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

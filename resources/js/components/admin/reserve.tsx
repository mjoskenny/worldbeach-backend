import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye } from 'lucide-react';
import { toast } from 'sonner';

// Types
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

interface AboutContent {
  title: string;
  description: string;
  mission: string;
  vision: string;
  history: string;
}

// Spaces Tab
export const SpacesTab: React.FC<{ spaces: Space[]; setSpaces: (spaces: Space[]) => void }> = ({ spaces, setSpaces }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: 50,
    price: 0,
    images: [''],
    features: [''],
    available: true
  });

  const handleAdd = () => {
    setIsEditing(true);
    setCurrentSpace(null);
    setFormData({
      name: '',
      description: '',
      capacity: 50,
      price: 0,
      images: [''],
      features: [''],
      available: true
    });
  };

  const handleEdit = (space: Space) => {
    setIsEditing(true);
    setCurrentSpace(space);
    setFormData(space);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this space?')) {
      const updated = spaces.filter(space => space.id !== id);
      setSpaces(updated);
      localStorage.setItem('spaces', JSON.stringify(updated));
      toast.success('Space deleted');
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    let updated;
    if (currentSpace) {
      updated = spaces.map(space => space.id === currentSpace.id ? { ...formData, id: currentSpace.id } : space);
      toast.success('Space updated');
    } else {
      const newSpace = { ...formData, id: Date.now().toString() };
      updated = [...spaces, newSpace];
      toast.success('Space added');
    }

    setSpaces(updated);
    localStorage.setItem('spaces', JSON.stringify(updated));
    setIsEditing(false);
  };

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleRemoveImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-[#042029] dark:text-white">Spaces Management</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Space
        </button>
      </div>

      {isEditing ? (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-[#042029] dark:text-white">{currentSpace ? 'Edit Space' : 'Add New Space'}</h3>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2 text-[#042029] dark:text-white">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#042029] dark:text-white">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#042029] dark:text-white">Price (Fbu)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#00B4D8] focus:ring-[#00B4D8]"
                />
                <label className="text-[#042029] dark:text-white">Available for Booking</label>
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

            {/* Images */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm text-[#042029] dark:text-white">Images</label>
                <button
                  onClick={handleAddImage}
                  className="text-sm px-3 py-1 rounded bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors"
                >
                  + Add Image
                </button>
              </div>
              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Image URL"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                    />
                    {formData.images.length > 1 && (
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm text-[#042029] dark:text-white">Features</label>
                <button
                  onClick={handleAddFeature}
                  className="text-sm px-3 py-1 rounded bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors"
                >
                  + Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Feature name"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                    />
                    {formData.features.length > 1 && (
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
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
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {spaces.map(space => (
            <div key={space.id} className="glass-card rounded-2xl overflow-hidden">
              <img src={space.images[0]} alt={space.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg text-[#042029] dark:text-white">{space.name}</h3>
                  {space.available && (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Available</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-white/70 mb-3 line-clamp-2">{space.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600 dark:text-white/70">Capacity: {space.capacity}</span>
                  <span className="text-[#00B4D8]">{space.price.toLocaleString()} Fbu</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(space)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(space.id)}
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

// Services Tab
export const ServicesTab: React.FC<{ services: Service[]; setServices: (services: Service[]) => void }> = ({ services, setServices }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: '',
    image: '',
    category: 'Events',
    available: true
  });

  const handleAdd = () => {
    setIsEditing(true);
    setCurrentService(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: '',
      image: '',
      category: 'Events',
      available: true
    });
  };

  const handleEdit = (service: Service) => {
    setIsEditing(true);
    setCurrentService(service);
    setFormData(service);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const updated = services.filter(service => service.id !== id);
      setServices(updated);
      localStorage.setItem('services', JSON.stringify(updated));
      toast.success('Service deleted');
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    let updated;
    if (currentService) {
      updated = services.map(service => service.id === currentService.id ? { ...formData, id: currentService.id } : service);
      toast.success('Service updated');
    } else {
      const newService = { ...formData, id: Date.now().toString() };
      updated = [...services, newService];
      toast.success('Service added');
    }

    setServices(updated);
    localStorage.setItem('services', JSON.stringify(updated));
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-[#042029] dark:text-white">Services Management</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {isEditing ? (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-[#042029] dark:text-white">{currentService ? 'Edit Service' : 'Add New Service'}</h3>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Price (Fbu)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 3 Hours"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              >
                <option value="Events">Events</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Catering">Catering</option>
                <option value="Equipment">Equipment</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
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
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-[#00B4D8] focus:ring-[#00B4D8]"
              />
              <label className="text-[#042029] dark:text-white">Available</label>
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
          {services.map(service => (
            <div key={service.id} className="glass-card rounded-2xl overflow-hidden">
              <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg text-[#042029] dark:text-white">{service.name}</h3>
                  {service.available && (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Available</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-white/60 mb-2">{service.category} • {service.duration}</p>
                <p className="text-sm text-gray-600 dark:text-white/70 mb-3 line-clamp-2">{service.description}</p>
                <p className="text-[#00B4D8] mb-4">{service.price.toLocaleString()} Fbu</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
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

// Past Events Tab
export const PastEventsTab: React.FC<{ pastEvents: Event[]; setPastEvents: (events: Event[]) => void }> = ({ pastEvents, setPastEvents }) => {
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this past event?')) {
      const updated = pastEvents.filter(event => event.id !== id);
      setPastEvents(updated);
      localStorage.setItem('pastEvents', JSON.stringify(updated));
      toast.success('Past event deleted');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-[#042029] dark:text-white">Past Events</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {pastEvents.map(event => {
          const totalCapacity = event.variants.reduce((sum, v) => sum + v.capacity, 0);
          const totalSold = event.variants.reduce((sum, v) => sum + v.ticketsSold, 0);

          return (
            <div key={event.id} className="glass-card rounded-2xl overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover grayscale-[30%]" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg text-[#042029] dark:text-white">{event.title}</h3>
                  <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">Past Event</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-white/70 mb-2">{event.date} • {event.time}</p>
                <p className="text-sm text-gray-600 dark:text-white/70 mb-4">{totalSold}/{totalCapacity} tickets sold</p>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {pastEvents.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-gray-500 dark:text-white/50">No past events yet</p>
        </div>
      )}
    </div>
  );
};

// About Tab
export const AboutTab: React.FC<{ content: AboutContent; setContent: (content: AboutContent) => void }> = ({ content, setContent }) => {
  const [formData, setFormData] = useState(content);

  const handleSave = () => {
    setContent(formData);
    localStorage.setItem('aboutContent', JSON.stringify(formData));
    toast.success('About content updated');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-[#042029] dark:text-white">About Page Content</h2>

      <div className="glass-card rounded-2xl p-6 space-y-6">
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
          <label className="block text-sm mb-2 text-[#042029] dark:text-white">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-[#042029] dark:text-white">Mission</label>
          <textarea
            value={formData.mission}
            onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-[#042029] dark:text-white">Vision</label>
          <textarea
            value={formData.vision}
            onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-[#042029] dark:text-white">History</label>
          <textarea
            value={formData.history}
            onChange={(e) => setFormData({ ...formData, history: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
          />
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Gallery Tab
export const GalleryTab: React.FC<{ images: any[]; setImages: (images: any[]) => void }> = ({ images, setImages }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentImage, setCurrentImage] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    date: '',
    description: ''
  });

  const handleAdd = () => {
    setIsEditing(true);
    setCurrentImage(null);
    setFormData({
      url: '',
      title: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleEdit = (image: any) => {
    setIsEditing(true);
    setCurrentImage(image);
    setFormData({
      url: image.url,
      title: image.title || '',
      date: image.date ? image.date.split('T')[0] : '',
      description: image.description || ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      const updated = images.filter(img => img.id !== id);
      setImages(updated);
      localStorage.setItem('galleryImages', JSON.stringify(updated));
      toast.success('Image deleted successfully');
    }
  };

  const handleSave = () => {
    if (!formData.url || !formData.title) {
      toast.error('Please enter image URL and title');
      return;
    }

    let updated;
    if (currentImage) {
      updated = images.map(img => img.id === currentImage.id ? { ...formData, id: currentImage.id } : img);
      toast.success('Image updated successfully');
    } else {
      const newImage = {
        id: Date.now().toString(),
        ...formData
      };
      updated = [...images, newImage];
      toast.success('Image added successfully');
    }

    setImages(updated);
    localStorage.setItem('galleryImages', JSON.stringify(updated));
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-[#042029] dark:text-white">Gallery Management</h2>
        {!isEditing && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Image
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg text-[#042029] dark:text-white">
              {currentImage ? 'Edit Image' : 'Add New Image'}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-white/70" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Image URL *</label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., New Year Celebration 2025"
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
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this memory or event..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>

            {formData.url && (
              <div>
                <label className="block text-sm mb-2 text-[#042029] dark:text-white">Preview</label>
                <img
                  src={formData.url}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
              >
                <Save className="w-5 h-5" />
                {currentImage ? 'Update' : 'Save'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-white/20 text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(image => (
              <div key={image.id} className="glass-card rounded-lg overflow-hidden group relative">
                <img src={image.url} alt={image.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042029]/90 via-[#042029]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm mb-1">{image.title}</p>
                    {image.date && (
                      <p className="text-[#F7D9A4] text-xs">
                        {new Date(image.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(image)}
                    className="p-2 rounded-lg bg-[#00B4D8] text-white hover:bg-[#0077B6] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-gray-500 dark:text-white/50">No images in gallery yet</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Settings Tab
export const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-[#042029] dark:text-white">Settings</h2>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg mb-4 text-[#042029] dark:text-white">Business Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-[#042029] dark:text-white">Business Name</label>
            <input
              type="text"
              defaultValue="World Beach Burundi"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#042029] dark:text-white">Email</label>
            <input
              type="email"
              defaultValue="info@worldbeachburundi.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#042029] dark:text-white">Phone</label>
            <input
              type="tel"
              defaultValue="+257 22 28 45 67"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#042029] dark:text-white">Address</label>
            <textarea
              defaultValue="Avenue de la Plage, Bujumbura, Burundi"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
            />
          </div>
          <button
            onClick={() => toast.success('Settings saved successfully')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
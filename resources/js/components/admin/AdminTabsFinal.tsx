import React, { useState, useEffect } from "react";
import { Space, SpaceImage } from "../types/spaces";
import { apiGet, apiPost, apiPut, apiDelete, appImageUrl } from "../../lib/api";
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import type { SiteSettings } from '../../types/siteSettings';



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



// SpacesTab


export const SpacesTab: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);

  const emptyForm: Space = {
    id: "",
    name: "",
    description: "",
    capacity: 50,
    price: 0,
    image: { url: "" },
    features: [""],
    category: "indoor",
  };

  const [formData, setFormData] = useState<Space>(emptyForm);

  // Map backend response to frontend Space
  const mapBackendSpace = (s: any): Space => ({
    id: s.id.toString(),
    name: s.title,
    description: s.description,
    capacity: s.capacity ?? 0,
    price: Number(s.price_per_hour),
    image: { url: s.image || "" },
    features: s.features ?? [],
    category: s.category as "indoor" | "outdoor" | "private",
  });

  // Fetch all spaces
  const fetchSpaces = async () => {
    try {
      const data = await apiGet<any[]>("/spaces");
      setSpaces(data.map(mapBackendSpace));
    } catch {
      toast.error("Failed to fetch spaces");
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  // Clean up previews
  useEffect(() => {
    return () => {
      if (formData.image?.preview) URL.revokeObjectURL(formData.image.preview);
    };
  }, [formData.image]);

  // Handlers
  const handleAdd = () => {
    setIsEditing(true);
    setCurrentSpace(null);
    setFormData(emptyForm);
  };

  const handleEdit = (space: Space) => {
    setIsEditing(true);
    setCurrentSpace(space);
    setFormData({
      ...space,
      image: { url: space.image?.url || "" },
      features: space.features.length ? space.features : [""],
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this space?")) return;
    try {
      await apiDelete(`/spaces/${id}`);
      setSpaces(spaces.filter(s => s.id !== id));
      toast.success("Space deleted");
    } catch {
      toast.error("Failed to delete space");
    }
  };

  const handleImageUpload = (file: File) => {
    setFormData({
      ...formData,
      image: { file, preview: URL.createObjectURL(file) },
    });
  };

  const handleAddFeature = () =>
    setFormData({ ...formData, features: [...formData.features, ""] });
  const handleRemoveFeature = (i: number) =>
    setFormData({
      ...formData,
      features: formData.features.filter((_, idx) => idx !== i),
    });
  const handleFeatureChange = (i: number, value: string) => {
    const updated = [...formData.features];
    updated[i] = value;
    setFormData({ ...formData, features: updated });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      toast.error("Name and description are required");
      return;
    }

    const fd = new FormData();
    fd.append("title", formData.name);
    fd.append("description", formData.description);
    fd.append("capacity", String(formData.capacity));
    fd.append("price_per_hour", String(formData.price));
    fd.append("category", formData.category);

    // Append features
    formData.features
      .filter(f => f.trim() !== "")
      .forEach((f, i) => fd.append(`features[${i}]`, f));

    // Only append image if user uploaded a new file
    if (formData.image?.file) {
      fd.append("image", formData.image.file);
    }

    try {
      if (currentSpace) {
        fd.append("_method", "PUT");

      await apiPost(`/spaces/${currentSpace.id}`, fd, true);

      } else {
        await apiPost("/spaces", fd, true);
        toast.success("Space created");
      }
      setIsEditing(false);
      fetchSpaces();
    } catch (err: any) {
      console.error(err.response?.data || err);
      toast.error("Failed to save space");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-[#042029] dark:text-white">Spaces Management</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add Space
        </button>
      </div>

      {isEditing ? (
        <div className="glass-card rounded-2xl p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-[#042029] dark:text-white">
              {currentSpace ? "Edit Space" : "Add New Space"}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2 text-[#042029] dark:text-white">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#042029] dark:text-white">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#042029] dark:text-white">Price (Fbu)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#042029] dark:text-white">Category</label>
                <select
                  value={formData.category}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      category: e.target.value as "indoor" | "outdoor" | "private",
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                >
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-[#042029] dark:text-white">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />
              {(formData.image?.preview || formData.image?.url) && (
                <img
                  src={formData.image.preview || appImageUrl(formData.image.url)}
                  className="w-32 h-32 object-cover rounded-lg mt-2 border"
                />
              )}
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
                {formData.features.map((feature, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={e => handleFeatureChange(i, e.target.value)}
                      placeholder="Feature name"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(i)}
                        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Save / Cancel */}
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
          {spaces.map(space => (
            <div key={space.id} className="glass-card rounded-2xl overflow-hidden">
              <img src={appImageUrl(space.image?.url)} alt={space.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg text-[#042029] dark:text-white mb-2">{space.name}</h3>
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
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(space.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
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


export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  category: string;
  available: boolean;
  features?: string[];
}

export const ServicesTab: React.FC<{
  services: Service[];
  setServices: (services: Service[]) => void;
  }> = ({ services, setServices }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [featureInput, setFeatureInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration: "",
    category: "Events",
    available: true,
    features: [] as string[]
  });

  /* ===========================
     FETCH
  ============================ */
  useEffect(() => {
    apiGet("/services")
      .then((data) => setServices(data))
      .catch(() => toast.error("Failed to load services"));
  }, [setServices]);

  /* ===========================
     ADD / EDIT
  ============================ */
  const handleAdd = () => {
    setCurrentService(null);
    setImageFile(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      duration: "",
      category: "Events",
      available: true,
      features: [] // ✅ FIXED
    });
    setIsEditing(true);
  };

  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setImageFile(null);

    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      available: service.available,
      features: service.features ?? [] // ✅ SAFE
    });

    setIsEditing(true);
  };

  /* ===========================
     SAVE
  ============================ */
  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", String(formData.price));
    payload.append("duration", formData.duration);
    payload.append("category", formData.category);
    payload.append("available", formData.available ? "1" : "0");

    if (imageFile) {
      payload.append("image", imageFile);
    }

    formData.features.forEach((feature, index) => {
      payload.append(`features[${index}]`, feature);
    });

    try {
      if (currentService) {

        payload.append("_method", "PUT");

        const updated = await apiPost(
  `/admin/services/${currentService.id}`,
  payload,
  { headers: { "Content-Type": "multipart/form-data" } }
      );

        setServices(
          services.map(s => (s.id === currentService.id ? updated : s))
        );
        toast.success("Service updated");
      } else {
        const created = await apiPost("/admin/services", payload, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        setServices([...services, created]);
        toast.success("Service added");
      }

      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save service");
    }
  };

  /* ===========================
     DELETE
  ============================ */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await apiDelete(`/admin/services/${id}`);
      setServices(services.filter(s => s.id !== id));
      toast.success("Service deleted");
    } catch {
      toast.error("Failed to delete service");
    }
  };

  
  /* ===========================
     UI
  ============================ */
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-[#042029] dark:text-white">
          Services Management
        </h2>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {isEditing ? (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl">
              {currentService ? "Edit Service" : "Add New Service"}
            </h3>
            <button onClick={() => setIsEditing(false)}>
              <X />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              placeholder="Name"
              value={formData.name}
              onChange={e =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border"
            />

            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={e =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className="w-full px-4 py-3 rounded-lg border"
            />

            <input
              placeholder="Duration"
              value={formData.duration}
              onChange={e =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border"
            />

            <select
              value={formData.category}
              onChange={e =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border"
            >
              <option>Events</option>
              <option>Entertainment</option>
              <option>Catering</option>
              <option>Equipment</option>
            </select>

            {/* IMAGE UPLOAD */}
            <div className="md:col-span-2">
              <label className="block mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={e =>
                  setImageFile(e.target.files?.[0] || null)
                }
                className="w-full px-4 py-3 rounded-lg border"
              />
            </div>

            <textarea
              rows={3}
              placeholder="Description"
              value={formData.description}
              onChange={e =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
              }
              className="md:col-span-2 w-full px-4 py-3 rounded-lg border"
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={e =>
                  setFormData({
                    ...formData,
                    available: e.target.checked
                  })
                }
              />
              <label>Available</label>
            </div>
          </div>

          {/* FEATURES */}
          <div className="md:col-span-2">
            <label className="block mb-2">Features</label>

            <div className="flex gap-2 mb-3">
              <input
                value={featureInput}
                onChange={e => setFeatureInput(e.target.value)}
                className="flex-1 px-4 py-3 border rounded-lg"
                placeholder="Type feature and click Add"
              />

              <button
                type="button"
                onClick={() => {
                  if (!featureInput.trim()) return;
                  setFormData({
                    ...formData,
                    features: [...formData.features, featureInput.trim()]
                  });
                  setFeatureInput("");
                }}
                className="btn-primary"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        features: formData.features.filter((_, i) => i !== index)
                      })
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>



          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white"
            >
              <Save />
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-lg border"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service.id} className="glass-card rounded-2xl overflow-hidden">
              <img src={service.image} className="h-48 w-full object-cover" />

              <div className="p-4">
                <h3 className="text-lg">{service.name}</h3>
                <p className="text-sm opacity-70">{service.description}</p>

                {/* FEATURES PREVIEW */}
                {service.features?.length > 0 && (
                  <ul className="mt-3 text-sm list-disc list-inside">
                    {service.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(service)}>
                    <Edit2 />
                  </button>
                  <button onClick={() => handleDelete(service.id)}>
                    <Trash2 />
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
export const AboutTab: React.FC = () => {
  const { settings, saveSettings, loading } = useSiteSettings();
  const [formData, setFormData] = useState<AboutContent>({
    title: settings.about_title,
    description: settings.about_description,
    mission: settings.about_mission,
    vision: settings.about_vision,
    history: settings.about_history,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      title: settings.about_title,
      description: settings.about_description,
      mission: settings.about_mission,
      vision: settings.about_vision,
      history: settings.about_history,
    });
  }, [
    settings.about_title,
    settings.about_description,
    settings.about_mission,
    settings.about_vision,
    settings.about_history,
  ]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveSettings({
        ...settings,
        about_title: formData.title,
        about_description: formData.description,
        about_mission: formData.mission,
        about_vision: formData.vision,
        about_history: formData.history,
      });
      toast.success('About content updated');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(' ')
          : '') ||
        'Failed to save about content';

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
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
          disabled={loading || isSaving}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

// Gallery Tab

const CATEGORIES = [
  "hero",
  "about",
  "gallery",
  "carousel",
  "qr_menu_carousel",
  "upcoming_event",
  "host_event",
];

const QR_CAROUSEL_CATEGORIES = ["qr_menu_carousel", "carousel"];

export const  GalleryTab: React.FC<{
  images: any[];
  setImages: (images: any[]) => void;
  }> = ({ images, setImages }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentImage, setCurrentImage] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "gallery",
  });

  const getGalleryImageSrc = (imagePath?: string) => {
    return appImageUrl(imagePath);
  };

  const qrCarouselImages = images.filter((image) => QR_CAROUSEL_CATEGORIES.includes(image.category));
  const regularGalleryImages = images.filter((image) => !QR_CAROUSEL_CATEGORIES.includes(image.category));

  /* ----------------------------
     ADD NEW IMAGE
  ---------------------------- */
  const handleAdd = () => {
    setIsEditing(true);
    setCurrentImage(null);
    setFile(null);
    setFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: "gallery",
    });
  };

  const handleAddQrCarousel = () => {
    setIsEditing(true);
    setCurrentImage(null);
    setFile(null);
    setFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: "qr_menu_carousel",
    });
  };

  /* ----------------------------
     EDIT IMAGE
  ---------------------------- */
  const handleEdit = (image: any) => {
    setIsEditing(true);
    setCurrentImage(image);
    setFile(null);
    setFormData({
      title: image.title || "",
      date: image.date ? image.date.split("T")[0] : "",
      description: image.description || "",
      category: image.category,
    });
  };

  /* ----------------------------
     DELETE IMAGE
  ---------------------------- */
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    await apiDelete(`/admin/gallery/${id}`);
    setImages(images.filter((img) => img.id !== id));
    toast.success("Image deleted successfully");
  };

  /* ----------------------------
     SAVE IMAGE (ADD or EDIT)
  ---------------------------- */
  const handleSave = async () => {
    if (!currentImage && !file) {
      toast.error("Please select an image");
      return;
    }

    if (!formData.title) {
      toast.error("Please enter a title");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("category", formData.category);

    if (file) {
      data.append("image", file);
    }

    try {
      let res;
      if (currentImage) {
        // EDIT
        res = await apiPost(`/admin/gallery/${currentImage.id}`, data, true);
        setImages(
          images.map((img) => (img.id === currentImage.id ? res : img))
        );
        toast.success("Image updated successfully");
      } else {
        // ADD
        res = await apiPost("/admin/gallery", data, true);
        setImages([res, ...images]);
        toast.success("Image added successfully");
      }
      setIsEditing(false);
      setFile(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save image");
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl text-[#042029] dark:text-white">Gallery Management</h2>
        {!isEditing && (
          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={handleAddQrCarousel}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-[#00B4D8] text-[#0077B6] dark:text-[#00B4D8] hover:bg-[#00B4D8]/10 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add QR Carousel Image
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Image
            </button>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg text-[#042029] dark:text-white">QR Menu Carousel</h3>
              <p className="text-sm text-gray-600 dark:text-white/60">
                Upload images here to show them in the hero carousel on the QR menu page.
              </p>
            </div>
            <button
              onClick={handleAddQrCarousel}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Upload QR Carousel Image
            </button>
          </div>

          {qrCarouselImages.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {qrCarouselImages.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => handleEdit(image)}
                  className="group relative aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5"
                >
                  <img
                    src={getGalleryImageSrc(image.image)}
                    alt={image.title || "QR menu carousel image"}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-left text-xs text-white">
                    {image.title || "QR Carousel"}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-white/20 dark:text-white/50">
              No QR carousel images yet.
            </p>
          )}
        </div>
      )}

      {/* ===== FORM ===== */}
      {isEditing ? (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg text-[#042029] dark:text-white">
              {currentImage ? "Edit Image" : "Add New Image"}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-white/70" />
            </button>
          </div>

          <div className="space-y-4">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, " ").toUpperCase()}
                </option>
              ))}
            </select>

            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">
                {currentImage ? "Replace Image" : "Upload Image"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>

   {(file || (currentImage && currentImage.image)) && (
  <div>
    <label className="block text-sm mb-2 text-[#042029] dark:text-white">Preview</label>
   <img
      src={
        file
          ? URL.createObjectURL(file) // live preview of selected file
          : getGalleryImageSrc(currentImage?.image)
      }
      alt="Preview"
      className="w-full max-h-64 object-cover rounded-lg"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
      }}
    />
  </div>
)}

            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border"
            />

            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border"
            />

            <textarea
              rows={3}
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
              >
                <Save className="w-5 h-5" />
                {currentImage ? "Update" : "Save"}
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
          {/* ===== IMAGE GRID ===== */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {regularGalleryImages.map((image) => (
              <div key={image.id} className="glass-card rounded-lg overflow-hidden group relative">
                <img
                  src={getGalleryImageSrc(image.image)}
                  alt={image.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 rounded-full bg-black/60 px-3 py-1 text-xs uppercase tracking-wide text-white">
                  {image.category?.replace(/_/g, " ")}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#042029]/90 via-[#042029]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm mb-1">{image.title}</p>
                    {image.date && (
                      <p className="text-[#F7D9A4] text-xs">
                        {new Date(image.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
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

          {regularGalleryImages.length === 0 && (
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
  const { settings, saveSettings, loading } = useSiteSettings();
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    setFormData(settings);
    setLogoFile(null);
  }, [settings]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (logoFile) {
        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          payload.append(key, value ?? '');
        });
        payload.append('logo', logoFile);
        await saveSettings(payload);
      } else {
        await saveSettings(formData);
      }
      toast.success('Settings saved successfully');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(' ')
          : '') ||
        'Failed to save settings';

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-[#042029] dark:text-white">Settings</h2>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg mb-4 text-[#042029] dark:text-white">Business Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-[#042029] dark:text-white">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white"
            />
            {(logoFile || formData.logo_path) && (
              <img
                src={
                  logoFile
                    ? URL.createObjectURL(logoFile)
                    : appImageUrl(formData.logo_path)
                }
                alt="Site logo preview"
                className="mt-3 h-16 w-auto rounded-lg bg-white p-2"
              />
            )}
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#042029] dark:text-white">Business Name</label>
            <input
              name="business_name"
              type="text"
              value={formData.business_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#042029] dark:text-white">Tagline</label>
            <input
              name="tagline"
              type="text"
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Primary Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Secondary Email</label>
              <input
                name="secondary_email"
                type="email"
                value={formData.secondary_email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Primary Phone</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Secondary Phone</label>
              <input
                name="secondary_phone"
                type="tel"
                value={formData.secondary_phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#042029] dark:text-white">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Weekday Hours</label>
              <input
                name="weekday_hours"
                type="text"
                value={formData.weekday_hours}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Weekend Hours</label>
              <input
                name="weekend_hours"
                type="text"
                value={formData.weekend_hours}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Facebook URL</label>
              <input
                name="facebook_url"
                type="url"
                value={formData.facebook_url}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Instagram URL</label>
              <input
                name="instagram_url"
                type="url"
                value={formData.instagram_url}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Twitter URL</label>
              <input
                name="twitter_url"
                type="url"
                value={formData.twitter_url}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Map URL</label>
              <input
                name="map_url"
                type="url"
                value={formData.map_url}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={loading || isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

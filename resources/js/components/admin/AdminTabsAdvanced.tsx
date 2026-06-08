import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, Check, Mail, Phone, User, MapPin, MessageSquare, Clock, Bell, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { apiDelete, apiGet, apiPost, apiPut } from '../../lib/api';

// Export NotificationsTab from separate component
export { NotificationsTab } from './NotificationsComponent';

// Types
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

interface Notification {
  id: string;
  type: 'order' | 'reservation' | 'event' | 'host-request' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

interface Activity {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  category: string;
  available: boolean;
}

interface AdminCategory {
  id: number;
  name: string;
  type: 'menu' | 'event' | 'space';
  icon?: string | null;
  description?: string | null;
}


// Host Event Requests Tab
export const HostEventRequestsTab: React.FC<{ requests: HostEventRequest[]; setRequests: (reqs: HostEventRequest[]) => void }> = ({ requests, setRequests }) => {
  const [viewingRequest, setViewingRequest] = useState<HostEventRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<HostEventRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    name: '',
    email: '',
    phone: '',
    eventType: '',
    date: '',
    startTime: '',
    endTime: '',
    guests: 0,
    message: '',
    budget: '',
    spacePreference: '',
    status: 'pending' as 'pending' | 'contacted' | 'confirmed' | 'declined',
    confirmationNotes: ''
  });

  const fetchHostEventRequests = async () => {
    try {
      setLoading(true);
      const data = await apiGet<any[]>('/admin/host-event-requests');
      setRequests(
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
          eventName: request.event_name || '',
          startTime: request.start_time || '',
          endTime: request.end_time || '',
        }))
      );
    } catch (error) {
      console.error('Error fetching host event requests:', error);
      toast.error('Failed to load host event requests');
    } finally {
      setLoading(false);
    }
  };

  const buildCustomerWhatsAppUrl = (request: HostEventRequest) => {
    const whatsappNumber = request.phone.replace(/\D/g, '');
    const message = [
      `Hello ${request.name},`,
      'Your host event request at World Beach has been confirmed.',
      `Request ID: ${request.id}`,
      request.eventName ? `Event Name: ${request.eventName}` : '',
      `Event Type: ${request.eventType}`,
      `Date: ${request.date}`,
      request.startTime ? `Start Time: ${request.startTime}` : '',
      request.endTime ? `End Time: ${request.endTime}` : '',
      request.guests ? `Expected Guests: ${request.guests}` : '',
      request.confirmationNotes ? `Details: ${request.confirmationNotes}` : '',
      'If you need any change, please reply here or call us.',
    ].filter(Boolean).join('\n');

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    fetchHostEventRequests();
  }, []);

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(req => req.status === filterStatus);

  const handleAdd = () => {
    setIsEditing(true);
    setCurrentRequest(null);
    setFormData({
      eventName: '',
      name: '',
      email: '',
      phone: '',
      eventType: '',
      date: '',
      startTime: '',
      endTime: '',
      guests: 0,
      message: '',
      budget: '',
      spacePreference: '',
      status: 'pending',
      confirmationNotes: ''
    });
  };

  const handleEdit = (request: HostEventRequest) => {
    setIsEditing(true);
    setCurrentRequest(request);
    setFormData({
      eventName: request.eventName || '',
      name: request.name,
      email: request.email,
      phone: request.phone,
      eventType: request.eventType,
      date: request.date,
      startTime: request.startTime || '',
      endTime: request.endTime || '',
      guests: request.guests,
      message: request.message,
      budget: request.budget || '',
      spacePreference: request.spacePreference || '',
      status: request.status,
      confirmationNotes: request.confirmationNotes || '',
    });
  };

  const persistRequest = async (request: HostEventRequest, status: HostEventRequest['status']) => {
    const payload = {
      event_name: request.eventName || request.eventType,
      event_type: request.eventType,
      event_date: request.date,
      start_time: request.startTime || null,
      end_time: request.endTime || null,
      expected_guests: request.guests || null,
      budget: request.budget || null,
      description: request.message || null,
      special_requirements: request.spacePreference || null,
      contact_name: request.name,
      contact_email: request.email,
      contact_phone: request.phone,
      status,
      confirmation_notes: request.confirmationNotes || null,
    };

    return apiPut<{ just_confirmed?: boolean }>(`/admin/host-event-requests/${request.id}`, payload);
  };

  const handleStatusChange = async (request: HostEventRequest, status: HostEventRequest['status']) => {
    try {
      const response = await persistRequest(request, status);
      const updatedRequest = { ...request, status };

      if (status === 'confirmed' && (response?.just_confirmed || !!request.confirmationNotes)) {
        window.open(buildCustomerWhatsAppUrl(updatedRequest), '_blank');
      }

      if (viewingRequest?.id === request.id) {
        setViewingRequest(updatedRequest);
      }

      await fetchHostEventRequests();
      toast.success('Status updated');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(' ')
          : '') ||
        'Failed to update host event request status';

      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      await apiDelete(`/admin/host-event-requests/${id}`);
      setRequests(requests.filter((req) => req.id !== id));
      toast.success('Request deleted');
    } catch (error) {
      console.error('Error deleting host event request:', error);
      toast.error('Failed to delete request');
    }
  };

  const handleSave = async () => {
    if (!formData.eventName || !formData.name || !formData.email || !formData.phone || !formData.eventType || !formData.date) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      event_name: formData.eventName,
      event_type: formData.eventType,
      event_date: formData.date,
      start_time: formData.startTime || null,
      end_time: formData.endTime || null,
      expected_guests: formData.guests ? Number(formData.guests) : null,
      budget: formData.budget || null,
      description: formData.message || null,
      special_requirements: formData.spacePreference || null,
      contact_name: formData.name,
      contact_email: formData.email,
      contact_phone: formData.phone,
      status: formData.status,
      confirmation_notes: formData.confirmationNotes || null,
    };

    try {
      if (currentRequest) {
        const response = await apiPut<{ just_confirmed?: boolean }>(`/admin/host-event-requests/${currentRequest.id}`, payload);
        const confirmedRequest: HostEventRequest = {
          ...currentRequest,
          eventName: formData.eventName,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventType: formData.eventType,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          guests: Number(formData.guests || 0),
          message: formData.message,
          budget: formData.budget,
          spacePreference: formData.spacePreference,
          status: formData.status,
          confirmationNotes: formData.confirmationNotes,
        };

        if (
          formData.status === 'confirmed' &&
          (response?.just_confirmed || !!formData.confirmationNotes || !!formData.startTime || !!formData.endTime)
        ) {
          window.open(buildCustomerWhatsAppUrl(confirmedRequest), '_blank');
        }

        toast.success('Request updated');
      } else {
        await apiPost('/host-event-requests', payload);
        toast.success('Request added');
      }

      await fetchHostEventRequests();
      setIsEditing(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(' ')
          : '') ||
        'Failed to save host event request';

      toast.error(message);
    }
  };

  if (viewingRequest) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setViewingRequest(null)}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-white/20 text-[#042029] dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-2xl text-[#042029] dark:text-white">Host Event Request Details</h2>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg mb-4 text-[#042029] dark:text-white">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#00B4D8]" />
                  <span className="text-gray-600 dark:text-white/70">Name:</span>
                  <span className="text-[#042029] dark:text-white font-semibold">{viewingRequest.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#00B4D8]" />
                  <span className="text-gray-600 dark:text-white/70">Email:</span>
                  <span className="text-[#042029] dark:text-white">{viewingRequest.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#00B4D8]" />
                  <span className="text-gray-600 dark:text-white/70">Phone:</span>
                  <span className="text-[#042029] dark:text-white">{viewingRequest.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00B4D8]" />
                  <span className="text-gray-600 dark:text-white/70">Submitted:</span>
                  <span className="text-[#042029] dark:text-white">{new Date(viewingRequest.submittedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg mb-4 text-[#042029] dark:text-white">Event Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-white/70">Event Name:</span>
                  <p className="text-[#042029] dark:text-white font-semibold">{viewingRequest.eventName || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-white/70">Event Type:</span>
                  <p className="text-[#042029] dark:text-white font-semibold">{viewingRequest.eventType}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-white/70">Date:</span>
                  <p className="text-[#042029] dark:text-white">{viewingRequest.date}</p>
                </div>
                {(viewingRequest.startTime || viewingRequest.endTime) && (
                  <div>
                    <span className="text-gray-600 dark:text-white/70">Time:</span>
                    <p className="text-[#042029] dark:text-white">{[viewingRequest.startTime, viewingRequest.endTime].filter(Boolean).join(' - ')}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600 dark:text-white/70">Expected Guests:</span>
                  <p className="text-[#042029] dark:text-white">{viewingRequest.guests}</p>
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-white/70 mb-2">Status:</label>
                  <select
                    value={viewingRequest.status}
                    onChange={(e) => handleStatusChange(viewingRequest, e.target.value as HostEventRequest['status'])}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-white/10 pt-6">
            <h3 className="text-lg mb-3 text-[#042029] dark:text-white">Message</h3>
            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
              <p className="text-gray-600 dark:text-white/70">{viewingRequest.message}</p>
            </div>
          </div>
          {viewingRequest.confirmationNotes && (
            <div className="border-t border-gray-200 dark:border-white/10 pt-6">
              <h3 className="text-lg mb-3 text-[#042029] dark:text-white">Confirmation Notes</h3>
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                <p className="text-gray-600 dark:text-white/70">{viewingRequest.confirmationNotes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl text-[#042029] dark:text-white">Host Event Requests</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="confirmed">Confirmed</option>
            <option value="declined">Declined</option>
          </select>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Request
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-[#042029] dark:text-white">{currentRequest ? 'Edit Host Event Request' : 'New Host Event Request'}</h3>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm mb-2 text-[#042029] dark:text-white">Event Name</label><input type="text" value={formData.eventName} onChange={(e) => setFormData({ ...formData, eventName: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white" /></div>
            <div><label className="block text-sm mb-2 text-[#042029] dark:text-white">Event Type</label><input type="text" value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white" /></div>
            <div><label className="block text-sm mb-2 text-[#042029] dark:text-white">Contact Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white" /></div>
            <div><label className="block text-sm mb-2 text-[#042029] dark:text-white">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white" /></div>
            <div><label className="block text-sm mb-2 text-[#042029] dark:text-white">Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white" /></div>
            <div><label className="block text-sm mb-2 text-[#042029] dark:text-white">Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white" /></div>
            <div><label className="block text-sm mb-2 text-[#042029] dark:text-white">Start Time</label><input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white" /></div>
            <div><label className="block text-sm mb-2 text-[#042029] dark:text-white">End Time</label><input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white" /></div>
            <div><label className="block text-sm mb-2 text-[#042029] dark:text-white">Guests</label><input type="number" min="0" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white" /></div>
            <div><label className="block text-sm mb-2 text-[#042029] dark:text-white">Budget</label><input type="text" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white" /></div>
            <div className="md:col-span-2"><label className="block text-sm mb-2 text-[#042029] dark:text-white">Description / Message</label><textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white resize-none" /></div>
            <div className="md:col-span-2"><label className="block text-sm mb-2 text-[#042029] dark:text-white">Special Requirements</label><textarea value={formData.spacePreference} onChange={(e) => setFormData({ ...formData, spacePreference: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white resize-none" /></div>
            <div><label className="block text-sm mb-2 text-[#042029] dark:text-white">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as HostEventRequest['status'] })} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white"><option value="pending">Pending</option><option value="contacted">Contacted</option><option value="confirmed">Confirmed</option><option value="declined">Declined</option></select></div>
            <div><label className="block text-sm mb-2 text-[#042029] dark:text-white">Confirmation Notes</label><textarea value={formData.confirmationNotes} onChange={(e) => setFormData({ ...formData, confirmationNotes: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white resize-none" /></div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg">
              <Save className="w-5 h-5" />
              Save Request
            </button>
            <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-lg border border-gray-300 dark:border-white/20 text-[#042029] dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: requests.length, color: 'blue' },
          { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, color: 'yellow' },
          { label: 'Confirmed', value: requests.filter(r => r.status === 'confirmed').length, color: 'green' },
          { label: 'Declined', value: requests.filter(r => r.status === 'declined').length, color: 'red' }
        ].map((stat, index) => (
          <div key={index} className="glass-card rounded-lg p-4">
            <p className="text-xs text-gray-600 dark:text-white/70 mb-1">{stat.label}</p>
            <p className="text-2xl text-[#042029] dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#00B4D8] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-white/50">Loading requests...</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Name</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Event</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Date</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Guests</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Status</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600 dark:text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {filteredRequests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-[#042029] dark:text-white">{request.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-white/70">{request.eventName || request.eventType}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-white/70">{request.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-white/70">{request.guests}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        request.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        request.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingRequest(request)}
                          className="p-1.5 rounded bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(request)}
                          className="p-1.5 rounded bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(request.id)}
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
        </div>
      )}

      {filteredRequests.length === 0 && !loading && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-gray-500 dark:text-white/50">No requests found</p>
        </div>
      )}
    </div>
  );
};

// Activities Management Tab
export const ActivitiesTab: React.FC<{ activities: Activity[]; setActivities: (activities: Activity[]) => void }> = ({ activities, setActivities }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🏖️',
    image: '',
    category: 'Beach Activities',
    available: true
  });

  const handleAdd = () => {
    setIsEditing(true);
    setCurrentActivity(null);
    setFormData({
      name: '',
      description: '',
      icon: '🏖️',
      image: '',
      category: 'Beach Activities',
      available: true
    });
  };

  const handleEdit = (activity: Activity) => {
    setIsEditing(true);
    setCurrentActivity(activity);
    setFormData(activity);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      const updated = activities.filter(a => a.id !== id);
      setActivities(updated);
      localStorage.setItem('activities', JSON.stringify(updated));
      toast.success('Activity deleted');
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    let updated;
    if (currentActivity) {
      updated = activities.map(a => a.id === currentActivity.id ? { ...formData, id: currentActivity.id } : a);
      toast.success('Activity updated');
    } else {
      const newActivity = { ...formData, id: Date.now().toString() };
      updated = [...activities, newActivity];
      toast.success('Activity added');
    }

    setActivities(updated);
    localStorage.setItem('activities', JSON.stringify(updated));
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-[#042029] dark:text-white">Activities Management</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Activity
        </button>
      </div>

      {isEditing ? (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-[#042029] dark:text-white">{currentActivity ? 'Edit Activity' : 'Add New Activity'}</h3>
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
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Icon (Emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🏖️"
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
                <option value="Beach Activities">Beach Activities</option>
                <option value="Water Sports">Water Sports</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Relaxation">Relaxation</option>
              </select>
            </div>
            <div>
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
          {activities.map(activity => (
            <div key={activity.id} className="glass-card rounded-2xl overflow-hidden">
              <img src={activity.image} alt={activity.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{activity.icon}</span>
                  <h3 className="text-lg text-[#042029] dark:text-white">{activity.name}</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-white/60 mb-2">{activity.category}</p>
                <p className="text-sm text-gray-600 dark:text-white/70 mb-4 line-clamp-2">{activity.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(activity)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
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

      {!isEditing && activities.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-gray-500 dark:text-white/50">No activities yet</p>
        </div>
      )}
    </div>
  );
};




export const CategoriesTab: React.FC<{ categories: AdminCategory[]; setCategories: (cats: AdminCategory[]) => void }> = ({ categories, setCategories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<AdminCategory | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'menu' as 'event' | 'space' | 'menu',
    icon: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiGet<AdminCategory[]>('/categories');
      setCategories(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = filterType === 'all' 
    ? categories 
    : categories.filter(c => c.type === filterType);

  const handleAdd = () => {
    setIsEditing(true);
    setCurrentCategory(null);
    setFormData({ name: '', description: '', type: 'menu', icon: '' });
  };

  const handleEdit = (category: AdminCategory) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      type: category.type,
      icon: category.icon || '',
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await apiDelete<{ message: string }>(`/admin/categories/${id}`);
      toast.success(res.message);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error deleting category');
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (currentCategory) {
        const res = await apiPut<{ message: string; category: AdminCategory }>(
          `/admin/categories/${currentCategory.id}`,
          formData
        );
        toast.success(res.message);
      } else {
        const res = await apiPost<{ message: string; category: AdminCategory }>(
          '/admin/categories',
          formData
        );
        toast.success(res.message);
      }
      setIsEditing(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl text-[#042029] dark:text-white">Category Management</h2>
          <p className="text-sm text-gray-600 dark:text-white/70">Manage categories for events, spaces, and menu</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'menu', 'event', 'space'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              filterType === type
                ? 'bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Categories
          </button>
        ))}
      </div>

      {isEditing ? (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-[#042029] dark:text-white">{currentCategory ? 'Edit Category' : 'Add New Category'}</h3>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Category Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-[#042029] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              >
                <option value="menu">Menu</option>
                <option value="event">Event</option>
                <option value="space">Space</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#042029] dark:text-white">Icon (Optional)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🍕"
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="md:col-span-3 text-center text-gray-500 dark:text-white/50">Loading categories...</div>
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <div key={category.id} className="glass-card rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {category.icon && <span className="text-2xl">{category.icon}</span>}
                    <div>
                      <h3 className="text-lg text-[#042029] dark:text-white">{category.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-[#00B4D8]/10 text-[#00B4D8]">
                        {category.type}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-white/70 mb-4">{category.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center md:col-span-3">
              <p className="text-gray-500 dark:text-white/50">No categories found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

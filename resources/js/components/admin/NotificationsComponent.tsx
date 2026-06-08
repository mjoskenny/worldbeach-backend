import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle, Trash2, AlertCircle, ShoppingBag, Calendar, Mail, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { apiDelete, apiGet, apiPatch } from '../../lib/api';

interface Notification {
  id: string;
  type: 'order' | 'reservation' | 'event' | 'host-request' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationsResponse {
  notifications: Notification[];
  summary: {
    total: number;
    unread: number;
    high_priority: number;
    today: number;
  };
}

export const NotificationsTab: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiGet<NotificationsResponse>('/admin/notifications');
      setNotifications(response.notifications);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    let lastId = notifications.length
      ? Math.max(...notifications.map((notification) => Number(notification.id)))
      : 0;
    let source: EventSource | null = null;

    const connect = () => {
      source = new EventSource(`/api/admin/notifications/stream?last_id=${lastId}`, {
        withCredentials: true,
      });

      source.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        const incoming = payload.notifications as Notification[];

        if (!incoming.length) {
          return;
        }

        lastId = Number(payload.last_id || lastId);
        setNotifications((current) => {
          const seen = new Set(current.map((notification) => notification.id));
          const merged = [...incoming.filter((notification) => !seen.has(notification.id)), ...current];
          return merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        });
      };

      source.onerror = () => {
        source?.close();
        window.setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      source?.close();
    };
  }, [loading, notifications.length]);

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') {
      return notifications;
    }

    if (filter === 'unread') {
      return notifications.filter((notification) => !notification.read);
    }

    return notifications.filter((notification) => notification.type === filter);
  }, [filter, notifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiPatch(`/admin/notifications/${id}/read`, {});
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiPatch('/admin/notifications/read-all', {});
      setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`/admin/notifications/${id}`);
      setNotifications((current) => current.filter((notification) => notification.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all notifications?')) {
      return;
    }

    try {
      await apiDelete('/admin/notifications/clear');
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch (error) {
      toast.error('Failed to clear notifications');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-[#00B4D8]" />;
      case 'reservation':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'host-request':
        return <Mail className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500';
      case 'medium':
        return 'border-l-4 border-l-yellow-500';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const highPriorityCount = notifications.filter((notification) => notification.priority === 'high').length;
  const todayCount = notifications.filter((notification) => {
    const notificationDate = new Date(notification.timestamp);
    return notificationDate.toDateString() === new Date().toDateString();
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl text-[#042029] dark:text-white">Notifications</h2>
          <p className="text-sm text-gray-600 dark:text-white/70">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-colors text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Mark All Read
            </button>
          )}
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'order', label: 'Orders' },
          { id: 'reservation', label: 'Reservations' },
          { id: 'event', label: 'Events' },
          { id: 'host-request', label: 'Host Requests' },
          { id: 'system', label: 'System' }
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setFilter(type.id)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              filter === type.id
                ? 'bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: notifications.length, icon: Bell },
          { label: 'Unread', value: unreadCount, icon: AlertCircle },
          { label: 'High Priority', value: highPriorityCount, icon: AlertCircle },
          { label: 'Today', value: todayCount, icon: Calendar }
        ].map((stat, index) => (
          <div key={index} className="glass-card rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-[#00B4D8]" />
              <p className="text-xs text-gray-600 dark:text-white/70">{stat.label}</p>
            </div>
            <p className="text-2xl text-[#042029] dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <LoaderCircle className="w-10 h-10 animate-spin mx-auto mb-4 text-[#00B4D8]" />
          <p className="text-gray-500 dark:text-white/50">Loading notifications...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-white/20" />
              <p className="text-gray-500 dark:text-white/50">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`glass-card rounded-lg p-4 ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'bg-[#00B4D8]/5 dark:bg-[#00B4D8]/10' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getTypeIcon(notification.type)}</div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`${!notification.read ? 'font-semibold' : ''} text-[#042029] dark:text-white`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 rounded-full bg-[#00B4D8]"></span>
                        )}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-white/50 whitespace-nowrap">
                        {new Date(notification.timestamp).toLocaleDateString()} {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-white/70 mb-3">{notification.message}</p>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                        notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {notification.priority} priority
                      </span>

                      <span className="text-xs px-2 py-1 rounded-full bg-[#00B4D8]/10 text-[#00B4D8]">
                        {notification.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

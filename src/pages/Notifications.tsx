import React, { useEffect, useState } from 'react';
import { notificationApi, Notification } from '../api/notification';
import { CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useAppDispatch } from '../store';
import { setNotifications as setReduxNotifications } from '../store/slices/notificationSlice';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationApi.getNotifications();
      let notifications: Notification[] = [];
      if (Array.isArray(data)) {
        notifications = data.map((n: any) => ({
          _id: n._id,
          title: n.message || n.type || 'Notification',
          message: n.message || '',
          read: n.isRead ?? n.read ?? false,
          createdAt: n.createdAt,
        }));
      } else if (data && Array.isArray((data as any).notifications)) {
        notifications = (data as any).notifications.map((n: any) => ({
          _id: n._id,
          title: n.message || n.type || 'Notification',
          message: n.message || '',
          read: n.isRead ?? n.read ?? false,
          createdAt: n.createdAt,
        }));
      } else {
        setNotifications([]);
        dispatch(setReduxNotifications([]));
        setError('Failed to load notifications: invalid response.');
        setLoading(false);
        return;
      }
      setNotifications(notifications);
      // Map to Redux Notification type and update Redux state
      dispatch(setReduxNotifications(
        notifications.map(n => ({
          id: n._id,
          title: n.title,
          message: n.message,
          type: 'info', // or map n.type if available
          timestamp: n.createdAt,
          read: n.read,
        }))
      ));
    } catch (err) {
      setError('Failed to load notifications.');
      setNotifications([]);
      dispatch(setReduxNotifications([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(n => n.map(notif => notif._id === id ? { ...notif, read: true } : notif));
    } catch (err) {}
  };

  return (
    <div className="p-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Badge variant="info">{Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0} Unread</Badge>
        </div>
      </CardHeader>
      <div className="mt-6 space-y-4">
        {error && <div className="text-red-500 text-center py-4">{error}</div>}
        {loading ? (
          <div className="flex justify-center py-10">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
        ) : Array.isArray(notifications) && notifications.length === 0 ? (
          <div className="text-gray-500 text-center py-10">No notifications.</div>
        ) : Array.isArray(notifications) ? notifications.map(notif => (
          <div key={notif._id} className={`flex items-start gap-4 p-4 rounded-lg border ${notif.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex-shrink-0 pt-1">
              {notif.read ? <CheckCircle2 className="h-5 w-5 text-green-400" /> : <Bell className="h-5 w-5 text-blue-400" />}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{notif.title}</div>
              <div className="text-gray-700 text-sm mt-1">{notif.message}</div>
              <div className="text-xs text-gray-400 mt-2">{new Date(notif.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex flex-col gap-2">
              {!notif.read && (
                <Button size="sm" variant="primary" onClick={() => markAsRead(notif._id)}>Mark as read</Button>
              )}
            </div>
          </div>
        )) : null}
      </div>
    </div>
  );
};

export default Notifications;

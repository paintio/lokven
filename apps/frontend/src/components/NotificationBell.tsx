'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative text-secondary hover:text-primary transition-colors p-1"
      >
        <img src="/icons/bell.svg" alt="Уведомления" className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#E5E7EB] z-50 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-[#E5E7EB]">
              <h4 className="font-semibold text-[#111827]">Уведомления</h4>
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-[#6B7280] text-sm">
                Нет уведомлений
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors ${
                    !notif.isRead ? 'bg-[#EFF6FF]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#111827]">{notif.title}</div>
                      <div className="text-xs text-[#6B7280] mt-0.5">{notif.message}</div>
                      {notif.link && (
                        <Link
                          href={notif.link}
                          className="text-xs text-[#3B82F6] hover:underline mt-1 inline-block"
                          onClick={() => {
                            markAsRead(notif.id);
                            setShowDropdown(false);
                          }}
                        >
                          Перейти →
                        </Link>
                      )}
                    </div>
                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-[10px] text-[#3B82F6] hover:underline whitespace-nowrap ml-2"
                      >
                        Прочитано
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

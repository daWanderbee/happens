"use client";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { useEffect, useState } from "react";

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<any[]>([]);

  async function load() {
    try {
      const res = await fetch("/api/notifications", { credentials: "include" });
      if (!res.ok) return;
      const text = await res.text();
      if (!text) return;
      setNotifications(JSON.parse(text) ?? []);
    } catch (err) {
      console.error("Notification fetch failed", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markAsRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, {
      method: "PATCH",
      credentials: "include",
    });
    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }

  return (
    <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col h-[50vh]">
      <h2 className="font-semibold mb-4 text-lg shrink-0">Support Updates</h2>

      <div className="overflow-y-auto flex-1 space-y-3 pr-1">
        {notifications.length === 0 && (
          <p className="text-sm text-muted-foreground text-center mt-8">
            No notifications yet
          </p>
        )}
        {notifications.map((n) => (
          <NotificationItem key={n.id} n={n} onRead={() => markAsRead(n.id)} />
        ))}
      </div>
    </div>
  );
}

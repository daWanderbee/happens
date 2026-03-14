"use client";

import NotificationsPanel from "@/components/notifications/NotificationsPanel";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-background rounded-xl rounded-b flex justify-center">
      <div className="w-full max-w-2xl px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Bell className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              Support Updates
            </h1>
            <p className="text-sm text-muted-foreground">
              Encouragement from the community
            </p>
          </div>
        </div>

        {/* Notifications */}
        <NotificationsPanel />
      </div>
    </main>
  );
}



import NotificationsPanel from "@/components/notifications/NotificationsPanel";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full bg-primary mx-auto">
      <div className="flex-1">{children}</div>

      <aside className="hidden lg:block w-80 ml-3">
        <NotificationsPanel />
      </aside>
    </div>
  );
}

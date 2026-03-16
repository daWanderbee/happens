import ChatListPanel from "@/components/chat/ChatListPanel";
import NotificationsPanel from "@/components/notifications/NotificationsPanel";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full bg-primary mx-auto">
      {/* Feed */}
      <div className="flex-1 bg-primary">{children}</div>

      {/* Right Panel */}
      <aside className="hidden lg:flex flex-col w-80 ml-3 gap-4 sticky top-20 h-fit">
        <NotificationsPanel />

        <ChatListPanel />
      </aside>
    </div>
  );
}

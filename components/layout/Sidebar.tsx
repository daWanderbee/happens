"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Home, Bell, User, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../ui/theme-toggle";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }: Props) {
  const pathname = usePathname();
  const [identity, setIdentity] = useState<{ name: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setIdentity({ name: data.username }))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* ── Mobile overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed md:relative top-0 left-0 z-50",
          "h-screen w-64 flex flex-col",
          "border-r transition-transform duration-300 ease-in-out",
          "bg-background border-border",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* ── Header: greeting + theme toggle ── */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-border flex-shrink-0">
          <span
            className="text-[19px] leading-none text-foreground select-none truncate"
            style={{ fontFamily: '"Shadows Into Light", cursive' }}
          >
            {identity?.name ? `Hello ${identity.name}` : "Hello"}
          </span>

          <ThemeToggle duration={600} />
        </div>

        {/* ── Nav ── */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                  "transition-all duration-150",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon
                  size={17}
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-foreground/40",
                  )}
                />
                {name}
              </Link>
            );
          })}
          <div className="p-3 border-t border-border">
            <button
              onClick={() => {
                signOut({ redirect: false }).then(() => {
                  globalThis.location.href = "/";
                });
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-150"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

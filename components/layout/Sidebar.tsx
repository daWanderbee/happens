"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Home, Bell, User, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../ui/theme-toggle";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { faBookmark, faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Saved", href: "/saved", icon: faBookmark },
  { name: "Chats", href: "/chat", icon: faComments },
];

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          // ✅ fixed on mobile (slides in), sticky on desktop (full height)
          "fixed md:sticky md:top-0",
          "top-0 left-0 z-50",
          "h-screen w-64", // ✅ h-screen — always full viewport height
          "flex flex-col",
          "border-r transition-transform duration-300 ease-in-out",
          "bg-background border-border",
          "flex-shrink-0", // ✅ never squish in flex layouts
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-border flex-shrink-0">
          <span
            className="text-[19px] leading-none text-foreground select-none truncate"
            style={{ fontFamily: '"Shadows Into Light", cursive' }}
          >
            {identity?.name ? `Hello ${identity.name}` : "Hello"}
          </span>
          <ThemeToggle />
        </div>

        {/* ── Nav ── */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
          {navItems.map(({ name, href, icon }) => {
            const isActive = pathname === href;
            const isFAIcon = typeof icon === "object" && "iconName" in icon;

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
                {isFAIcon ? (
                  <FontAwesomeIcon
                    icon={icon as any}
                    className={cn(
                      "h-[17px] w-[17px] flex-shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-foreground/40",
                    )}
                  />
                ) : (
                  React.createElement(icon as any, {
                    size: 17,
                    className: cn(
                      "flex-shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-foreground/40",
                    ),
                  })
                )}
                {name}
              </Link>
            );
          })}
        </nav>

        {/* ── Logout pinned to bottom ── */}
        <div className="p-3 border-t border-border flex-shrink-0">
          <button
            onClick={() =>
              signOut({ redirect: false }).then(() => {
                globalThis.location.href = "/";
              })
            }
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-150"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

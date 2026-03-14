"use client";

import Image from "next/image";
import { ThemeToggle } from "../ui/theme-toggle";
import Link from "next/link";
import { BellIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";


type NavbarProps = {
  setIsOpen: (open: boolean) => void;
};

export default function Navbar({ setIsOpen }: NavbarProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/notifications/unread-count")
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.count ?? 0));
  }, []);

  return (
    <header
      className="relative h-14 w-full flex items-center justify-between px-5"
      style={{ backgroundColor: "hsl(var(--primary))" }}
    >
      {/* ── LEFT: Logo + wordmark ── */}
      {/* Hamburger - only mobile */}
      <div className="flex gap-2 ">
        <button className="md:hidden" onClick={() => setIsOpen(true)}>
          <Menu />
        </button>
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Happens home"
        >
          <div className="relative flex-shrink-0">
            <Image
              src="/logo/logo.svg"
              alt="Happens logo"
              width={26}
              height={26}
              priority
              className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]"
            />
          </div>

          <span
            className="text-[22px] leading-none select-none tracking-wide text-white"
            style={{ fontFamily: '"Shadows Into Light", cursive' }}
          >
            Happens
          </span>
        </Link>
      </div>

      {/* ── RIGHT: Bell + Theme toggle ── */}
      <div className="flex md: items-center gap-1">
        {/* Notification bell */}
        <Link
          href="/notifications"
          className="relative flex items-center justify-center h-9 w-9 rounded-full transition-all duration-200 hover:bg-white/10 active:scale-95"
          aria-label={
            unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "Notifications"
          }
        >
          <BellIcon className="h-[18px] w-[18px] text-white/90" />

          {/* Badge */}
          {mounted && unreadCount > 0 && (
            <span
              className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[10px] font-semibold leading-none px-1 text-white"
              style={{ backgroundColor: "hsl(19, 90%, 55%)" }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

       
      </div>
    </header>
  );
}

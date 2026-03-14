"use client";

import { useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import IntentIsland from "@/components/ui/IntentIsland";
import Sidebar from "@/components/layout/Sidebar";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-primary flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 flex flex-col">
        <Navbar setIsOpen={setIsOpen} />
        <main className="flex-1 md:px-3">{children}</main>
        <IntentIsland />
      </div>
    </div>
  );
}

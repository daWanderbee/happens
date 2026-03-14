"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Navbar from "@/components/navigation/Navbar";
import { useState } from "react";

export default function HomePage() {
   const [isOpen, setIsOpen] = useState(false);
  return (
    <main className="min-h-screen bg-primary flex flex-col md:px-4">
      <Navbar setIsOpen={setIsOpen} />

      {/* MAIN CONTENT */}
      {/* MAIN CONTENT */}
<div className="flex-1 flex ">
  <div className="w-full flex flex-col lg:flex-row gap-6">

    {/* LEFT: CONTENT CARD (FIXED WIDTH) */}
    <Card className="
      w-full
      h-[100vh]
      lg:w-[420px]
      rounded-t-[28px]
      rounded-b-[0px]
      border-none
      shadow-md
      bg-card
      flex flex-col
    ">
      <CardHeader className="pt-16 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-primary dark:text-card-foreground leading-tight">
          A quiet place to share what didn’t go right.
        </h1>

        <Image
          src="/images/flowers.webp"
          alt="Flowers illustration"
          width={200}
          height={200}
          className="my-6"
        />

        <CardDescription className="text-[16px] text-primary dark:text-card-foreground leading-relaxed max-w-[36ch]">
          Share experiences anonymously. No profiles. No likes. No judgement.
        </CardDescription>
      </CardHeader>

      <CardContent />

      <CardFooter className="flex flex-col items-center gap-6 pb-8">
        <Button className="h-[56px] rounded-full px-16 text-[14px] font-medium">
          <Link href="/signin">Continue</Link>
        </Button>

        <p className="text-[13px] text-foreground leading-relaxed text-center max-w-[36ch]">
          Your name, email, and identity are never shown. What you share
          fades over time.
        </p>
      </CardFooter>
    </Card>

    {/* RIGHT: FULL-WIDTH IMAGE CARD */}
    <Card className="
      hidden
      lg:flex
      flex-1
      rounded-[28px]
      border-none
      shadow-md
      overflow-hidden
      p-0 m-0
    ">
      <div className="relative w-full h-full">
        <Image
          src="/images/wallpaper.webp"
          alt="Calm background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </Card>

  </div>
</div>
    </main>
  );
}

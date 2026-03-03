"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/backgrounds/Fundo 1.png"
        alt="Background"
        fill
        className="object-cover"
        priority
        quality={100}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Container - Centered */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8 sm:mb-12 w-full flex justify-center">
          <div className="relative w-64 h-64 sm:w-40 sm:h-40 md:w-96 md:h-96">
            <Image
              src="/logos/Espanhol Branco@2x.png"
              alt="Agenda Positiva"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="w-full max-w-sm px-4">
          <Link
            href="/verificar"
            className="block w-full py-4 px-6 hover:opacity-90 text-white text-center font-bold text-lg sm:text-xl rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: "var(--button-primary)" }}
          >
            Pre-Inscripción
          </Link>
        </div>
      </div>
    </div>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function WhatsAppButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  const phoneNumber = "910000000000";
  const message = "Hello NPB Media, I would like to discuss a project.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    // Timer to hide the button after 10 seconds on the website
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Requirement: Permanently removed whatsapp icon from admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Requirement: Auto hide after 10 sec on website
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-[100] group animate-in fade-in duration-700">
      {/* Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white rounded-xl shadow-2xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
        <p className="text-xs font-black uppercase tracking-widest text-primary italic">Chat with Experts</p>
      </div>

      {/* Pulse Effect */}
      <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping group-hover:animate-none" />
      
      {/* Main Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group-hover:rotate-[360deg]",
          "hover:shadow-[#25D366]/40"
        )}
        aria-label="Contact us on WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-8 h-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982 1.001-3.646-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.412.015 12.046c0 2.121.54 4.193 1.566 6.04L0 24l6.145-1.612a11.831 11.831 0 005.904 1.662h.004c6.632 0 12.028-5.412 12.032-12.048a11.812 11.812 0 00-3.526-8.412z" />
        </svg>
      </a>
    </div>
  );
}

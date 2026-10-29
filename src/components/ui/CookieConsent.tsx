"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasConsented = localStorage.getItem("npb-cookie-consent");
    if (!hasConsented) {
      // Delay visibility for a smooth entrance effect
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("npb-cookie-consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="relative p-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-[2.5rem] shadow-2xl overflow-hidden group">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.4rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 animate-bounce">
            <Cookie className="w-8 h-8" />
          </div>
          
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h4 className="text-lg font-headline font-black italic text-slate-900">Cookie Preference</h4>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              We use digital cookies to enhance your browsing experience, provide secure logins, and analyze our site traffic for digital growth. By continuing, you agree to our <span className="text-primary font-bold">Privacy Policy</span>.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <Button 
              onClick={handleAccept}
              className="rounded-full px-8 h-12 bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              Accept All Cookies
            </Button>
            <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Secure Browsing
            </div>
          </div>

          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

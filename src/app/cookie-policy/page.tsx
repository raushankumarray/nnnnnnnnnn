
"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Cookie, Settings, BarChart, Database } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-widest">
            <Cookie className="w-4 h-4" /> Tracking Preference
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic tracking-tight">Cookie <span className="text-yellow-300">Policy</span></h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">How we use digital identifiers to optimize your experience.</p>
        </div>
      </section>

      <section className="py-20 flex-1">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 space-y-12 border border-slate-100">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <Database className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">Essential Cookies</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                These cookies are strictly necessary for the portal to function, such as maintaining your authentication session and storing your module selections in the cart.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <BarChart className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">Performance Cookies</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                We use analytics cookies to understand how users interact with our software catalog and tech stack pages, allowing us to improve navigation flow and resource loading times.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <Settings className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">Managing Preferences</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                You can configure your browser to block all cookies, but please note that the NPB Media dashboard and marketplace require essential cookies to enable provisioning and profile management.
              </p>
            </div>

            <div className="pt-10 border-t border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">
                Digital Optimization | NPB Media Infrastructure Team
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

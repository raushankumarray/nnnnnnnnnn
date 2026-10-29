
"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Legal Protocol
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic tracking-tight">Privacy <span className="text-yellow-300">Policy</span></h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">Your data security is the foundation of our digital excellence.</p>
        </div>
      </section>

      <section className="py-20 flex-1">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 space-y-12 border border-slate-100">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <Lock className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">1. Information Collection</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                NPB Media collects information necessary to provide our software services, including contact details (name, email, phone) provided during registration or inquiry submission. We also collect technical data such as IP addresses and browser types to optimize our platform's performance.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <Eye className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">2. How We Use Your Data</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Your data is utilized to personalize your professional profile, manage your software module provisioning (Cart), and facilitate communication regarding project updates or hiring processes. We never sell your personal information to third-party marketing entities.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <ShieldCheck className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">3. Data Security</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                We implement AES-256 encryption and secure server protocols to protect your credentials and uploaded documents. Our infrastructure is continuously monitored to prevent unauthorized access or data breaches.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <FileText className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">4. Your Rights</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                You have the right to access, modify, or request the deletion of your personal information at any time via your Profile settings or by contacting our support desk.
              </p>
            </div>

            <div className="pt-10 border-t border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">
                Last Updated: March 2025 | NPB Media Legal Department
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

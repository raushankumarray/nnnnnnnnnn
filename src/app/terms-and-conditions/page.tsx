
"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Scale, CheckCircle2, AlertTriangle, Briefcase } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-widest">
            <Scale className="w-4 h-4" /> Service Agreement
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic tracking-tight">Terms & <span className="text-yellow-300">Conditions</span></h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">The framework for our professional partnership.</p>
        </div>
      </section>

      <section className="py-20 flex-1">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 space-y-12 border border-slate-100">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <Briefcase className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">1. Scope of Service</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                By accessing NPB Media platforms, you agree to use our software modules and professional services for lawful business purposes only. Our services are provided "as-is" with high-availability targets defined in individual Service Level Agreements (SLAs).
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <CheckCircle2 className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">2. User Obligations</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Users are responsible for maintaining the confidentiality of their portal credentials and for all activities that occur under their account. Any misuse of proprietary software modules or attempts to breach our security infrastructure will result in immediate termination of service.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <AlertTriangle className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">3. Intellectual Property</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                All source code, designs, and AI algorithms provided through NPB Media modules are the intellectual property of NPB Media unless explicitly stated otherwise in a custom development contract.
              </p>
            </div>

            <div className="pt-10 border-t border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">
                Effective Date: March 2025 | Begusarai, India
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

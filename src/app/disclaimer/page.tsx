
"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Info, AlertCircle, ShieldAlert, Zap } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-widest">
            <Info className="w-4 h-4" /> Legal Notice
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic tracking-tight">Legal <span className="text-yellow-300">Disclaimer</span></h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">Important notices regarding information accuracy and service limits.</p>
        </div>
      </section>

      <section className="py-20 flex-1">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 space-y-12 border border-slate-100">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <AlertCircle className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">No Warranties</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                The information provided on NPB Media's website is for general informational purposes only. While we strive for absolute accuracy, we make no representations or warranties of any kind, express or implied, about the completeness or reliability of the information contained herein.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <Zap className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">Professional Advice</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Technical documentation and software provisioning suggestions provided on this portal do not constitute professional engineering or legal advice. Users should consult with our tech leads via a scheduled discovery call before implementing large-scale infrastructure changes.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <ShieldAlert className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">Limitation of Liability</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                NPB Media shall not be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, arising from the use of our software modules or reliance on our digital tools.
              </p>
            </div>

            <div className="pt-10 border-t border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">
                Official Disclaimer | NPB Media Global Operations
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RefreshCcw, Banknote, Clock, XCircle } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-widest">
            <Banknote className="w-4 h-4" /> Financial Protocols
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic tracking-tight">Refund <span className="text-yellow-300">Policy</span></h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">Clear guidelines on cancellations and investment protection.</p>
        </div>
      </section>

      <section className="py-20 flex-1">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 space-y-12 border border-slate-100">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <RefreshCcw className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">1. Software Subscriptions</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Purchases of standard Web Hosting Plans or modular software licenses are eligible for a full refund within 7 days of activation, provided the module has not been integrated into a production environment.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <XCircle className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">2. Non-Refundable Items</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Custom software development milestones, once signed off and delivered, are non-refundable due to the bespoke nature of the engineering effort involved. Consulting fees for virtual discovery sessions are also non-refundable.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <Clock className="w-8 h-8" />
                <h2 className="text-3xl font-headline font-black italic">3. Refund Processing</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Approved refunds will be processed via the original payment gateway (Stripe/Razorpay) within 10-15 business days.
              </p>
            </div>

            <div className="pt-10 border-t border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">
                Financial Operations | Begusarai Regional Office
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

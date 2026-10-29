
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Zap, Sparkles } from "lucide-react";

export function Careers() {
  return (
    <section id="careers" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-foreground p-16 md:p-32 rounded-[4rem] text-white flex flex-col lg:flex-row items-center justify-between gap-20 relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 grid-bg opacity-10" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          
          <div className="space-y-10 relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              Join the Team
            </div>
            <h2 className="text-5xl md:text-7xl font-headline font-bold leading-tight">
              Careers at <span className="text-primary italic">NPB Media</span>
            </h2>
            <p className="text-2xl text-white/70 leading-relaxed font-medium">
              We are always looking for talented developers, designers, and innovators to join our growing team. If you are passionate about technology and building impactful products, we would love to hear from you.
            </p>
            <div className="flex flex-wrap items-center gap-8 text-primary font-black uppercase tracking-widest text-sm">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5" />
                <span>Remote First</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5" />
                <span>Modern Stack</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span>Global Culture</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <Button size="lg" className="rounded-full px-16 h-24 text-2xl font-headline bg-white text-foreground hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl group active:scale-95">
              View Open Positions <ArrowRight className="ml-4 w-10 h-10 transition-transform group-hover:translate-x-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

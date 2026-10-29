"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Cpu, Target, Zap } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-10 overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[80%] h-full bg-primary/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] animate-pulse delay-700" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/20 border-2 border-primary/40 text-primary text-sm font-black tracking-widest uppercase shadow-lg shadow-primary/20">
            <Sparkles className="w-4 h-4" />
            NPB Media Lab
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-headline font-black leading-[1] tracking-tighter">
            Architecting the <span className="text-primary italic drop-shadow-sm">Future</span> of <span className="text-gradient">Digital Success</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-xl leading-relaxed font-semibold">
            NPB Media is your dedicated technology partner. We combine engineering precision with vibrant strategy to deliver high-impact software solutions.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/contact">
              <Button size="lg" className="rounded-full px-10 h-16 text-lg font-headline shadow-2xl shadow-primary/30 bg-primary text-white hover:bg-foreground transition-all hover:scale-105 active:scale-95 group border-none">
                Start a Project <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-2" />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg font-headline border-4 border-primary/20 hover:border-primary transition-all duration-300">
                Explore Services
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-secondary/30 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-xl">
                <Cpu className="w-7 h-7" />
              </div>
              <div>
                <p className="font-black text-xl">Innovation</p>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Next-Gen Tech</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-accent/30 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white group-hover:-rotate-12 transition-all duration-500 shadow-xl">
                <Target className="w-7 h-7" />
              </div>
              <div>
                <p className="font-black text-xl">Precision</p>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Reliable Build</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative animate-in fade-in zoom-in duration-1000 delay-300 hidden lg:block">
          <div className="relative p-2 bg-gradient-to-br from-primary via-accent to-secondary rounded-[3rem] shadow-2xl">
            <div className="bg-foreground rounded-[2.8rem] p-12 text-white space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/30 blur-[120px] rounded-full animate-float" />
              
              <div className="space-y-6 relative z-10">
                <h3 className="text-4xl font-headline font-black italic text-primary">Digital Edge</h3>
                <p className="text-slate-300 text-xl leading-relaxed font-medium">
                  We integrate complex business logic with cloud-native infrastructure for unmatched velocity.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-10 pt-4 relative z-10">
                <div className="space-y-2">
                  <span className="text-6xl font-black text-primary drop-shadow-md">NPB</span>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Quality First</p>
                </div>
                <div className="space-y-2">
                  <span className="text-6xl font-black text-secondary drop-shadow-md">Media</span>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Vibrant Design</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/20 flex items-center gap-4 text-base text-slate-300 relative z-10">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center animate-bounce shrink-0">
                  <Zap className="text-secondary w-6 h-6" />
                </div>
                <span className="font-bold">Bridging the gap between vision and enterprise production.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

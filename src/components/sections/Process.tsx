"use client";

import React from "react";
import { 
  Search, 
  Map, 
  PenTool, 
  Code2, 
  ShieldCheck, 
  Rocket, 
  RefreshCw,
  ArrowRight,
  Zap,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    num: "01",
    title: "Discovery & Consultation",
    desc: "Understanding your business goals and technical requirements through deep-dive workshops.",
    icon: Search,
    color: "bg-orange-500",
    hoverBg: "group-hover:bg-orange-600",
    hoverText: "group-hover:text-white",
  },
  {
    num: "02",
    title: "Strategic Planning",
    desc: "Preparing a precise roadmap and scalable architecture for efficient development.",
    icon: Map,
    color: "bg-blue-600",
    hoverBg: "group-hover:bg-blue-700",
    hoverText: "group-hover:text-white",
  },
  {
    num: "03",
    title: "UI/UX Design",
    desc: "Creating visually engaging and user-friendly interfaces that maximize brand impact.",
    icon: PenTool,
    color: "bg-emerald-600",
    hoverBg: "group-hover:bg-emerald-700",
    hoverText: "group-hover:text-white",
  },
  {
    num: "04",
    title: "Development",
    desc: "Our expert developers build secure, scalable, and high-performance systems.",
    icon: Code2,
    color: "bg-indigo-600",
    hoverBg: "group-hover:bg-indigo-700",
    hoverText: "group-hover:text-white",
  },
  {
    num: "05",
    title: "Testing & QA",
    desc: "Ensuring the product meets the highest standards through rigorous automated testing.",
    icon: ShieldCheck,
    color: "bg-purple-600",
    hoverBg: "group-hover:bg-purple-700",
    hoverText: "group-hover:text-white",
  },
  {
    num: "06",
    title: "Deployment",
    desc: "Launching the software smoothly in production with continuous monitoring.",
    icon: Rocket,
    color: "bg-pink-600",
    hoverBg: "group-hover:bg-pink-700",
    hoverText: "group-hover:text-white",
  },
  {
    num: "07",
    title: "Maintenance & Support",
    desc: "Providing ongoing updates, improvements, and round-the-clock technical support to keep your systems running perfectly.",
    icon: RefreshCw,
    color: "bg-primary",
    hoverBg: "group-hover:bg-yellow-400", // Golden
    hoverText: "group-hover:text-black", // Black text on hover
  }
];

export function Process() {
  return (
    <section id="process" className="py-20 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border-2 border-primary/30 text-primary text-sm font-black uppercase tracking-widest shadow-md">
              Our Workflow
            </div>
            <h2 className="text-5xl md:text-7xl font-headline font-black leading-[0.9]">
              The <span className="text-primary italic">Process</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed font-semibold">
              Explore our systematic approach to building resilient digital products.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-xs font-black text-muted-foreground uppercase tracking-widest">
            <span className="flex items-center gap-2 text-orange-500 animate-pulse"><Search className="w-5 h-5" /> Discovery</span>
            <ArrowRight className="w-5 h-5 opacity-30" />
            <span className="flex items-center gap-2 text-blue-600"><Rocket className="w-5 h-5" /> Launch</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className={cn(
                "group relative p-8 rounded-[3.5rem] bg-white border border-border/50 shadow-2xl transition-all duration-700 overflow-hidden flex flex-col min-h-[460px] cursor-default",
                idx % 2 === 0 ? "hover:rotate-1" : "hover:-rotate-1"
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-0",
                step.hoverBg
              )} />
              
              <div className="absolute -top-8 -right-8 text-[10rem] font-black text-slate-100 group-hover:text-black/5 transition-colors duration-700 pointer-events-none select-none z-0">
                {step.num}
              </div>

              <div className="relative z-10 h-full flex flex-col flex-1">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-[360deg] shadow-xl mb-8 text-white",
                  step.color
                )}>
                  <step.icon className="w-8 h-8" />
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={cn("text-xs font-black text-primary/40 transition-colors", step.hoverText)}>STEP {step.num}</span>
                    <div className={cn("h-0.5 flex-1 bg-primary/10 transition-colors", step.num === '07' ? "group-hover:bg-black/20" : "group-hover:bg-white/30")} />
                  </div>
                  
                  <h3 className={cn("text-2xl font-black font-headline leading-tight transition-colors italic", step.hoverText)}>
                    {step.title}
                  </h3>
                  
                  <p className={cn("text-base text-muted-foreground leading-relaxed font-semibold transition-all", step.hoverText)}>
                    {step.desc}
                  </p>
                  
                  {step.num === "07" && (
                    <div className={cn(
                      "mt-4 inline-flex items-center gap-2 py-2 px-4 rounded-xl transition-all animate-pulse border",
                      "bg-primary/10 border-primary/20 text-primary",
                      "group-hover:bg-black/10 group-hover:border-black/20 group-hover:text-black"
                    )}>
                      <Activity className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Active 24/7 Support</span>
                    </div>
                  )}
                </div>

                <div className={cn("mt-6 pt-6 border-t transition-colors flex items-center justify-between", step.num === '07' ? "border-border/50 group-hover:border-black/10" : "border-border/50 group-hover:border-white/20")}>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors", step.hoverText)}>Expert Workflow</span>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:rotate-45", step.num === '07' ? "bg-slate-100 group-hover:bg-black/10" : "bg-slate-100 group-hover:bg-white/20")}>
                    <ArrowRight className={cn("w-4 h-4 text-slate-400 transition-colors", step.hoverText)} />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="xl:col-span-1 p-10 rounded-[3.5rem] bg-gradient-to-br from-primary to-accent text-white flex flex-col justify-center items-center text-center space-y-8 group overflow-hidden relative shadow-2xl min-h-[460px]">
            <div className="absolute inset-0 grid-bg opacity-10" />
            
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl">
                <Zap className="text-white w-8 h-8" />
              </div>
              <h4 className="text-3xl font-black font-headline italic">Ready to Start?</h4>
              <p className="text-white/80 text-lg leading-relaxed font-medium">Let's turn your vision into a scalable digital product.</p>
              <button className="w-full py-5 bg-white text-primary hover:bg-white/90 rounded-[2rem] text-xl font-black transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3">
                Get in Touch <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
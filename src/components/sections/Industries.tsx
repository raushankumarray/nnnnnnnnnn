"use client";

import React from "react";
import { 
  ShoppingBag, 
  Stethoscope, 
  GraduationCap, 
  Wallet, 
  Truck, 
  Home, 
  PlayCircle, 
  Layers,
  Globe,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const industries = [
  { 
    name: "E-Commerce", 
    icon: ShoppingBag, 
    color: "bg-orange-500", 
    hoverColor: "group-hover:bg-orange-600",
    anim: "hover:rotate-3 hover:scale-105",
    border: "border-orange-200"
  },
  { 
    name: "Healthcare", 
    icon: Stethoscope, 
    color: "bg-blue-600", 
    hoverColor: "group-hover:bg-blue-700",
    anim: "hover:-rotate-3 hover:scale-110",
    border: "border-blue-200"
  },
  { 
    name: "Education", 
    icon: GraduationCap, 
    color: "bg-emerald-600", 
    hoverColor: "group-hover:bg-emerald-700",
    anim: "hover:skew-x-2 hover:scale-105",
    border: "border-emerald-200"
  },
  { 
    name: "FinTech", 
    icon: Wallet, 
    color: "bg-indigo-600", 
    hoverColor: "group-hover:bg-indigo-700",
    anim: "hover:-skew-y-2 hover:scale-110",
    border: "border-indigo-200"
  },
  { 
    name: "Logistics", 
    icon: Truck, 
    color: "bg-purple-600", 
    hoverColor: "group-hover:bg-purple-700",
    anim: "hover:translate-y-[-10px]",
    border: "border-purple-200"
  },
  { 
    name: "Real Estate", 
    icon: Home, 
    color: "bg-pink-600", 
    hoverColor: "group-hover:bg-pink-700",
    anim: "hover:rotate-6 hover:scale-105",
    border: "border-pink-200"
  },
  { 
    name: "Media & Entertainment", 
    icon: PlayCircle, 
    color: "bg-red-600", 
    hoverColor: "group-hover:bg-red-700",
    anim: "hover:-rotate-6 hover:scale-110",
    border: "border-red-200"
  },
  { 
    name: "SaaS Platforms", 
    icon: Layers, 
    color: "bg-cyan-600", 
    hoverColor: "group-hover:bg-cyan-700",
    anim: "hover:skew-y-3 hover:scale-105",
    border: "border-cyan-200"
  }
];

export function Industries() {
  return (
    <section id="industries" className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden relative">
      {/* Dynamic colorful background blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[150px] -z-10 animate-pulse delay-1000" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border-2 border-primary text-primary text-sm font-black uppercase tracking-widest shadow-xl">
                <Globe className="w-5 h-5" />
                Sector Expertise
              </div>
              <h2 className="text-5xl md:text-7xl font-headline font-black leading-tight italic">
                Industries We <span className="text-primary drop-shadow-lg">Serve</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl font-semibold">
                NPB Media develops tailored software solutions for diverse global industries with engineering precision and vibrant innovation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-[2rem] shadow-lg border-l-8 border-primary group hover:bg-primary hover:text-white transition-all duration-500">
                <span className="text-4xl font-black italic">10+</span>
                <p className="font-black uppercase tracking-widest text-[10px] opacity-60">Projects Delivered</p>
              </div>
              <div className="p-6 bg-white rounded-[2rem] shadow-lg border-l-8 border-secondary group hover:bg-secondary hover:text-white transition-all duration-500">
                <span className="text-4xl font-black italic">7+</span>
                <p className="font-black uppercase tracking-widest text-[10px] opacity-60">Global Partners</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {industries.map((industry, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "group p-8 bg-white border-2 rounded-[2.5rem] shadow-md transition-all duration-700 relative overflow-hidden",
                  industry.border,
                  industry.anim
                )}
              >
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10",
                  industry.color
                )} />

                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-700 shadow-xl",
                  industry.color
                )}>
                  <industry.icon className="w-6 h-6" />
                </div>
                
                <h3 className="font-black text-xl group-hover:text-white transition-colors font-headline italic">
                  {industry.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-4 text-primary group-hover:text-white transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-widest">Industry Expertise</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
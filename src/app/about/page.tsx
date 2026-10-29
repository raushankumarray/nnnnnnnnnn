"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  Target, 
  Lightbulb, 
  ShieldCheck, 
  Heart, 
  Quote, 
  Sparkles,
  MapPin,
  ArrowRight,
  Zap,
  Globe,
  Users,
  Award,
  BarChart,
  ShieldAlert,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const values = [
  {
    title: "Vibrant Innovation",
    description: "We embrace a colorful, creative approach to solving technical challenges.",
    icon: Lightbulb,
    color: "bg-orange-500",
    shadow: "shadow-orange-500/20"
  },
  {
    title: "Engineering Quality",
    description: "Clean code and robust architecture are the fundamental pillars of our work.",
    icon: ShieldCheck,
    color: "bg-blue-600",
    shadow: "shadow-blue-600/20"
  },
  {
    title: "Rapid Scale",
    description: "We stay ahead of the curve by integrating the latest cloud-native frameworks.",
    icon: Zap,
    color: "bg-emerald-600",
    shadow: "shadow-emerald-600/20"
  },
  {
    title: "Integrity",
    description: "Clear communication and ethical engineering practices guide every NPB project.",
    icon: ShieldAlert,
    color: "bg-purple-600",
    shadow: "shadow-purple-600/20"
  }
];

const milestones = [
  { label: "Projects", value: "10+", icon: Rocket },
  { label: "Stability", value: "100%", icon: Award },
  { label: "Global Sync", value: "Active", icon: Globe },
  { label: "Reliability", value: "High", icon: BarChart },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero Overview Section */}
      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/20 border-2 border-white/30 text-white text-sm font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                The NPB Story
              </div>
              <h1 className="text-6xl md:text-8xl font-headline font-black leading-[0.9] tracking-tighter drop-shadow-2xl">
                Who is <span className="italic text-yellow-300">NPB Media?</span>
              </h1>
              <div className="space-y-6">
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-bold border-l-4 border-yellow-300 pl-6">
                  NPB Media is a unified technical architecture designed to streamline software deployment and enterprise operational management.
                </p>
                <p className="text-lg text-white/80 leading-relaxed max-w-xl font-medium">
                  Founded in Begusarai, we provide the core infrastructure to unify your code, your team, and your digital business modules.
                </p>
              </div>
            </div>

            <div className="relative animate-in fade-in zoom-in duration-1000 delay-300 hidden lg:block">
              <div className="relative p-1 bg-white/20 backdrop-blur-xl rounded-[3rem] border border-white/30 overflow-hidden shadow-2xl">
                <div className="relative z-10 p-12 space-y-8">
                  <div className="w-20 h-20 bg-yellow-300 rounded-2xl flex items-center justify-center rotate-12 shadow-2xl">
                    <Rocket className="text-primary w-10 h-10" />
                  </div>
                  <h3 className="text-4xl font-headline font-black italic">Building Excellence</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Zap className="text-yellow-300 w-5 h-5" />
                      <span className="font-black uppercase tracking-widest text-xs">Node-First Infrastructure</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Globe className="text-yellow-300 w-5 h-5" />
                      <span className="font-black uppercase tracking-widest text-xs">Global Scalability</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones / Stats Section */}
      <section className="py-20 bg-white relative z-10 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((m, i) => (
              <div key={i} className="text-center space-y-2 group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <m.icon className="w-8 h-8" />
                </div>
                <h4 className="text-4xl font-headline font-black text-foreground">{m.value}</h4>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="relative group animate-in fade-in slide-in-from-bottom duration-1000">
                <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl group-hover:bg-primary/20 transition-all" />
                <div className="relative bg-white p-12 rounded-[3rem] border-4 border-primary/20 shadow-2xl">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary/20">
                    <Target className="text-white w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-headline font-black italic mb-6">Our Mission</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed font-semibold">
                    To empower businesses through engineering precision, ensuring your digital products stay resilient in an evolving cloud landscape.
                  </p>
                </div>
              </div>

              <div className="relative group animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
                <div className="absolute -inset-4 bg-secondary/10 rounded-[3rem] blur-2xl group-hover:bg-secondary/20 transition-all" />
                <div className="relative bg-white p-12 rounded-[3rem] border-4 border-secondary/20 shadow-2xl">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-secondary/20">
                    <Zap className="text-foreground w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-headline font-black italic mb-6">Our Vision</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed font-semibold">
                    To become the standard for rapid software provisioning in the region, bridging the gap between vision and enterprise-scale deployment.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
                  <Sparkles className="w-4 h-4" />
                  NPB Core
                </div>
                <h2 className="text-5xl font-headline font-black italic">Core <span className="text-primary">Values</span></h2>
                <p className="text-muted-foreground text-lg font-medium max-w-lg">
                  These principles define the NPB engineering culture and guide our architectural decisions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {values.map((value, idx) => (
                  <div 
                    key={idx} 
                    className="group relative p-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 transition-all duration-500 overflow-hidden flex items-center gap-8 hover:-translate-y-2 hover:shadow-2xl hover:bg-primary"
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-500 group-hover:bg-white group-hover:text-primary shrink-0",
                      value.color,
                      value.shadow
                    )}>
                      <value.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-headline font-black group-hover:text-white transition-colors">{value.title}</h3>
                      <p className="text-muted-foreground font-semibold group-hover:text-white/80 transition-colors">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

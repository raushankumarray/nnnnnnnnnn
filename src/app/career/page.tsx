"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  Target, 
  Users, 
  Zap, 
  Briefcase, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Heart,
  Globe,
  GraduationCap,
  Search,
  CheckCircle2,
  Clock,
  Laptop
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const visionPoints = [
  {
    title: "Empowering Local Talent",
    description: "We believe Begusarai is a hub of untapped potential. Our vision is to provide world-class opportunities right here.",
    icon: Globe,
    color: "bg-orange-500"
  },
  {
    title: "Continuous Learning",
    description: "Technology evolves every day. We invest in your growth through workshops, certifications, and mentorship.",
    icon: GraduationCap,
    color: "bg-blue-600"
  },
  {
    title: "Engineering Excellence",
    description: "We don't just write code; we build resilient systems. Quality is non-negotiable in our internal culture.",
    icon: ShieldCheck,
    color: "bg-emerald-600"
  }
];

const hiringProcess = [
  {
    step: "01",
    title: "Application Review",
    desc: "Our HR and tech leads review your portfolio and experience.",
    icon: Search
  },
  {
    step: "02",
    title: "Technical Round",
    desc: "A deep dive into your coding skills and problem-solving logic.",
    icon: CodeIcon
  },
  {
    step: "03",
    title: "Cultural Fit",
    desc: "A conversation to ensure our values and goals align perfectly.",
    icon: Heart
  },
  {
    step: "04",
    title: "Onboarding",
    desc: "Welcome to the team! We get you set up with everything you need.",
    icon: Rocket
  }
];

const benefits = [
  { title: "Remote Flexibility", icon: Laptop },
  { title: "Health Insurance", icon: ShieldCheck },
  { title: "Skill Development", icon: Zap },
  { title: "Team Retreats", icon: Users },
];

function CodeIcon(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}

export default function CareerPage() {
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
                Join NPB
              </div>
              <h1 className="text-6xl md:text-8xl font-headline font-black leading-[0.9] tracking-tighter drop-shadow-2xl">
                Build the <span className="italic text-yellow-300">Future</span> With Us
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-bold border-l-4 border-yellow-300 pl-6">
                Become part of a dynamic team in Begusarai that is building high-impact software solutions for the global market.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/career/opportunities">
                  <Button size="lg" className="rounded-full px-12 h-20 text-xl font-headline bg-white text-primary hover:bg-foreground hover:text-white transition-all duration-500 shadow-2xl group border-none">
                    View Opportunities <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="p-12 bg-white/10 backdrop-blur-xl rounded-[4rem] border border-white/20 shadow-2xl space-y-8">
                <div className="w-20 h-20 bg-yellow-300 rounded-3xl flex items-center justify-center rotate-12 shadow-2xl">
                  <Briefcase className="text-primary w-10 h-10" />
                </div>
                <h3 className="text-4xl font-headline font-black italic">Why NPB Media?</h3>
                <div className="space-y-6">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center transition-transform group-hover:scale-110">
                        <benefit.icon className="w-5 h-5 text-yellow-300" />
                      </div>
                      <span className="text-lg font-bold">{benefit.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Vision Section */}
      <section className="py-24 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-5xl md:text-7xl font-headline font-black italic">Our <span className="text-primary">Internal Vision</span></h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              We are building a culture where innovation meets empathy, and where every developer is empowered to become a leader.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {visionPoints.map((point, i) => (
              <div key={i} className="group p-10 bg-white rounded-[3rem] border-2 border-slate-100 hover:border-primary transition-all duration-500 space-y-6 shadow-xl">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-500 group-hover:rotate-[360deg]",
                  point.color
                )}>
                  <point.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-headline font-black italic">{point.title}</h3>
                <p className="text-muted-foreground font-semibold leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Process Section */}
      <section className="py-24 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-headline font-black italic">How We <span className="text-primary">Hire</span></h2>
            <p className="text-white/60 text-lg font-medium">A transparent, efficient process designed to find the best talent.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {hiringProcess.map((item, i) => (
              <div key={i} className="relative group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center space-y-6">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary rounded-full flex items-center justify-center font-black text-xl shadow-lg">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-primary group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-headline font-black italic">{item.title}</h4>
                <p className="text-white/70 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-4xl font-headline font-black italic">Our <span className="text-primary">Growth Partners</span></h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-3">
              <Globe className="w-10 h-10 text-blue-600" />
              <span className="text-2xl font-headline font-black italic">Begusarai Tech Hub</span>
            </div>
            <div className="flex items-center gap-3">
              <Target className="w-10 h-10 text-emerald-600" />
              <span className="text-2xl font-headline font-black italic">Strategic NPB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-background relative overflow-hidden border-t">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-headline font-black italic">Ready to <span className="text-primary">Innovate?</span></h2>
          <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto">
            Explore our open positions and take the first step towards a rewarding career at NPB Media.
          </p>
          <Link href="/career/opportunities">
            <Button size="lg" className="rounded-full px-16 h-20 text-xl font-headline bg-primary text-white hover:bg-foreground transition-all duration-500 shadow-2xl group active:scale-95 border-none">
              Explore Opportunities <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
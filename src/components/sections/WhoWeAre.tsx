"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, ShieldCheck, Heart, Lightbulb, Eye, Target, CheckCircle2, Sparkles } from "lucide-react";

const values = [
  {
    title: "Innovation",
    description: "We constantly explore new technologies and creative ideas to build future-ready solutions.",
    icon: Lightbulb,
    color: "text-white",
    bg: "bg-orange-500",
    hoverEffect: "hover:rotate-3 hover:scale-105"
  },
  {
    title: "Quality",
    description: "Every product we develop goes through strict quality assurance to ensure performance and reliability.",
    icon: ShieldCheck,
    color: "text-white",
    bg: "bg-blue-600",
    hoverEffect: "hover:-rotate-3 hover:scale-105"
  },
  {
    title: "Transparency",
    description: "We maintain open communication with clients throughout the entire development process.",
    icon: Eye,
    color: "text-white",
    bg: "bg-emerald-600",
    hoverEffect: "hover:skew-x-2 hover:scale-105"
  },
  {
    title: "Customer Success",
    description: "Our success depends on the success of our clients. We grow together.",
    icon: Heart,
    color: "text-white",
    bg: "bg-pink-600",
    hoverEffect: "hover:-skew-x-2 hover:scale-105"
  }
];

export function WhoWeAre() {
  return (
    <section id="who-we-are" className="py-20 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-secondary" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000 ease-out">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border-2 border-primary/20 text-primary text-sm font-black uppercase tracking-widest shadow-lg">
                <Rocket className="w-5 h-5" />
                Who We Are
              </div>
              <h2 className="text-5xl md:text-6xl font-headline font-black leading-tight">
                Engineering <span className="text-primary italic">Reliability</span>
              </h2>
              <div className="space-y-4">
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  NPB Media is a technology-driven software development company committed to building reliable and high-quality digital products.
                </p>
                <p className="text-lg text-muted-foreground/80 leading-relaxed">
                  Our team of experts work together to create solutions that solve complex challenges. We partner with startups and enterprises to deliver powerful software tailored to their needs.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  "Startups & Small Businesses",
                  "Enterprise Scale Solutions",
                  "Complex Business Logic",
                  "Operational Efficiency"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-default">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
                      <CheckCircle2 className="text-primary group-hover:text-white w-5 h-5" />
                    </div>
                    <span className="font-black text-base text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right duration-1000 ease-out delay-200">
            <Card className="border-none shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[2.5rem] p-6 transition-all hover:translate-x-2 hover:scale-[1.02] group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
              <CardHeader className="flex flex-row items-center gap-6 space-y-0 p-2">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:rotate-12 transition-transform">
                  <Eye className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-headline font-black italic">Our Vision</CardTitle>
                  <p className="text-white/80 text-base mt-2 font-medium">
                    To become a trusted technology partner for businesses worldwide.
                  </p>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-[2.5rem] p-6 transition-all hover:translate-x-2 hover:scale-[1.02] group overflow-hidden relative">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
              <CardHeader className="flex flex-row items-center gap-6 space-y-0 p-2">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:-rotate-12 transition-transform">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-headline font-black italic">Our Mission</CardTitle>
                  <p className="text-white/80 text-base mt-2 font-medium">
                    To deliver innovative software solutions that solve real-world problems.
                  </p>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 ease-out">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-black uppercase tracking-widest mb-2 border border-primary/20 shadow-sm">
              <Sparkles className="w-5 h-5" />
              Excellence Driven
            </div>
            <h2 className="text-4xl md:text-5xl font-headline font-black">Our Core <span className="text-primary italic">Values</span></h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div 
                key={idx} 
                className={`group p-10 ${value.bg} text-white rounded-[3.5rem] shadow-xl transition-all duration-500 ${value.hoverEffect} relative overflow-hidden`}
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                <div className={`w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8 transition-all duration-500 group-hover:rotate-[360deg] shadow-lg`}>
                  <value.icon className={`w-8 h-8 ${value.color}`} />
                </div>
                <h3 className="text-2xl font-black mb-4 font-headline italic">{value.title}</h3>
                <p className="text-white/90 leading-relaxed text-base font-medium">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
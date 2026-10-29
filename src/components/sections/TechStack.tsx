"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Cloud, Cpu, Laptop } from "lucide-react";

const stack = [
  {
    category: "Frontend",
    icon: Laptop,
    color: "text-white",
    bg: "bg-blue-600",
    items: ["HTML5", "CSS3", "JavaScript", "React", "Vue.js", "TypeScript"],
    hover: "hover:rotate-3 hover:scale-105"
  },
  {
    category: "Backend",
    icon: Server,
    color: "text-white",
    bg: "bg-orange-500",
    items: ["Node.js", "Python", "PHP", "Java", "Go"],
    hover: "hover:-rotate-3 hover:scale-105"
  },
  {
    category: "Databases",
    icon: Database,
    color: "text-white",
    bg: "bg-emerald-600",
    items: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase"],
    hover: "hover:skew-x-3 hover:scale-105"
  },
  {
    category: "Cloud Platforms",
    icon: Cloud,
    color: "text-white",
    bg: "bg-purple-600",
    items: ["AWS", "Azure", "Google Cloud", "Vercel"],
    hover: "hover:-skew-x-3 hover:scale-105"
  }
];

export function TechStack() {
  return (
    <section id="tech-stack" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6 animate-in fade-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-secondary/10 border-2 border-secondary/30 text-secondary text-sm font-black uppercase tracking-widest shadow-md">
            <Cpu className="w-5 h-5" />
            Our Stack
          </div>
          <h2 className="text-5xl md:text-6xl font-headline font-black tracking-tighter">
            Modern <span className="text-primary italic">Technologies</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed font-semibold max-w-2xl mx-auto">
            We work with the latest technologies to deliver powerful and scalable solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stack.map((group, idx) => (
            <div 
              key={idx} 
              className={`group p-8 ${group.bg} text-white rounded-[3rem] border-none shadow-xl transition-all duration-500 ${group.hover} relative overflow-hidden`}
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform group-hover:rotate-[360deg] duration-700 shadow-xl`}>
                  <group.icon className={`w-7 h-7 ${group.color}`} />
                </div>
                <h3 className="text-2xl font-black font-headline italic">{group.category}</h3>
              </div>
              
              <div className="flex flex-wrap gap-3 relative z-10">
                {group.items.map((tech, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="px-4 py-2 text-sm font-black rounded-xl border-2 border-white/30 text-white transition-all duration-300 hover:bg-white hover:text-foreground cursor-default shadow-lg"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
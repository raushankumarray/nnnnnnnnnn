"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, 
  Code2, 
  Database, 
  Cloud, 
  Smartphone, 
  Layers, 
  ShieldCheck, 
  Zap,
  Sparkles,
  ArrowRight,
  Monitor,
  Globe,
  Infinity
} from "lucide-react";
import { cn } from "@/lib/utils";

const techStacks = [
  {
    category: "Frontend Excellence",
    description: "Creating immersive, high-performance user interfaces with modern reactive frameworks and optimized rendering engines.",
    icon: Monitor,
    color: "bg-blue-600",
    hoverColor: "group-hover:bg-blue-600",
    shadow: "shadow-blue-500/20",
    hover: "hover:-rotate-3 hover:scale-105",
    items: [
      { name: "React 19", color: "bg-blue-400" },
      { name: "Next.js 15", color: "bg-slate-900" },
      { name: "TypeScript", color: "bg-blue-600" },
      { name: "Tailwind CSS", color: "bg-cyan-500" },
      { name: "Framer Motion", color: "bg-pink-500" }
    ]
  },
  {
    category: "Robust Backend",
    description: "Scalable server-side architectures designed for high concurrency, security, and lightning-fast data processing.",
    icon: ServerIcon, 
    color: "bg-orange-600",
    hoverColor: "group-hover:bg-orange-600",
    shadow: "shadow-orange-600/20",
    hover: "hover:rotate-2 hover:scale-105",
    items: [
      { name: "Node.js", color: "bg-emerald-600" },
      { name: "Go (Golang)", color: "bg-sky-400" },
      { name: "Python", color: "bg-yellow-600" },
      { name: "NestJS", color: "bg-rose-600" },
      { name: "GraphQL", color: "bg-pink-600" }
    ]
  },
  {
    category: "Data Infrastructure",
    description: "Engineered data storage solutions ranging from relational databases to high-speed NoSQL and real-time caches.",
    icon: Database,
    color: "bg-emerald-600",
    hoverColor: "group-hover:bg-emerald-600",
    shadow: "shadow-emerald-600/20",
    hover: "hover:skew-x-2 hover:scale-105",
    items: [
      { name: "PostgreSQL", color: "bg-blue-700" },
      { name: "MongoDB", color: "bg-green-600" },
      { name: "Redis", color: "bg-red-600" },
      { name: "Firestore", color: "bg-amber-500" },
      { name: "Elasticsearch", color: "bg-teal-500" }
    ]
  },
  {
    category: "Cloud & DevOps",
    description: "Automated deployment pipelines and containerized infrastructure ensuring 99.9% uptime and global scalability.",
    icon: Cloud,
    color: "bg-purple-600",
    hoverColor: "group-hover:bg-purple-600",
    shadow: "shadow-purple-600/20",
    hover: "hover:-skew-y-2 hover:scale-105",
    items: [
      { name: "AWS", color: "bg-orange-500" },
      { name: "Google Cloud", color: "bg-blue-500" },
      { name: "Docker", color: "bg-sky-600" },
      { name: "Kubernetes", color: "bg-indigo-600" },
      { name: "Terraform", color: "bg-purple-500" }
    ]
  },
  {
    category: "Mobile Innovation",
    description: "Cross-platform and native mobile applications that deliver smooth performance and native-feel interactions.",
    icon: Smartphone,
    color: "bg-rose-600",
    hoverColor: "group-hover:bg-rose-600",
    shadow: "shadow-rose-600/20",
    hover: "hover:rotate-3 hover:translate-y-[-10px]",
    items: [
      { name: "React Native", color: "bg-sky-500" },
      { name: "Flutter", color: "bg-blue-400" },
      { name: "Swift (iOS)", color: "bg-orange-600" },
      { name: "Kotlin", color: "bg-purple-600" },
      { name: "Expo", color: "bg-slate-900" }
    ]
  }
];

function ServerIcon(props: any) {
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
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2"/>
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2"/>
      <line x1="6" x2="6.01" y1="6" y2="6"/>
      <line x1="6" x2="6.01" y1="18" y2="18"/>
    </svg>
  );
}

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] animate-pulse delay-700" />
      </div>

      {/* Hero Overview Section - Changed to Vibrant Gradient */}
      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/20 border-2 border-white/30 text-white text-sm font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
                <Cpu className="w-5 h-5 text-yellow-300" />
                Technical Stack
              </div>
              <h1 className="text-6xl md:text-8xl font-headline font-black leading-[0.9] tracking-tighter drop-shadow-2xl">
                The Engine of <span className="italic text-yellow-300">Innovation</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-xl font-bold border-l-4 border-yellow-300 pl-6">
                We master the architectures that power the next generation of digital excellence, ensuring your product is built on a rock-solid foundation.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="rounded-full px-10 h-16 text-lg font-headline bg-white text-primary hover:bg-foreground hover:text-white transition-all duration-500 shadow-2xl group border-none">
                  View Our GitHub <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                </Button>
                <div className="flex items-center gap-4 px-6 border-l border-white/20">
                  <div className="text-center">
                    <p className="text-3xl font-black text-yellow-300">20+</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Partners</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">100%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Reliable</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in zoom-in duration-1000 delay-300 hidden lg:block">
              <div className="relative p-1 bg-white/20 backdrop-blur-xl rounded-[3rem] border border-white/30 overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                <div className="relative z-10 p-12 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Zap className="text-yellow-300 w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="border-white/50 text-white px-4 py-1 font-black">ACTIVE R&D</Badge>
                  </div>
                  <h3 className="text-3xl font-headline font-black italic">Cutting-Edge Lab</h3>
                  <p className="text-white/80 text-lg leading-relaxed font-semibold">
                    Mastering serverless edge computing and real-time distributed systems for global scalability.
                  </p>
                  <div className="pt-6 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-sm">
                      <Globe className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Global CDN</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-sm">
                      <Infinity className="w-6 h-6 mx-auto mb-2 text-white" />
                      <p className="text-[10px] font-black uppercase tracking-widest">CI/CD Flow</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Grid Section - Enhanced Card Hover & UI/UX */}
      <section className="py-24 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {techStacks.map((stack, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "group relative p-10 bg-white rounded-[3rem] shadow-2xl transition-all duration-700 overflow-hidden flex flex-col border border-slate-100",
                  "hover:shadow-primary/20",
                  stack.hover
                )}
              >
                {/* Dynamic Hover Background Fill */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none -z-0",
                  stack.color
                )} />

                <div className="relative z-10 space-y-8 flex-1">
                  <div className={cn(
                    "w-20 h-20 rounded-[2rem] flex items-center justify-center text-white transition-all duration-700 group-hover:rotate-[360deg] shadow-xl group-hover:bg-white group-hover:text-foreground",
                    stack.color,
                    stack.shadow
                  )}>
                    <stack.icon className="w-10 h-10" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-headline font-black italic group-hover:text-white transition-colors duration-500">
                      {stack.category}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-semibold group-hover:text-white/90 transition-colors duration-500">
                      {stack.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    {stack.items.map((tech, tIdx) => (
                      <Badge 
                        key={tIdx} 
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white border-none shadow-md transition-all",
                          "group-hover:bg-white/20 group-hover:text-white group-hover:backdrop-blur-md",
                          tech.color
                        )}
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-8 mt-8 border-t border-slate-100 group-hover:border-white/20 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white/70 transition-colors">Expert Proficiency</span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                    <Zap className="w-5 h-5 text-slate-300 group-hover:text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Stack CTA */}
      <section className="py-24 relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white text-primary text-xs font-black uppercase tracking-widest shadow-2xl">
            <Layers className="w-4 h-4" />
            Stack Agnostic
          </div>
          <h2 className="text-5xl md:text-8xl font-headline font-black leading-tight italic drop-shadow-2xl">
            Built for <span className="text-white">Performance.</span> <br />
            Designed for <span className="text-yellow-300 italic">Scale.</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto font-bold">
            Our technology choices are driven by project goals, not trends. We select best-in-class tools to ensure your product remains competitive and maintainable.
          </p>
          <div className="pt-6">
            <Button size="lg" className="rounded-full px-16 h-20 text-xl font-headline bg-white text-primary hover:bg-foreground hover:text-white transition-all duration-500 shadow-2xl group active:scale-95 border-none">
              Request Stack Audit <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
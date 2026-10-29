"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Code2, 
  Globe, 
  Smartphone, 
  Building2, 
  Cloud, 
  Network, 
  BarChart3, 
  Palette,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  ShieldCheck,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const detailedServices = [
  {
    title: "Custom Software Development",
    description: "We build high-performance bespoke software solutions tailored to your specific business logic. Our engineers focus on creating clean, maintainable codebases that scale seamlessly.",
    details: "Our approach involves a deep dive into your business workflows to automate complex manual processes. We specialize in building inventory management, high-volume transaction systems, and proprietary business tools that provide a competitive edge.",
    icon: Code2,
    features: ["Bespoke Architecture", "Legacy Modernization", "Full-stack Engineering", "Agile Methodology"],
    color: "bg-orange-500",
    hover: "hover:-rotate-2 hover:scale-105",
    shadow: "shadow-orange-500/20"
  },
  {
    title: "Web Application Development",
    description: "Modern, responsive, and lightning-fast web platforms built with React and Next.js. We ensure your web presence is not just a site, but a powerful business engine.",
    details: "From enterprise-grade SaaS dashboards to high-traffic e-commerce portals, we deliver SEO-optimized, accessible, and performant web experiences. We prioritize core web vitals to ensure top-tier user engagement and search rankings.",
    icon: Globe,
    features: ["SaaS Dashboards", "E-commerce Platforms", "Progressive Web Apps", "Headless CMS"],
    color: "bg-blue-600",
    hover: "hover:rotate-2 hover:scale-105",
    shadow: "shadow-blue-600/20"
  },
  {
    title: "Mobile Application Development",
    description: "Native-quality mobile experiences for iOS and Android. We create apps that users love, focusing on intuitive navigation and high performance.",
    details: "Utilizing cross-platform frameworks like React Native or Flutter, we deliver feature-rich apps including real-time notifications, offline capabilities, and seamless hardware integrations (GPS, Camera, Biometrics).",
    icon: Smartphone,
    features: ["iOS & Android", "Real-time Sync", "Offline Access", "Smooth Animations"],
    color: "bg-emerald-600",
    hover: "hover:skew-x-1 hover:scale-105",
    shadow: "shadow-emerald-600/20"
  },
  {
    title: "Enterprise Solutions",
    description: "Streamlining large-scale operations with robust ERP, CRM, and internal management tools. We help organizations modernize their digital infrastructure.",
    details: "We focus on data governance and workflow automation to eliminate bottlenecks in large organizations. Our solutions integrate with existing legacy systems while providing modern, user-friendly interfaces for your employees.",
    icon: Building2,
    features: ["ERP Systems", "CRM Customization", "Workflow Automation", "Data Governance"],
    color: "bg-indigo-600",
    hover: "hover:-skew-y-1 hover:scale-105",
    shadow: "shadow-indigo-600/20"
  },
  {
    title: "Cloud & DevOps Services",
    description: "Scalable, secure, and cost-effective cloud infrastructure using AWS, Azure, and Google Cloud. We automate your deployment pipelines for speed and reliability.",
    details: "Our DevOps experts implement CI/CD pipelines, containerization with Docker and Kubernetes, and serverless architectures to minimize overhead and maximize uptime. We ensure your data is backed up and your systems are resilient.",
    icon: Cloud,
    features: ["Cloud Migration", "Kubernetes", "Serverless", "CI/CD Pipelines"],
    color: "bg-purple-600",
    hover: "hover:rotate-3 hover:scale-105",
    shadow: "shadow-purple-600/20"
  },
  {
    title: "API Development & Integration",
    description: "Connecting your digital ecosystem with secure and scalable APIs. We build bridges between your software and the third-party tools you rely on.",
    details: "We design RESTful and GraphQL APIs that are well-documented and secure. Whether it's integrating payment gateways, CRM syncing, or building a microservices architecture, we ensure data flows smoothly across your platform.",
    icon: Network,
    features: ["REST/GraphQL", "Microservices", "Payment Gateways", "SaaS Syncing"],
    color: "bg-pink-600",
    hover: "hover:-rotate-3 hover:scale-105",
    shadow: "shadow-pink-600/20"
  },
  {
    title: "UI/UX Experience Design",
    description: "User-centric design that balances aesthetics with functionality. We create interfaces that are beautiful, intuitive, and conversion-focused.",
    details: "Great software starts with understanding the user. We perform user research, wireframing, and high-fidelity prototyping to ensure the final product is both stunning and easy to navigate, reducing friction and increasing satisfaction.",
    icon: Palette,
    features: ["User Research", "Prototyping", "Visual Systems", "Interactive UI"],
    color: "bg-rose-600",
    hover: "hover:rotate-1 hover:-translate-y-2",
    shadow: "shadow-rose-600/20"
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Overview Section */}
      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/20 border-2 border-white/30 text-white text-sm font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Service Excellence
            </div>
            <h1 className="text-5xl md:text-8xl font-headline font-black leading-[0.9] tracking-tighter drop-shadow-2xl">
              Solutions for the <span className="italic text-yellow-300">Modern Digital</span> <span className="text-white/90">Enterprise</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl font-semibold italic border-l-4 border-yellow-300 pl-6">
              We combine engineering precision with creative strategy to build digital products that drive real growth and operational efficiency.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-3 text-white/80 font-black uppercase tracking-widest text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Secure Systems
              </div>
              <div className="flex items-center gap-3 text-white/80 font-black uppercase tracking-widest text-xs">
                <Rocket className="w-5 h-5 text-blue-400" /> Rapid Deployment
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedServices.map((service, idx) => (
              <Card 
                key={idx} 
                className={cn(
                  "group border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden transition-all duration-700 flex flex-col min-h-[500px]",
                  service.hover
                )}
              >
                {/* Header Icon Section */}
                <div className={cn(
                  "h-48 flex flex-col items-center justify-center text-white relative transition-all duration-700 group-hover:h-32",
                  service.color
                )}>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <service.icon className="w-20 h-20 mb-2 transition-all duration-700 group-hover:scale-75 group-hover:rotate-12 relative z-10" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 relative z-10">Service {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                </div>
                
                {/* Content Section */}
                <CardContent className="flex-1 p-10 flex flex-col justify-between">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-headline font-black italic transition-colors group-hover:text-primary">
                      {service.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed font-semibold">
                      {service.description}
                    </p>

                    {/* Hidden Detail Expand on Hover */}
                    <div className="max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-700 ease-in-out overflow-hidden">
                      <p className="text-sm text-muted-foreground/80 border-t pt-4 border-muted">
                        {service.details}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {service.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-muted-foreground/10 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-muted mt-8 flex items-center justify-between">
                    <Link href="/contact">
                      <Button variant="ghost" className="p-0 h-auto font-black text-xs uppercase tracking-widest hover:bg-transparent hover:text-primary transition-colors group/btn">
                        Request Consultation <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:btn:translate-x-2" />
                      </Button>
                    </Link>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all group-hover:rotate-[360deg] duration-700">
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -z-10" />
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-12">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white text-primary text-xs font-black uppercase tracking-widest shadow-2xl">
            <Zap className="w-4 h-4" />
            Empower Your Business
          </div>
          <h2 className="text-5xl md:text-8xl font-headline font-black leading-tight italic drop-shadow-2xl">
            Let's build your <span className="text-primary">Next Digital</span> <span className="text-white">Success.</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto font-medium">
            Ready to scale? Our technical experts are standing by to help you define your roadmap and deliver high-impact results.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <Link href="/contact">
              <Button size="lg" className="rounded-full px-16 h-20 text-xl font-headline bg-primary text-white hover:bg-white hover:text-primary transition-all duration-500 shadow-2xl group active:scale-95">
                Contact Our Experts <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full px-16 h-20 text-xl font-headline border-4 border-white/20 text-white hover:bg-white/10 transition-all duration-500">
              Download Credentials
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
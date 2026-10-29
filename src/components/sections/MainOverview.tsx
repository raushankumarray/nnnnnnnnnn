"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Activity, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const UPTIME_PROJECTS = [
  { name: "MediaPay Gateway", uptime: "99.99%", status: "online" },
  { name: "CloudScale ERP", uptime: "100%", status: "online" },
  { name: "SafeSync Vault", uptime: "99.98%", status: "maintenance" },
];

export function MainOverview() {
  return (
    <section id="npb-overview" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen Infrastructure
              </div>
              <h2 className="text-5xl lg:text-6xl font-headline font-black leading-tight tracking-tighter">
                Empowering the <span className="text-primary italic">Digital Ecosystem</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl font-semibold">
                NPB Media provides an integrated overview of your digital assets, leveraging advanced analytical tools to monitor uptime, optimize performance, and secure your future.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/services">
                <Button size="lg" className="rounded-full px-8 h-14 text-base font-headline bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 group border-none">
                  Know More <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/technology">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-headline border-2 border-primary/20 hover:border-primary transition-all">
                  Explore Tech
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
              <div className="space-y-1">
                <p className="text-3xl font-black text-foreground">24/7</p>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Active Monitoring</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-primary">99.9%</p>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">System Reliability</p>
              </div>
              <div className="space-y-1 hidden sm:block">
                <p className="text-3xl font-black text-accent">Real-time</p>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Decision Matrix</p>
              </div>
            </div>
          </div>

          {/* Visual Interactive Side */}
          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200">
            {/* Main Project Dashboard Card */}
            <Card className="bg-white/40 backdrop-blur-xl border-white/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-white/10 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-headline flex items-center gap-2 font-black italic">
                    <Activity className="text-primary w-5 h-5" />
                    Live Infrastructure
                  </CardTitle>
                  <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Global Status Report</p>
                </div>
                <Badge variant="outline" className="animate-pulse bg-emerald-50 text-emerald-600 border-emerald-200 font-black">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                  All Systems Operational
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/10">
                  {UPTIME_PROJECTS.map((project, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-white/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6 shadow-sm",
                          project.status === 'online' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        )}>
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-sm">{project.name}</p>
                          <p className="text-[10px] uppercase font-black text-muted-foreground/60">{project.status}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-headline font-black text-lg">{project.uptime}</p>
                        <div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: project.uptime }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feature Teaser */}
                <div className="p-8 bg-foreground text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-headline font-black text-lg italic">NPB Media Lab</h4>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Optimization Engine</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-primary" />
                      <p className="text-sm font-black uppercase tracking-widest text-slate-200">Predictive Maintenance</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-secondary" />
                      <p className="text-sm font-black uppercase tracking-widest text-slate-200">Auto-Scaling Security</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Accents */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-3xl blur-2xl -z-10 animate-float" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10 animate-float delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import React from "react";
import Link from "next/link";
import { 
  Twitter, 
  Linkedin, 
  Github, 
  ShieldCheck, 
  Globe, 
  Mail,
  Phone,
  ChevronRight,
  Scale
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white pt-24 pb-12 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0 grid-bg opacity-5" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <Logo className="transition-transform group-hover:scale-110 duration-500" />
              <span className="font-headline font-black text-3xl tracking-tight">
                <span className="text-white">NPB </span>
                <span className="text-primary italic">Media</span>
              </span>
            </Link>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              NPB Media is a technology-driven software development company committed to building reliable and high-quality digital products.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, idx) => (
                <Link 
                  key={idx} 
                  href="#" 
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Ecosystem Column */}
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Ecosystem</h4>
            <ul className="space-y-4">
              {["Services", "Technology", "Products", "Career"].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(" ", "-")}`} 
                    className="text-slate-400 hover:text-white transition-all flex items-center gap-2 group font-black uppercase text-xs tracking-widest"
                  >
                    <ChevronRight className="w-3 h-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <Scale className="w-4 h-4" /> Legal
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "T & C", href: "/terms-and-conditions" },
                { name: "Disclaimer", href: "/disclaimer" },
                { name: "Refund Policy", href: "/refund-policy" },
                { name: "Cookie Policy", href: "/cookie-policy" }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-slate-400 hover:text-white transition-all flex items-center gap-2 group font-black uppercase text-xs tracking-widest"
                  >
                    <ChevronRight className="w-3 h-3 text-primary opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Connect</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary shrink-0 border border-white/10">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-500">Inquiry</p>
                  <p className="text-sm font-bold">support@npbmedia.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary shrink-0 border border-white/10">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-500">Call Us</p>
                  <p className="text-sm font-bold">+91 8877300114</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
              © {currentYear} NPB Media. All rights reserved.
            </p>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> Regional Node</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Encrypted Protocol</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  Video, 
  Send, 
  MessageSquare, 
  Sparkles, 
  Clock,
  CalendarDays,
  ShieldCheck,
  Zap,
  Globe,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    title: "Email Us",
    value: "support@npbmedia.com",
    href: "mailto:support@npbmedia.com",
    description: "Our support team will get back to you within 24 hours.",
    icon: Mail,
    color: "bg-orange-500",
    shadow: "shadow-orange-500/20"
  },
  {
    title: "Call Us",
    value: "+91 00000 00000",
    href: "tel:+910000000000",
    description: "Mon-Fri from 10am to 6pm IST.",
    icon: Phone,
    color: "bg-blue-600",
    shadow: "shadow-blue-600/20"
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.message) {
      toast({ 
        variant: "destructive", 
        title: "Required Fields", 
        description: "Please fill in your name, email, and message." 
      });
      return;
    }

    setIsSubmitting(true);

    if (!db) {
      // Prototype Mode: Simulate success
      setTimeout(() => {
        setIsSubmitting(false);
        setFormData({ fullName: "", email: "", phone: "", subject: "", message: "" });
        toast({ 
          title: "Inquiry Logged (Simulated)", 
          description: "This is a prototype. In production, your message would be transmitted via Firestore node." 
        });
      }, 800);
      return;
    }
    
    addDocumentNonBlocking(collection(db, "inquiries"), {
      ...formData,
      status: "new",
      createdAt: new Date().toISOString()
    }).then(() => {
      setIsSubmitting(false);
      setFormData({ fullName: "", email: "", phone: "", subject: "", message: "" });
      toast({ 
        title: "Inquiry Sent Successfully", 
        description: "Thank you for reaching out. Our team will contact you shortly." 
      });
    }).catch(err => {
      console.error("Error submitting inquiry:", err);
      setIsSubmitting(false);
      toast({ variant: "destructive", title: "Transmission Failed", description: "Could not send inquiry. Please try again." });
    });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero Overview Section */}
      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/20 border-2 border-white/30 text-white text-sm font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Get In Touch
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-black leading-[0.9] tracking-tighter drop-shadow-2xl">
              Let's Start a <span className="italic text-yellow-300">Conversation</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-bold border-l-4 border-yellow-300 pl-6">
              Have a project in mind or just want to say hello? Our technical experts are ready to listen and help you scale your digital vision.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Content */}
      <section className="py-24 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Side: Contact Info */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl font-headline font-black italic">Contact <span className="text-primary">Information</span></h2>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                  We're here to help you navigate your digital transformation. Reach out through any of these channels.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, idx) => (
                  <a 
                    key={idx}
                    href={info.href}
                    className="group relative p-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 transition-all duration-500 overflow-hidden flex items-center gap-8 hover:-translate-y-2 hover:shadow-2xl hover:bg-primary cursor-pointer block"
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-500 group-hover:bg-white group-hover:text-primary shrink-0",
                      info.color,
                      info.shadow
                    )}>
                      <info.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-white/60 transition-colors">{info.title}</h4>
                      <p className="text-xl font-headline font-black group-hover:text-white transition-colors">{info.value}</p>
                      <p className="text-sm text-muted-foreground font-medium group-hover:text-white/80 transition-colors">{info.description}</p>
                    </div>
                  </a>
                ))}

                {/* Virtual Meeting Page Link */}
                <Link href="/contact/schedule-meeting" className="block">
                  <div className="group relative p-8 bg-white rounded-[2.5rem] shadow-xl border-2 border-emerald-100 bg-emerald-50/30 transition-all duration-500 overflow-hidden flex items-center gap-8 hover:-translate-y-2 hover:shadow-2xl hover:bg-emerald-600 cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-white group-hover:text-emerald-600 shrink-0 shadow-lg shadow-emerald-600/20">
                      <Video className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-white/60 transition-colors">Virtual Consultation</h4>
                      <p className="text-xl font-headline font-black group-hover:text-white transition-colors">Schedule Virtual Meeting</p>
                      <p className="text-sm text-muted-foreground font-medium group-hover:text-white/80 transition-colors">Book a 30-min discovery call with our tech leads.</p>
                    </div>
                    <CalendarDays className="absolute right-8 text-emerald-500 w-10 h-10 opacity-20 group-hover:opacity-100 group-hover:text-white transition-all group-hover:rotate-12" />
                  </div>
                </Link>
              </div>

              {/* Business Hours Section */}
              <div className="p-10 rounded-[3rem] bg-foreground text-white space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 grid-bg opacity-10" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <Clock className="text-primary w-6 h-6" />
                    <h4 className="text-xl font-headline font-black italic">Operating Hours</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="font-bold text-slate-300">Monday - Friday</span> 
                      <span className="font-black text-primary">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2">
                        <Zap className="text-yellow-300 w-5 h-5" />
                        <span className="font-bold">Support 24*7</span>
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-400">All Day Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="lg:col-span-7">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-2">
                <div className="p-10 md:p-16 space-y-10">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                      <MessageSquare className="w-4 h-4" />
                      Send an Inquiry
                    </div>
                    <h3 className="text-3xl font-headline font-black italic">Tell Us About Your <span className="text-primary">Next Big Idea</span></h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                        <Input 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter Name" 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium px-6"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                        <Input 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          type="email" 
                          placeholder="Enter Email" 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium px-6"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Phone No.</label>
                        <Input 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          type="tel" 
                          placeholder="Enter Phone No." 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium px-6"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Subject</label>
                        <Input 
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Enter Subject" 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium px-6"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Your Message</label>
                      <Textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your project requirements..." 
                        className="min-h-[200px] rounded-3xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium p-6 resize-none"
                        required
                      />
                    </div>

                    <Button 
                      disabled={isSubmitting}
                      className="w-full h-20 rounded-[2rem] text-xl font-headline bg-primary text-white hover:bg-foreground transition-all duration-500 shadow-2xl group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {isSubmitting ? (
                          <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
                        ) : (
                          <>Send Message <Send className="w-6 h-6 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" /></>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-20 transition-opacity" />
                    </Button>
                  </form>

                  <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      <ShieldCheck className="text-emerald-500 w-4 h-4" /> Secure Form
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      <Zap className="text-emerald-500 w-4 h-4" /> 24/7 Monitoring
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      <Globe className="text-emerald-500 w-4 h-4" /> Privacy Protected
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12 relative z-10">
          <h2 className="text-4xl md:text-6xl font-headline font-black text-white italic">Trusted by <span className="text-primary">Global Leaders</span></h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-3 text-white">
              <Globe className="w-10 h-10" />
              <span className="text-2xl font-headline font-black italic"> Begusarai Tech</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Zap className="w-10 h-10" />
              <span className="text-2xl font-headline font-black italic"> RapidScale</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Sparkles className="w-10 h-10" />
              <span className="text-2xl font-headline font-black italic"> InnovateX</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

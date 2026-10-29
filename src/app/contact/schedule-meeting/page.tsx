
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { 
  CalendarDays, 
  Clock, 
  ArrowLeft, 
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const timeSlots = [
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "12:00 PM - 12:30 PM",
  "02:00 PM - 02:30 PM",
  "02:30 PM - 03:00 PM",
  "03:00 PM - 03:30 PM",
  "03:30 PM - 04:00 PM",
  "04:00 PM - 04:30 PM",
  "04:30 PM - 05:00 PM",
  "05:00 PM - 05:30 PM",
  "05:30 PM - 06:00 PM"
];

export default function ScheduleMeetingPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    timeSlot: "",
    subject: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, timeSlot: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.date || !formData.timeSlot) {
      toast({ 
        variant: "destructive", 
        title: "Required Information", 
        description: "Please complete all mandatory fields to schedule your call." 
      });
      return;
    }

    setIsSubmitting(true);

    if (!db) {
      // Prototype Mode: Simulate success
      setTimeout(() => {
        setIsSubmitting(false);
        setFormData({ fullName: "", email: "", phone: "", date: "", timeSlot: "", subject: "" });
        toast({ 
          title: "Request Received (Simulated)", 
          description: "This is a prototype. In a live environment, your session would be logged in Firestore." 
        });
      }, 800);
      return;
    }
    
    addDocumentNonBlocking(collection(db, "meetings"), {
      ...formData,
      status: "new",
      meetingLink: "",
      createdAt: new Date().toISOString()
    }).then(() => {
      setIsSubmitting(false);
      setFormData({ fullName: "", email: "", phone: "", date: "", timeSlot: "", subject: "" });
      toast({ 
        title: "Request Received", 
        description: "Your session request has been logged. A tech lead will confirm shortly." 
      });
    }).catch(err => {
      console.error("Error scheduling meeting:", err);
      setIsSubmitting(false);
      toast({ variant: "destructive", title: "Error", description: "Could not schedule consultation. Please try again." });
    });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Back to Contact
            </Link>
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/20 border-2 border-white/30 text-white text-sm font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
              <CalendarDays className="w-5 h-5 text-yellow-300" />
              Book a Consultation
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-black leading-[0.9] tracking-tighter drop-shadow-2xl">
              Reserve Your <span className="italic text-yellow-300">Time Slot</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-bold border-l-4 border-yellow-300 pl-6">
              Schedule a 30-minute discovery call with our expert team to discuss your project requirements and technical roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-24 bg-background relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] bg-white overflow-hidden p-2">
            <div className="p-10 md:p-16 space-y-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest border border-emerald-100">
                  <Clock className="w-4 h-4" />
                  30-Minute Discovery Session
                </div>
                <h2 className="text-3xl font-headline font-black italic">Select Your <span className="text-emerald-600">Preferences</span></h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                    <Input 
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter Name" 
                      className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-600 focus:bg-white transition-all text-lg font-medium px-6"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Work Email</label>
                    <Input 
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email" 
                      placeholder="Enter Email" 
                      className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-600 focus:bg-white transition-all text-lg font-medium px-6"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Phone No.</label>
                    <Input 
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      type="tel" 
                      placeholder="Enter Phone No." 
                      className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-600 focus:bg-white transition-all text-lg font-medium px-6"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Schedule Date</label>
                    <Input 
                      required
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      type="date" 
                      className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-600 focus:bg-white transition-all text-lg font-medium px-6"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Available Time Slot</label>
                    <Select required value={formData.timeSlot} onValueChange={handleSelectChange}>
                      <SelectTrigger className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:ring-emerald-600 text-lg font-medium px-6">
                        <SelectValue placeholder="Choose Time Slot" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot} className="py-4 rounded-xl text-base font-medium">
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Subject</label>
                    <Input 
                      required
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter Subject" 
                      className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-600 focus:bg-white transition-all text-lg font-medium px-6"
                    />
                  </div>
                </div>

                <Button 
                  disabled={isSubmitting}
                  className="w-full h-20 rounded-[2rem] text-xl font-headline bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-500 shadow-2xl shadow-emerald-600/20 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isSubmitting ? (
                      <><Loader2 className="w-6 h-6 animate-spin" /> Requesting...</>
                    ) : (
                      <>Request Schedule <CalendarDays className="w-6 h-6 transition-transform group-hover:scale-110" /></>
                    )}
                  </span>
                </Button>
              </form>

              <div className="pt-10 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-tight">Secure <br />Booking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-tight">Instant <br />Confirmation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-tight">Expert <br />Architects</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}

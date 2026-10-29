"use client";

import React from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { 
  Zap, 
  TrendingUp, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Calendar,
  ArrowRight, 
  ShieldAlert,
  Loader2,
  Users
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const db = useFirestore();

  // Fetch Meetings for Stats
  const meetingsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "meetings");
  }, [db]);
  const { data: meetings, isLoading: isMeetingsLoading } = useCollection(meetingsQuery);

  // Fetch Enquiries for Stats
  const inquiriesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "inquiries");
  }, [db]);
  const { data: enquiries, isLoading: isInquiriesLoading } = useCollection(inquiriesQuery);

  if (isMeetingsLoading || isInquiriesLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const meetingStats = {
    new: meetings?.filter(m => !m.status || m.status === 'new').length || 0,
    progress: meetings?.filter(m => m.status === 'progress').length || 0,
    discussion: meetings?.filter(m => m.status === 'discussion').length || 0,
    finalized: meetings?.filter(m => m.status === 'completed' || m.status === 'canceled').length || 0,
  };

  const enquiryStats = {
    total: enquiries?.length || 0,
    new: enquiries?.filter(e => !e.status || e.status === 'new').length || 0,
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-headline font-black italic text-white uppercase tracking-tighter">
            System <span className="text-primary">Overview</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Operational Readiness Terminal</p>
        </div>
        
        <div className="px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Node: Online</span>
        </div>
      </div>

      {/* Meeting Pipeline Stats */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Consultation Pipeline</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "New Meetings", value: meetingStats.new, icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "In Progress", value: meetingStats.progress, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Discussion", value: meetingStats.discussion, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Finalized", value: meetingStats.finalized, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-primary transition-all duration-500">
              <CardContent className="p-8 flex items-center gap-6">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                  <h4 className="text-4xl font-headline font-black text-white">{stat.value}</h4>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enquiry & Other Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 border-2 rounded-[3rem] overflow-hidden group">
          <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <h3 className="text-3xl font-headline font-black italic text-white uppercase tracking-tighter">Lead <span className="text-primary">Generation</span></h3>
                <p className="text-slate-400 text-sm font-medium">Monitoring incoming business inquiries and digital transformation requests.</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-8">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Leads</p>
                  <p className="text-3xl font-headline font-black text-white">{enquiryStats.total}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Pending Actions</p>
                  <p className="text-3xl font-headline font-black text-primary">{enquiryStats.new}</p>
                </div>
              </div>
              <Link href="/admin/enquiries" className="inline-block">
                <Button className="rounded-full px-8 bg-primary hover:bg-white hover:text-black transition-all font-black uppercase text-[10px] tracking-widest h-12">
                  Launch Enquiry Command <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="w-40 h-40 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform duration-700">
              <MessageSquare className="w-20 h-20 text-primary opacity-40" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 border-2 rounded-[3rem] overflow-hidden p-10 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-headline font-black italic text-white uppercase tracking-tighter">Talent <span className="text-blue-500">Sync</span></h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">Manage your career ecosystem and applicant pipeline transitions.</p>
          </div>
          <Link href="/admin/careers">
            <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900 font-black uppercase text-[10px] tracking-widest">
              Career Registry <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </Card>
      </div>

      <div className="pt-10 flex justify-center border-t border-slate-800/50">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">NPB Media Infrastructure v4.5.0 | Secure Protocol Established</p>
      </div>
    </div>
  );
}
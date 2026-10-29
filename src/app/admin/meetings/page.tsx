
"use client";

import React, { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { 
  Loader2, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Trash2, 
  Video, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  TrendingUp,
  Zap,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function AdminMeetingsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});

  const meetingsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "meetings"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: meetings, isLoading } = useCollection(meetingsQuery);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    if (!db) return;
    const meetingRef = doc(db, "meetings", id);
    updateDocumentNonBlocking(meetingRef, { status: newStatus });
    
    toast({
      title: "Protocol Updated",
      description: `Meeting status transitioned to ${newStatus.toUpperCase()}.`
    });
  };

  const handleUpdateLink = (id: string) => {
    if (!db) return;
    const link = linkInputs[id];
    if (!link) {
      toast({ variant: "destructive", title: "Input Required", description: "Please enter a valid meeting URL." });
      return;
    }
    const meetingRef = doc(db, "meetings", id);
    updateDocumentNonBlocking(meetingRef, { meetingLink: link });
    toast({ title: "Gateway Link Set", description: "Virtual meeting link has been provisioned." });
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    const meetingRef = doc(db, "meetings", id);
    deleteDocumentNonBlocking(meetingRef);
    toast({
      variant: "destructive",
      title: "Record Purged",
      description: "Meeting data removed from central repository."
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const stats = {
    new: meetings?.filter(m => !m.status || m.status === 'new').length || 0,
    progress: meetings?.filter(m => m.status === 'progress').length || 0,
    discussion: meetings?.filter(m => m.status === 'discussion').length || 0,
    finalized: meetings?.filter(m => m.status === 'completed' || m.status === 'canceled').length || 0,
    total: meetings?.length || 0
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-headline font-black italic text-white uppercase tracking-tighter">
            Consultation <span className="text-primary">Registry</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Operational Meeting Schedule Module</p>
        </div>
        <div className="px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway Monitor Active</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] hover:border-orange-500 transition-all duration-500 group">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">New Meeting</p>
              <h4 className="text-4xl font-headline font-black text-white">{stats.new}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] hover:border-blue-500 transition-all duration-500 group">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">In Progress</p>
              <h4 className="text-4xl font-headline font-black text-white">{stats.progress}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] hover:border-purple-500 transition-all duration-500 group">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Discussion</p>
              <h4 className="text-4xl font-headline font-black text-white">{stats.discussion}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] hover:border-emerald-500 transition-all duration-500 group">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Completed</p>
              <h4 className="text-4xl font-headline font-black text-white">{stats.finalized}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main List */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Database Feed ({stats.total})</h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {meetings && meetings.length > 0 ? (
            meetings.map((meeting) => (
              <Card key={meeting.id} className="bg-slate-900/50 border-slate-800/50 rounded-[3rem] overflow-hidden group hover:bg-slate-900 transition-all duration-500">
                <CardContent className="p-8 md:p-10">
                  <div className="flex flex-col lg:flex-row justify-between gap-10">
                    {/* Info */}
                    <div className="flex-1 space-y-8">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-slate-700">
                          <User className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="text-3xl font-headline font-black italic text-white">{meeting.fullName}</h4>
                            <Badge className={cn(
                              "text-[8px] font-black uppercase tracking-widest border-none px-3 py-1",
                              (!meeting.status || meeting.status === 'new') ? "bg-orange-500" :
                              meeting.status === 'progress' ? "bg-blue-600" :
                              meeting.status === 'discussion' ? "bg-purple-600" :
                              meeting.status === 'completed' ? "bg-emerald-600" : "bg-red-600"
                            )}>
                              {meeting.status || 'new'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-6 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                            <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> {meeting.email}</div>
                            <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> {meeting.phone}</div>
                            <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> {meeting.date}</div>
                            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> {meeting.timeSlot}</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50 relative overflow-hidden group/box">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/box:opacity-10 transition-opacity">
                          <ShieldCheck className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Topic: {meeting.subject || 'General Consultation'}</p>
                        <p className="text-slate-300 text-lg font-medium leading-relaxed italic">Submitted at: {new Date(meeting.createdAt).toLocaleString()}</p>
                      </div>

                      {/* Link Section */}
                      {(meeting.status === 'progress' || meeting.status === 'discussion') && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-500">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Provision Meeting Link</label>
                          <div className="flex gap-3">
                            <div className="relative flex-1">
                              <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                              <Input 
                                value={linkInputs[meeting.id] || meeting.meetingLink || ""}
                                onChange={(e) => setLinkInputs({...linkInputs, [meeting.id]: e.target.value})}
                                placeholder="Paste Google Meet / Zoom URL" 
                                className="h-14 rounded-2xl border-slate-800 bg-slate-950 text-white pl-12 focus:border-primary"
                              />
                            </div>
                            <Button 
                              onClick={() => handleUpdateLink(meeting.id)}
                              className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
                            >
                              Sync Link
                            </Button>
                          </div>
                          {meeting.meetingLink && (
                            <a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest">
                              <ExternalLink className="w-3.5 h-3.5" /> Test Provisioned Gateway
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-3 shrink-0 justify-end lg:justify-start lg:w-64">
                      {(!meeting.status || meeting.status === 'new') && (
                        <Button 
                          onClick={() => handleUpdateStatus(meeting.id, 'progress')}
                          variant="outline" 
                          className="h-12 rounded-2xl border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all px-6 justify-between group/btn"
                        >
                          Mark Progress <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      )}

                      {(meeting.status === 'progress') && (
                        <Button 
                          onClick={() => handleUpdateStatus(meeting.id, 'discussion')}
                          variant="outline" 
                          className="h-12 rounded-2xl border-purple-500/20 bg-purple-500/5 text-purple-400 hover:bg-purple-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all px-6 justify-between group/btn"
                        >
                          Start Discussion <MessageSquare className="w-3.5 h-3.5" />
                        </Button>
                      )}

                      {(meeting.status !== 'completed' && meeting.status !== 'canceled') && (
                        <>
                          <Button 
                            onClick={() => handleUpdateStatus(meeting.id, 'completed')}
                            variant="outline" 
                            className="h-12 rounded-2xl border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all px-6 justify-between"
                          >
                            Mark Completed <CheckCircle2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            onClick={() => handleUpdateStatus(meeting.id, 'canceled')}
                            variant="outline" 
                            className="h-12 rounded-2xl border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all px-6 justify-between"
                          >
                            Cancel Session <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}

                      <Button 
                        onClick={() => handleDelete(meeting.id)}
                        variant="outline" 
                        className="h-12 rounded-2xl border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive hover:text-white text-[10px] font-black uppercase tracking-widest transition-all px-6 justify-between mt-auto"
                      >
                        Purge Record <Trash2 className="w-3.5 h-3.5" />
                      </Button>

                      <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 text-center">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Session ID</p>
                        <p className="text-[10px] font-mono text-slate-400">#M-{meeting.id.slice(0, 6).toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-32 space-y-6 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-slate-800">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Search className="w-10 h-10 text-slate-700" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-headline font-black italic text-slate-600 uppercase tracking-tighter">Gateway Empty</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">No incoming session requests detected</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

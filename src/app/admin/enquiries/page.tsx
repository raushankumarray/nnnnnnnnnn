
"use client";

import React from "react";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { 
  Loader2, 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  Calendar,
  Search,
  Trash2,
  Zap,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function AdminEnquiriesPage() {
  const db = useFirestore();
  const { toast } = useToast();

  const enquiriesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: enquiries, isLoading } = useCollection(enquiriesQuery);

  const handleUpdateStatus = (id: string, newStatus: 'pending' | 'solved') => {
    if (!db) return;
    const enquiryRef = doc(db, "inquiries", id);
    updateDocumentNonBlocking(enquiryRef, { status: newStatus });
    
    const label = newStatus === 'pending' ? 'IN PROGRESS' : 'SOLVED';
    toast({
      title: "Registry Updated",
      description: `Enquiry status transitioned to ${label}.`
    });
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    const enquiryRef = doc(db, "inquiries", id);
    deleteDocumentNonBlocking(enquiryRef);
    toast({
      variant: "destructive",
      title: "Record Purged",
      description: "Data removed from central repository."
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
    new: enquiries?.filter(e => !e.status || e.status === 'new').length || 0,
    pending: enquiries?.filter(e => e.status === 'pending').length || 0,
    solved: enquiries?.filter(e => e.status === 'solved').length || 0,
    total: enquiries?.length || 0
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-headline font-black italic text-white uppercase tracking-tighter">
            Enquiry <span className="text-primary">Command</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Operational Lead Monitoring Module</p>
        </div>
        
        <div className="px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Stream Active</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-primary transition-all duration-500">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">New Enquiries</p>
              <h4 className="text-4xl font-headline font-black text-white">{stats.new}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-blue-500 transition-all duration-500">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">In Progress</p>
              <h4 className="text-4xl font-headline font-black text-white">{stats.pending}</h4>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500 transition-all duration-500">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Solved Leads</p>
              <h4 className="text-4xl font-headline font-black text-white">{stats.solved}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main List */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Database Feed ({stats.total})</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {enquiries && enquiries.length > 0 ? (
            enquiries.map((enquiry) => (
              <Card key={enquiry.id} className="bg-slate-900/50 border-slate-800/50 rounded-[3rem] overflow-hidden group hover:bg-slate-900 transition-all duration-500 p-1">
                <div className="bg-slate-900/80 rounded-[2.9rem] p-8">
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    {/* Left: Info */}
                    <div className="space-y-6 flex-1">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <Search className="w-7 h-7" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <h4 className="text-2xl font-headline font-black italic text-white">{enquiry.fullName}</h4>
                            <Badge className={cn(
                              "text-[8px] font-black uppercase tracking-widest border-none px-3 py-1",
                              (!enquiry.status || enquiry.status === 'new') ? "bg-primary text-white" :
                              enquiry.status === 'pending' ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                            )}>
                              {enquiry.status === 'solved' ? 'solved' : (enquiry.status || 'new')}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-5 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                            <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> {enquiry.email}</div>
                            <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> {enquiry.phone || 'N/A'}</div>
                            <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> {new Date(enquiry.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <MessageSquare className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Subject: {enquiry.subject || 'General Inquiry'}</p>
                        <p className="text-slate-300 text-base leading-relaxed font-medium">"{enquiry.message}"</p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-row lg:flex-col gap-3 shrink-0 justify-end lg:justify-start">
                      {(!enquiry.status || enquiry.status === 'new') && (
                        <Button 
                          onClick={() => handleUpdateStatus(enquiry.id, 'pending')}
                          variant="outline" 
                          className="h-12 rounded-2xl border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all px-6"
                        >
                          <Clock className="w-4 h-4 mr-2" /> Mark Pending
                        </Button>
                      )}
                      
                      {(enquiry.status !== 'solved') && (
                        <Button 
                          onClick={() => handleUpdateStatus(enquiry.id, 'solved')}
                          variant="outline" 
                          className="h-12 rounded-2xl border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all px-6"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Solved
                        </Button>
                      )}

                      <Button 
                        onClick={() => handleDelete(enquiry.id)}
                        variant="outline" 
                        className="h-12 rounded-2xl border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive hover:text-white text-[10px] font-black uppercase tracking-widest transition-all px-6"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Purge Record
                      </Button>

                      <div className="mt-auto p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 text-center">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Lead Ref</p>
                        <p className="text-[10px] font-mono text-slate-400">#E-{enquiry.id.slice(0, 6).toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-32 space-y-6 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-slate-800">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Clock className="w-10 h-10 text-slate-700" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-headline font-black italic text-slate-600 uppercase tracking-tighter">Stream Empty</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Waiting for incoming infrastructure requests</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

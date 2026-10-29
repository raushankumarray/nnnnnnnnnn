
"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useFirestore, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  ArrowLeft, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Video,
  Zap,
  Layout,
  Briefcase,
  Trash2,
  Users,
  MapPin,
  CreditCard,
  ImageIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STATUS_PIPELINE = [
  { value: "applied", label: "Applied", color: "bg-blue-600" },
  { value: "review", label: "In Review", color: "bg-purple-600" },
  { value: "shortlisting", label: "Shortlisting", color: "bg-indigo-600" },
  { value: "scheduled_test", label: "Scheduled Test", color: "bg-orange-500" },
  { value: "scheduled_interview", label: "Scheduled Interview", color: "bg-cyan-600" },
  { value: "decision", label: "Decision Phase", color: "bg-pink-600" },
  { value: "document_verification", label: "Doc Verification", color: "bg-amber-600" },
  { value: "selected", label: "Selected", color: "bg-emerald-600" },
  { value: "onboarding", label: "Onboarding", color: "bg-teal-600" }
];

export default function AdminJobApplicationsPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const db = useFirestore();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [hiringForm, setHiringContext] = useState<any>({});

  // Fetch job details
  const jobRef = useMemoFirebase(() => jobId ? doc(db, "careers", jobId) : null, [db, jobId]);
  const { data: job } = useDoc(jobRef);

  // Fetch applications
  const appsQuery = useMemoFirebase(() => {
    if (!db || !jobId) return null;
    return query(collection(db, "jobApplications"), where("jobId", "==", jobId));
  }, [db, jobId]);
  const { data: applications, isLoading } = useCollection(appsQuery);

  const filteredApps = useMemo(() => {
    if (!applications) return [];
    return applications.filter(app => {
      const matchesSearch = 
        app.applicantSnapshot?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantSnapshot?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const handleUpdateStatus = (app: any) => {
    setSelectedApp(app);
    setHiringContext(app.hiringContext || { decision: "pending" });
    setIsUpdateModalOpen(true);
  };

  const handleDeleteApplication = (id: string) => {
    if (!db) return;
    if (confirm("Are you sure you want to permanently purge this candidate application record?")) {
      deleteDocumentNonBlocking(doc(db, "jobApplications", id));
      toast({ 
        variant: "destructive", 
        title: "Record Purged", 
        description: "Application has been removed from the hiring stream." 
      });
    }
  };

  const saveHiringUpdate = (newStatus: string) => {
    if (!db || !selectedApp) return;
    const appRef = doc(db, "jobApplications", selectedApp.id);
    
    updateDocumentNonBlocking(appRef, {
      status: newStatus,
      hiringContext: hiringForm
    });

    toast({ title: "Pipeline Updated", description: `Candidate moved to ${newStatus.toUpperCase()}.` });
    setIsUpdateModalOpen(false);
  };

  const viewDocument = (url: string) => {
    if (!url) {
      toast({ variant: "destructive", title: "Document Missing", description: "This file was not provided by the candidate." });
      return;
    }
    // Handle data URI viewing
    try {
      if (url.startsWith('data:')) {
        const parts = url.split(';');
        const mimeType = parts[0].split(':')[1];
        const base64Data = parts[1].split(',')[1];
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } else {
        window.open(url, '_blank');
      }
    } catch (e) {
      console.error("Failed to parse data URL:", e);
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="space-y-6">
        <Link href="/admin/careers" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Career Inventory
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
          <div className="space-y-2">
            <h2 className="text-4xl font-headline font-black italic text-white uppercase tracking-tighter">
              Application <span className="text-primary">Stream</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Hiring Dashboard: <span className="text-slate-300">{job?.title || 'Unknown Role'}</span></p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search Candidate" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-12 bg-slate-900 border-slate-800 rounded-xl pl-12 text-[10px] font-black uppercase tracking-widest text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 w-48 bg-slate-900 border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-800 text-white rounded-xl">
                <SelectItem value="all" className="text-[10px] font-black uppercase py-3">All Applicants</SelectItem>
                {STATUS_PIPELINE.map(s => (
                  <SelectItem key={s.value} value={s.value} className="text-[10px] font-black uppercase py-3">{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <Card key={app.id} className="bg-slate-900/50 border-slate-800/50 rounded-[3rem] overflow-hidden group hover:bg-slate-900 transition-all duration-500 p-1 border-2">
              <div className="bg-slate-900/80 rounded-[2.9rem] p-8">
                <div className="flex flex-col lg:flex-row justify-between gap-10">
                  <div className="flex-1 flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-slate-700 overflow-hidden shrink-0 relative group/avatar">
                      {app.applicantSnapshot?.photoURL ? (
                        <img src={app.applicantSnapshot.photoURL} alt="Applicant" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-slate-600 m-auto absolute inset-0" />
                      )}
                      <Button 
                        size="icon" 
                        onClick={() => viewDocument(app.applicantSnapshot?.photoURL)}
                        className="absolute bottom-2 right-2 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                      >
                        <ImageIcon className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="space-y-1">
                          <h4 className="text-3xl font-headline font-black italic text-white leading-none">{app.applicantSnapshot?.fullName}</h4>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span>S/o: {app.applicantSnapshot?.fathersName || 'N/A'}</span>
                            <span className="text-primary">|</span>
                            <span>DOB: {app.applicantSnapshot?.dob || 'N/A'}</span>
                          </div>
                        </div>
                        <Badge className={cn(
                          "text-[8px] font-black uppercase tracking-widest border-none px-3 py-1",
                          STATUS_PIPELINE.find(s => s.value === app.status)?.color || "bg-slate-600"
                        )}>
                          {STATUS_PIPELINE.find(s => s.value === app.status)?.label || app.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> {app.applicantSnapshot?.email}</div>
                        <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> {app.applicantSnapshot?.mobile}</div>
                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> Applied: {new Date(app.appliedAt).toLocaleDateString()}</div>
                      </div>

                      <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 space-y-4">
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Candidate Location
                          </p>
                          <p className="text-slate-400 text-xs font-medium leading-relaxed italic">{app.applicantSnapshot?.address || 'Address not logged'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Intent Summary</p>
                          <p className="text-slate-300 text-xs font-medium leading-relaxed italic line-clamp-2">"{app.experience}"</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-3 shrink-0 justify-end lg:w-72">
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button 
                        onClick={() => viewDocument(app.applicantSnapshot?.resumeURL)}
                        variant="outline" 
                        className="h-12 rounded-xl border-slate-800 bg-slate-950 text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all px-4 justify-between"
                      >
                        Resume <FileText className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        onClick={() => viewDocument(app.applicantSnapshot?.idCardURL)}
                        variant="outline" 
                        className="h-12 rounded-xl border-slate-800 bg-slate-950 text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all px-4 justify-between"
                      >
                        {app.applicantSnapshot?.idCardType?.split(' ')[0] || 'ID Proof'} <CreditCard className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={() => handleUpdateStatus(app)}
                      className="h-12 rounded-2xl bg-primary text-white hover:scale-105 text-[9px] font-black uppercase tracking-widest transition-all px-6 w-full justify-between shadow-xl shadow-primary/10"
                    >
                      Update Pipeline <Zap className="w-4 h-4" />
                    </Button>

                    <Button 
                      onClick={() => handleDeleteApplication(app.id)}
                      variant="outline"
                      className="h-12 rounded-2xl border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive hover:text-white text-[9px] font-black uppercase tracking-widest transition-all px-6 w-full justify-between"
                    >
                      Purge Application <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="mt-auto p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 text-center">
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Applicant Ref</p>
                      <p className="text-[9px] font-mono text-slate-400">#A-{app.id.split('_')[0].slice(0, 6).toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-32 space-y-6 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-slate-800">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <Layout className="w-10 h-10 text-slate-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-black italic text-slate-600 uppercase tracking-tighter">Stream Empty</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">No candidates matching this criteria detected</p>
            </div>
          </div>
        )}
      </div>

      {/* Update Pipeline Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-2xl bg-slate-950 border-slate-800 text-white rounded-[3rem] p-0 overflow-hidden">
          <div className="bg-slate-900 p-8 border-b border-slate-800">
            <DialogTitle className="text-3xl font-headline font-black italic uppercase tracking-tighter">
              Hiring <span className="text-primary">Protocol</span>
            </DialogTitle>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Pipeline Progression Gateway</p>
          </div>

          <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Progress to Stage</Label>
              <div className="grid grid-cols-2 gap-3">
                {STATUS_PIPELINE.map((s) => (
                  <Button 
                    key={s.value}
                    variant={selectedApp?.status === s.value ? "default" : "outline"}
                    onClick={() => saveHiringUpdate(s.value)}
                    className={cn(
                      "h-14 rounded-2xl text-[9px] font-black uppercase tracking-widest border-slate-800 transition-all justify-start px-6",
                      selectedApp?.status === s.value ? "bg-primary text-white border-none" : "hover:bg-slate-900 text-slate-400"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full mr-3 animate-pulse", s.color)} />
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Stage-Specific Context Inputs */}
            {(selectedApp?.status === 'scheduled_test' || selectedApp?.status === 'scheduled_interview') && (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="h-px bg-slate-800" />
                <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Provisioning Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Gateway Link (Meet/Test URL)</Label>
                    <div className="relative">
                      <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        value={selectedApp?.status === 'scheduled_test' ? (hiringForm.testLink || "") : (hiringForm.interviewLink || "")}
                        onChange={e => setHiringContext({...hiringForm, [selectedApp?.status === 'scheduled_test' ? 'testLink' : 'interviewLink']: e.target.value})}
                        className="h-14 rounded-2xl bg-slate-900 border-slate-800 pl-12 focus:border-primary"
                        placeholder="Paste URL"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Date & Timing</Label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input 
                        value={selectedApp?.status === 'scheduled_test' ? (hiringForm.testDate || "") : (hiringForm.interviewDate || "")}
                        onChange={e => setHiringContext({...hiringForm, [selectedApp?.status === 'scheduled_test' ? 'testDate' : 'interviewDate']: e.target.value})}
                        className="h-14 rounded-2xl bg-slate-900 border-slate-800 pl-12 focus:border-primary"
                        placeholder="e.g. 25th March, 4:00 PM"
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={() => saveHiringUpdate(selectedApp.status)} className="w-full h-14 bg-primary rounded-2xl font-black uppercase text-[10px] tracking-widest">Update Schedule Gateway</Button>
              </div>
            )}

            {selectedApp?.status === 'decision' && (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="h-px bg-slate-800" />
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Final Verdict</Label>
                <div className="flex gap-4">
                  <Button 
                    onClick={() => { setHiringContext({...hiringForm, decision: 'qualified'}); saveHiringUpdate('decision'); }}
                    className={cn(
                      "flex-1 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2",
                      hiringForm.decision === 'qualified' ? "bg-emerald-600 border-none" : "bg-slate-900 border-emerald-900/30 text-emerald-500"
                    )}
                  >
                    <CheckCircle2 className="w-5 h-5" /> Mark Qualified
                  </Button>
                  <Button 
                    onClick={() => { setHiringContext({...hiringForm, decision: 'failed'}); saveHiringUpdate('decision'); }}
                    className={cn(
                      "flex-1 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2",
                      hiringForm.decision === 'failed' ? "bg-rose-600 border-none" : "bg-slate-900 border-rose-900/30 text-rose-500"
                    )}
                  >
                    <XCircle className="w-5 h-5" /> Mark Failed
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-8 bg-slate-900 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsUpdateModalOpen(false)} className="rounded-full text-[10px] font-black uppercase tracking-widest">Exit Controller</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

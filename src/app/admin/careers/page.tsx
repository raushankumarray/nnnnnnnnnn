
"use client";

import React, { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, orderBy } from "firebase/firestore";
import { 
  Plus, 
  Briefcase, 
  MapPin, 
  History, 
  Trash2, 
  Edit3, 
  Users, 
  Loader2,
  Calendar,
  DollarSign,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Search,
  Zap,
  Layout,
  ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminCareersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    experience: "",
    technologies: "",
    education: "",
    batchPassout: "",
    lastDate: "",
    category: "Engineering",
    type: "Full Time",
    status: "active"
  });

  const careersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "careers"), orderBy("title", "asc"));
  }, [db]);

  const { data: jobs, isLoading } = useCollection(careersQuery);

  // Applications count query
  const appsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "jobApplications");
  }, [db]);
  const { data: allApplications } = useCollection(appsQuery);

  const getAppCount = (jobId: string) => {
    return allApplications?.filter(app => app.jobId === jobId).length || 0;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      requirements: "",
      salary: "",
      location: "",
      experience: "",
      technologies: "",
      education: "",
      batchPassout: "",
      lastDate: "",
      category: "Engineering",
      type: "Full Time",
      status: "active"
    });
    setEditingJob(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    if (editingJob) {
      updateDocumentNonBlocking(doc(db, "careers", editingJob.id), formData);
      toast({ title: "Registry Updated", description: "Job details synchronized successfully." });
    } else {
      addDocumentNonBlocking(collection(db, "careers"), {
        ...formData,
        id: `JOB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: new Date().toISOString()
      });
      toast({ title: "Portal Live", description: "New career opportunity has been published." });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      salary: job.salary,
      location: job.location,
      experience: job.experience,
      technologies: job.technologies,
      education: job.education,
      batchPassout: job.batchPassout,
      lastDate: job.lastDate,
      category: job.category,
      type: job.type,
      status: job.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, "careers", id));
    toast({ variant: "destructive", title: "Record Purged", description: "Job listing removed from ecosystem." });
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-headline font-black italic text-white uppercase tracking-tighter">
            Career <span className="text-primary">Ecosystem</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Operational Talent Pipeline Module</p>
        </div>
        
        <Button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/10"
        >
          <Plus className="w-4 h-4 mr-2" /> Initialize Job Opening
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} className="bg-slate-900/50 border-slate-800/50 rounded-[3rem] overflow-hidden group hover:bg-slate-900 transition-all duration-500 border-2">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <Badge className={cn(
                    "text-[8px] font-black uppercase tracking-widest border-none px-3 py-1",
                    job.status === 'active' ? "bg-emerald-600" : "bg-slate-600"
                  )}>
                    {job.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-black italic text-white leading-tight">{job.title}</h3>
                  <div className="flex items-center gap-4 text-slate-500 font-bold text-[9px] uppercase tracking-widest">
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> {job.location}</div>
                    <div className="flex items-center gap-1"><History className="w-3 h-3 text-primary" /> {job.experience}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Applications</p>
                    <p className="text-xl font-headline font-black text-white">{getAppCount(job.id)}</p>
                  </div>
                  <Link href={`/admin/careers/${job.id}/applications`}>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary">
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEdit(job)}
                      className="rounded-xl border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(job.id)}
                      className="rounded-xl border-slate-800 bg-slate-900 text-slate-400 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[8px] font-mono text-slate-600">ID: {job.id}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-32 space-y-6 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-slate-800">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <Zap className="w-10 h-10 text-slate-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-black italic text-slate-600 uppercase tracking-tighter">Inventory Matrix Null</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Awaiting first job opening initialization</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl bg-slate-950 border-slate-800 text-white rounded-[3rem] p-0 overflow-hidden">
          <div className="bg-slate-900 p-8 border-b border-slate-800">
            <DialogTitle className="text-3xl font-headline font-black italic uppercase tracking-tighter">
              {editingJob ? "Synchronize" : "Initialize"} <span className="text-primary">Opening</span>
            </DialogTitle>
            <DialogDescription className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Resource Matrix Allocation Protocol</DialogDescription>
          </div>
          
          <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Job Title</Label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary px-6" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Category</Label>
                <Input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary px-6" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Experience Required</Label>
                <Input required value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary px-6" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Salary Package</Label>
                <Input value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary px-6" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Location</Label>
                <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary px-6" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Last Date to Apply</Label>
                <Input type="date" value={formData.lastDate} onChange={e => setFormData({...formData, lastDate: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary px-6" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Batch Passout (e.g. 2024, 2025)</Label>
                <Input value={formData.batchPassout} onChange={e => setFormData({...formData, batchPassout: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary px-6" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Required Education</Label>
                <Input value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary px-6" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Technologies (Comma separated)</Label>
              <Input value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary px-6" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Job Description</Label>
              <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-[150px] rounded-2xl border-slate-800 bg-slate-900 focus:border-primary p-6 resize-none" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Key Requirements</Label>
              <Textarea value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="min-h-[150px] rounded-2xl border-slate-800 bg-slate-900 focus:border-primary p-6 resize-none" />
            </div>
          </form>

          <DialogFooter className="p-8 bg-slate-900 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-full text-[10px] font-black uppercase tracking-widest">Abort</Button>
            <Button onClick={handleSubmit} className="h-14 px-10 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
              {editingJob ? "Synchronize Changes" : "Confirm Initialization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

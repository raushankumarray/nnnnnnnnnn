
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  ArrowUpRight,
  Zap,
  CheckCircle2,
  Lock,
  Loader2,
  History,
  GraduationCap,
  User,
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  FileText,
  DollarSign,
  Search,
  Sparkles,
  Users,
  ImageIcon,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useUser, useMemoFirebase, useDoc } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function OpportunitiesPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  // Dialog State
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [experience, setExperience] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch live career listings
  const careersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "careers");
  }, [db]);
  const { data: allCareers, isLoading: isCareersLoading } = useCollection(careersQuery);

  // Fetch user profile for data sync
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);
  const { data: userProfile } = useDoc(profileRef);

  // Fetch user's applications to track "Applied" state
  const applicationsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "jobApplications"), where("userId", "==", user.uid));
  }, [db, user]);
  const { data: userApplications } = useCollection(applicationsQuery);

  const appliedJobIds = userApplications?.map(app => app.jobId) || [];

  if (isCareersLoading || isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleApplyClick = (job: any) => {
    if (!user) {
      toast({ title: "Auth Required", description: "Please sign in to apply for roles." });
      router.push("/login");
      return;
    }

    if (!userProfile?.fullName || !userProfile?.resumeURL || !userProfile?.idCardURL) {
      toast({ 
        variant: "destructive", 
        title: "Profile Incomplete", 
        description: "Please complete your professional profile including resume, photo, and ID Proof before applying." 
      });
      router.push("/profile/edit");
      return;
    }

    setSelectedJob(job);
    setIsAppModalOpen(true);
  };

  const submitApplication = () => {
    if (!experience.trim()) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide a brief professional summary." });
      return;
    }

    setIsSubmitting(true);
    const appId = `${user!.uid}_${selectedJob.id}`;
    
    // Complete Snapshot includes ALL profile details and documents
    setDocumentNonBlocking(doc(db, "jobApplications", appId), {
      id: appId,
      userId: user!.uid,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      experience: experience,
      status: "applied",
      appliedAt: new Date().toISOString(),
      applicantSnapshot: {
        fullName: userProfile?.fullName || user?.displayName || "Applicant",
        fathersName: userProfile?.fathersName || "Not Provided",
        email: userProfile?.email || user?.email,
        mobile: userProfile?.mobile || "Not Provided",
        dob: userProfile?.dob || "Not Provided",
        photoURL: userProfile?.photoURL || "",
        resumeURL: userProfile?.resumeURL || "",
        idCardURL: userProfile?.idCardURL || "",
        idCardType: userProfile?.idCardType || "Identity Proof",
        address: userProfile?.fullAddress || "Not Provided",
        education: userProfile?.education || [],
        experienceYears: userProfile?.experience || "N/A"
      },
      hiringContext: {
        decision: "pending"
      }
    }, { merge: true });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsAppModalOpen(false);
      setExperience("");
      toast({ title: "Application Sent!", description: "Your global profile has been forwarded to the hiring team." });
    }, 800);
  };

  const activeRoles = allCareers?.filter(r => r.status === "active" && !appliedJobIds.includes(r.id)) || [];
  const closedRoles = allCareers?.filter(r => r.status === "closed") || [];
  const userAppliedRoles = allCareers?.filter(r => appliedJobIds.includes(r.id)) || [];

  const RoleCard = ({ role, isApplied = false, isClosed = false }: { role: any, isApplied?: boolean, isClosed?: boolean }) => (
    <Card className="group border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden hover:-translate-y-2 transition-all duration-500">
      <CardContent className="p-8 md:p-10 flex flex-col h-full space-y-6">
        <div className="flex justify-between items-start">
          <div className={cn(
            "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-700 group-hover:rotate-[360deg] shadow-xl",
            isClosed ? "bg-slate-300" : "bg-primary"
          )}>
            {isClosed ? <Lock className="w-7 h-7" /> : <Briefcase className="w-7 h-7" />}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="px-3 py-1 rounded-full border-2 border-slate-100 font-black uppercase text-[10px] tracking-widest text-muted-foreground">
              {role.type || 'Full Time'}
            </Badge>
            <Badge className={cn(
              "px-3 py-1 rounded-full text-white border-none font-black uppercase text-[10px] tracking-widest",
              isClosed ? "bg-slate-400" : "bg-secondary"
            )}>
              {role.category || 'Engineering'}
            </Badge>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <h3 className={cn(
            "text-2xl md:text-3xl font-headline font-black italic transition-colors",
            isClosed ? "text-slate-400" : "group-hover:text-primary"
          )}>
            {role.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-bold text-xs">
            <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> {role.location}</div>
            <div className="flex items-center gap-1.5"><History className="w-3.5 h-3.5 text-primary" /> {role.experience} Exp.</div>
            <div className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-primary" /> {role.education}</div>
            <div className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-primary" /> {role.salary || 'Competitive'}</div>
          </div>

          <p className="text-muted-foreground leading-relaxed font-semibold text-sm line-clamp-3">
            {role.description}
          </p>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Batch Passout</p>
            <Badge variant="secondary" className="rounded-lg bg-slate-50 text-slate-600 font-black uppercase text-[9px] tracking-widest border border-slate-100">
              {role.batchPassout || 'Any'}
            </Badge>
          </div>

          {role.technologies && (
            <div className="flex flex-wrap gap-2 pt-2">
              {role.technologies.split(',').map((tech: string, i: number) => (
                <Badge key={i} variant="secondary" className="bg-primary/5 text-primary font-black uppercase text-[8px] tracking-widest border border-primary/10">
                  {tech.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          {isApplied ? (
            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[10px]">
              <CheckCircle2 className="w-4 h-4" />
              Application Submitted
            </div>
          ) : isClosed ? (
            <div className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
              Applications Closed
            </div>
          ) : (
            <Button 
              onClick={() => handleApplyClick(role)}
              className="w-full rounded-full h-12 text-xs font-black uppercase tracking-widest text-white border-none group/btn shadow-lg bg-primary"
            >
              Express Interest <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
            <Link href="/career" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 group">
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Back to Careers
            </Link>
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/20 border-2 border-white/30 text-white text-sm font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Join the Tech Lab
            </div>
            <h1 className="text-5xl md:text-8xl font-headline font-black leading-[0.9] tracking-tighter drop-shadow-2xl">
              Career <span className="italic text-yellow-300">Hub</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-bold border-l-4 border-yellow-300 pl-6">
              Your professional journey within the global digital ecosystem starts here. Explore tailored roles and track your application status in real-time.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs defaultValue="active" className="space-y-8 md:space-y-12">
            <div className="flex justify-center">
              <TabsList className="bg-slate-100 p-1.5 h-auto rounded-full border-2 border-slate-200 w-full grid grid-cols-3 max-w-xl mx-auto overflow-hidden shadow-lg">
                <TabsTrigger value="active" className="rounded-full px-1 py-3 md:py-4 font-headline font-black text-[10px] md:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all uppercase tracking-widest">
                  Live Openings
                </TabsTrigger>
                <TabsTrigger value="closed" className="rounded-full px-1 py-3 md:py-4 font-headline font-black text-[10px] md:text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-white transition-all uppercase tracking-widest">
                  Archived
                </TabsTrigger>
                <TabsTrigger value="applied" className="rounded-full px-1 py-3 md:py-4 font-headline font-black text-[10px] md:text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all uppercase tracking-widest">
                  My Pipeline ({appliedJobIds.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="active" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeRoles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activeRoles.map((role) => (
                    <RoleCard key={role.id} role={role} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 space-y-6">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Zap className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-3xl font-headline font-black italic">No live openings at this moment</h3>
                  <p className="text-muted-foreground max-w-md mx-auto font-medium">Please check back later or explore your current application pipeline.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="closed" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {closedRoles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grayscale opacity-80">
                  {closedRoles.map((role) => (
                    <RoleCard key={role.id} role={role} isClosed />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 space-y-6 text-slate-400">
                  <h3 className="text-3xl font-headline font-black italic">No recently archived roles</h3>
                </div>
              )}
            </TabsContent>

            <TabsContent value="applied" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {userAppliedRoles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {userAppliedRoles.map((role) => (
                    <RoleCard key={role.id} role={role} isApplied />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 space-y-6">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-headline font-black italic">Your pipeline is empty</h3>
                  <p className="text-muted-foreground max-w-md mx-auto font-medium">Start your professional journey by applying to our active openings today.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Application Dialog */}
      <Dialog open={isAppModalOpen} onOpenChange={setIsAppModalOpen}>
        <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="vibrant-gradient p-10 text-white space-y-2">
            <DialogTitle className="text-3xl font-headline font-black italic">Confirm Application</DialogTitle>
            <DialogDescription className="text-white/80 font-medium">Provisioning role for: <span className="text-yellow-300 font-bold">{selectedJob?.title}</span></DialogDescription>
          </div>
          <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] space-y-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Verified Candidate Profile</p>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl border-2 border-white shadow-xl overflow-hidden bg-slate-200">
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 m-auto text-slate-400 mt-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-headline font-black italic">{userProfile?.fullName}</h4>
                  <p className="text-xs font-bold text-muted-foreground">S/o: {userProfile?.fathersName || 'Not Set'}</p>
                  <div className="flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-primary" /> {userProfile?.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-primary" /> {userProfile?.mobile}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/50">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] font-black uppercase text-slate-500">Resume Attached</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-slate-500">{userProfile?.idCardType || 'ID Proof'} Attached</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Professional Summary & Intent*</Label>
              <Textarea 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Briefly describe your experience and why you are interested in this role..."
                className="min-h-[120px] rounded-2xl border-2 border-slate-100 focus:border-primary px-4 py-4 font-medium resize-none"
              />
            </div>
            
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-start gap-4">
              <Zap className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Protocol Sync</p>
                <p className="text-sm font-medium text-blue-800 leading-relaxed">Your professional resume, ID proof, and profile credentials will be automatically attached to this application from your verified Media profile.</p>
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 flex flex-row items-center justify-between">
            <Button variant="ghost" onClick={() => setIsAppModalOpen(false)} className="rounded-full font-black uppercase tracking-widest text-[10px]">Cancel</Button>
            <Button 
              onClick={submitApplication}
              disabled={isSubmitting}
              className="rounded-full px-10 h-14 bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm Initialization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}

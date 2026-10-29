
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  UserCircle, 
  Loader2, 
  Edit3, 
  Briefcase, 
  ShoppingBag,
  ArrowRight,
  MapPin,
  Home,
  Building2,
  Navigation,
  Globe,
  Hash,
  FileText,
  CreditCard,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  Sparkles,
  History,
  CheckCircle2,
  Clock,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isAppsOpen, setIsAppsOpen] = useState(false);

  // Fetch basic profile
  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);
  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef);

  // Fetch application history
  const appsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "jobApplications"), where("userId", "==", user.uid));
  }, [user, db]);
  const { data: applications, isLoading: isAppsLoading } = useCollection(appsQuery);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <UserCircle className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-headline font-black italic">Access Denied</h1>
        <p className="text-muted-foreground max-sm">Please sign in to view your professional Media profile.</p>
        <Link href="/login">
          <Button size="lg" className="rounded-full px-12 h-16 bg-primary text-white">Sign In</Button>
        </Link>
      </main>
    );
  }

  const openDocument = (dataUri: string) => {
    if (!dataUri) return;
    try {
      const parts = dataUri.split(';');
      if (parts.length < 2) {
        window.open(dataUri, '_blank');
        return;
      }
      const mimeType = parts[0].split(':')[1];
      const base64Data = parts[1].split(',')[1];
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Error processing document view:", error);
      window.open(dataUri, '_blank');
    }
  };

  const memberSince = user.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A';

  const vibrantBg = PlaceHolderImages.find(p => p.id === "profile-vibrant-bg")?.imageUrl || "https://picsum.photos/seed/profile-bg/1200/800";

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <Navbar />
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-20 space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-headline font-black italic text-slate-900 leading-none">
            User <span className="text-primary">Profile</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium uppercase tracking-widest text-xs">Personal Profile</p>
        </div>

        {/* Main Profile Info Card */}
        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-[3rem] overflow-hidden animate-in fade-in slide-in-from-bottom duration-700 relative group">
          <div 
            className="absolute inset-0 z-0 opacity-90 animate-gradient"
            style={{ 
              backgroundImage: `linear-gradient(135deg, rgba(242, 140, 48, 0.8) 0%, rgba(233, 78, 119, 0.8) 50%, rgba(74, 144, 226, 0.8) 100%), url(${vibrantBg})`,
              backgroundSize: '200% 200%, cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-black/10 z-0" />
          <div className="absolute inset-0 grid-bg opacity-10 z-0" />

          <CardContent className="p-8 md:p-12 relative z-10 text-white">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border-4 border-white/30 shadow-2xl overflow-hidden relative group/avatar">
                {profileData?.photoURL ? (
                  <img src={profileData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 md:w-20 md:h-20 text-white/50" />
                )}
                {profileData?.photoURL && (
                  <div 
                    onClick={() => openDocument(profileData.photoURL)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                  >
                    <Eye className="text-white w-8 h-8" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Full Name</p>
                  <p className="text-2xl font-headline font-black italic text-white drop-shadow-md">{profileData?.fullName || user.displayName || 'Not Set'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Parentage</p>
                  <div className="flex items-center gap-2 text-white font-bold drop-shadow-sm">
                    S/o: {profileData?.fathersName || 'Not Set'}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Email Address</p>
                  <div className="flex items-center gap-2 text-white font-bold drop-shadow-sm">
                    <Mail className="w-4 h-4 text-white/80" /> {user.email}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Date of Birth</p>
                  <div className="flex items-center gap-2 text-white font-bold drop-shadow-sm">
                    <Calendar className="w-4 h-4 text-white/80" /> {profileData?.dob || 'Not Provided'}
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 pt-4 border-t border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-white/60 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Verified Member</p>
                  </div>
                  <p className="text-sm font-black text-white/90 uppercase bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm">{memberSince}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <Link href="/profile/edit" className="block">
            <Button className="w-full h-24 rounded-[2.5rem] bg-white border-2 border-slate-100 hover:border-primary hover:bg-slate-50 transition-all shadow-xl group justify-between px-10 text-slate-900 overflow-hidden">
              <span className="flex items-center gap-4 text-xl font-headline font-black italic">
                <Edit3 className="w-6 h-6 text-primary" /> Profile Edit
              </span>
              <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-primary group-hover:translate-x-2 transition-all" />
            </Button>
          </Link>

          <Button 
            onClick={() => setIsAppsOpen(true)}
            className="w-full h-24 rounded-[2.5rem] bg-white border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-xl group justify-between px-10 text-slate-900 overflow-hidden"
          >
            <span className="flex items-center gap-4 text-xl font-headline font-black italic">
              <Briefcase className="w-6 h-6 text-emerald-500" /> Career Hub
            </span>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500 text-white border-none font-black">{applications?.length || 0}</Badge>
              <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
            </div>
          </Button>

          <Button 
            onClick={() => setIsDocsOpen(true)}
            className="w-full h-24 rounded-[2.5rem] bg-white border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all shadow-xl group justify-between px-10 text-slate-900 overflow-hidden"
          >
            <span className="flex items-center gap-4 text-xl font-headline font-black italic">
              <FileText className="w-6 h-6 text-blue-600" /> Documents
            </span>
            <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
          </Button>

          <Button 
            onClick={() => setIsAddressOpen(true)}
            className="w-full h-24 rounded-[2.5rem] bg-white border-2 border-slate-100 hover:border-secondary hover:bg-secondary/5 transition-all shadow-xl group justify-between px-10 text-slate-900 overflow-hidden"
          >
            <span className="flex items-center gap-4 text-xl font-headline font-black italic">
              <MapPin className="w-6 h-6 text-secondary" /> Address
            </span>
            <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-secondary group-hover:translate-x-2 transition-all" />
          </Button>
        </div>
      </div>

      {/* Applications Dialog */}
      <Dialog open={isAppsOpen} onOpenChange={setIsAppsOpen}>
        <DialogContent className="max-w-3xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="vibrant-gradient p-10 text-white space-y-2">
            <DialogTitle className="text-3xl font-headline font-black italic">Career Hub</DialogTitle>
            <p className="text-white/80 font-medium text-xs uppercase tracking-widest">My Professional Pipeline</p>
          </div>
          <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {applications && applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => (
                  <Card key={app.id} className="border-2 border-slate-100 shadow-none rounded-[2rem] overflow-hidden bg-slate-50 group hover:border-primary transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xl font-headline font-black italic">{app.jobTitle}</h4>
                          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-primary" /> Ref: #A-{app.id.slice(0, 6).toUpperCase()}</span>
                          </div>
                        </div>
                        <Badge className={cn(
                          "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-none shadow-lg",
                          app.status === 'selected' ? "bg-emerald-600" :
                          app.status === 'applied' ? "bg-blue-600" :
                          app.status === 'review' ? "bg-purple-600" :
                          app.status === 'scheduled_interview' ? "bg-orange-500" : "bg-slate-600"
                        )}>
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {/* Contextual Status Info */}
                      {(app.status === 'scheduled_test' || app.status === 'scheduled_interview') && (
                        <div className="mt-6 p-4 bg-white rounded-2xl border-2 border-primary/10 space-y-3 animate-in slide-in-from-top-2 duration-500">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> Next Phase Provisioned
                          </p>
                          <div className="flex flex-wrap gap-4">
                            <div className="space-y-0.5">
                              <p className="text-[8px] font-black text-slate-400 uppercase">Timing</p>
                              <p className="text-xs font-bold">{app.status === 'scheduled_test' ? app.hiringContext?.testDate : app.hiringContext?.interviewDate}</p>
                            </div>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="ml-auto rounded-full border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase h-8 px-4"
                              onClick={() => window.open(app.status === 'scheduled_test' ? app.hiringContext?.testLink : app.hiringContext?.interviewLink, '_blank')}
                            >
                              Join Gateway <ExternalLink className="ml-2 w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <History className="w-12 h-12 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-black italic">No Applications Yet</h3>
                  <p className="text-muted-foreground font-medium max-w-xs mx-auto">Start your professional journey with NPB Media today.</p>
                </div>
                <Link href="/career/opportunities">
                  <Button className="rounded-full px-8 bg-primary text-white font-black uppercase tracking-widest text-xs h-12">
                    Explore Opportunities
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="p-8 bg-slate-50 border-t flex justify-center">
            <Button variant="ghost" onClick={() => setIsAppsOpen(false)} className="rounded-full font-black uppercase tracking-widest text-[10px]">Close Hub</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Address Dialog */}
      <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
        <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="vibrant-gradient p-10 text-white space-y-2">
            <DialogTitle className="text-3xl font-headline font-black italic">Saved Address</DialogTitle>
            <p className="text-white/80 font-medium text-xs uppercase tracking-widest">Primary Residence Details</p>
          </div>
          <div className="p-10 space-y-8">
            {profileData?.fullAddress ? (
              <Card className="border-2 border-slate-100 shadow-none rounded-[2.5rem] overflow-hidden bg-slate-50">
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <Home className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Postal Address</p>
                      <p className="text-lg font-bold text-slate-800 leading-relaxed">{profileData.fullAddress}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200/60">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        <Building2 className="w-3 h-3" /> Block / Area
                      </div>
                      <p className="text-base font-bold text-slate-700">{profileData.block || 'Not Set'}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        <Navigation className="w-3 h-3" /> District
                      </div>
                      <p className="text-base font-bold text-slate-700">{profileData.district || 'Not Set'}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        <Globe className="w-3 h-3" /> State & Country
                      </div>
                      <p className="text-base font-bold text-slate-700">{profileData.state}, {profileData.country}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        <Hash className="w-3 h-3" /> Pincode
                      </div>
                      <p className="text-base font-bold text-slate-700">{profileData.pincode || 'Not Set'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-16 space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-12 h-12 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-black italic">No Address Found</h3>
                  <p className="text-muted-foreground font-medium max-w-xs mx-auto">You haven't saved a residential address to your profile yet.</p>
                </div>
                <Link href="/profile/edit" className="inline-block">
                  <Button className="rounded-full px-8 bg-primary text-white font-black uppercase tracking-widest text-xs h-12">
                    Update Profile Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="p-8 bg-slate-50 border-t flex justify-center">
            <Button variant="ghost" onClick={() => setIsAddressOpen(false)} className="rounded-full font-black uppercase tracking-widest text-[10px]">Close Viewer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Documents Dialog */}
      <Dialog open={isDocsOpen} onOpenChange={setIsDocsOpen}>
        <DialogContent className="max-w-3xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="vibrant-gradient p-10 text-white space-y-2">
            <DialogTitle className="text-3xl font-headline font-black italic">Professional Credentials</DialogTitle>
            <p className="text-white/80 font-medium text-xs uppercase tracking-widest">Verified Work Documents</p>
          </div>
          <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {profileData?.resumeURL || profileData?.photoURL || profileData?.idCardURL ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resume Card */}
                {profileData?.resumeURL && (
                  <Card className="border-2 border-slate-100 shadow-none rounded-[2rem] overflow-hidden bg-slate-50 group hover:border-blue-600 transition-all flex flex-col">
                    <CardContent className="p-6 space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Document</p>
                          <p className="text-lg font-black italic">Resume</p>
                        </div>
                      </div>
                      <div className="h-24 bg-white rounded-xl border border-slate-100 flex items-center justify-center opacity-50">
                        <FileText className="w-10 h-10 text-slate-200" />
                      </div>
                      <Button 
                        onClick={() => openDocument(profileData.resumeURL!)}
                        className="w-full rounded-xl bg-white border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-900 font-black uppercase tracking-widest text-[10px] h-12"
                      >
                        View Full Resume <ExternalLink className="ml-2 w-3 h-3" />
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Photo Card */}
                {profileData?.photoURL && (
                  <Card className="border-2 border-slate-100 shadow-none rounded-[2rem] overflow-hidden bg-slate-50 group hover:border-orange-500 transition-all flex flex-col">
                    <CardContent className="p-6 space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Photo</p>
                          <p className="text-lg font-black italic">Profile Pic</p>
                        </div>
                      </div>
                      <div className="h-24 bg-white rounded-xl border border-slate-100 overflow-hidden relative">
                        <img src={profileData.photoURL} alt="Preview" className="w-full h-full object-cover opacity-80" />
                      </div>
                      <Button 
                        onClick={() => openDocument(profileData.photoURL!)}
                        className="w-full rounded-xl bg-white border border-slate-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 text-slate-900 font-black uppercase tracking-widest text-[10px] h-12"
                      >
                        View Full Photo <ExternalLink className="ml-2 w-3 h-3" />
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Identity Card */}
                {profileData?.idCardURL && (
                  <Card className="border-2 border-slate-100 shadow-none rounded-[2rem] overflow-hidden bg-slate-50 group hover:border-emerald-600 transition-all col-span-1 md:col-span-2">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity Proof</p>
                          <p className="text-lg font-black italic">{profileData.idCardType || 'ID Document'}</p>
                        </div>
                        {profileData.idCardURL.startsWith('data:image') && (
                          <div className="w-16 h-12 rounded-lg border border-slate-200 overflow-hidden shrink-0 hidden sm:block">
                            <img src={profileData.idCardURL} alt="ID Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <Button 
                        onClick={() => openDocument(profileData.idCardURL!)}
                        className="px-8 rounded-xl bg-white border border-slate-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-slate-900 font-black uppercase tracking-widest text-[10px] h-12 shrink-0 w-full md:w-auto"
                      >
                        View Document <ExternalLink className="ml-2 w-3 h-3" />
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-16 space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-12 h-12 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-black italic">No Documents Found</h3>
                  <p className="text-muted-foreground font-medium max-w-xs mx-auto">You haven't uploaded your professional credentials yet.</p>
                </div>
                <Link href="/profile/edit" className="inline-block">
                  <Button className="rounded-full px-8 bg-primary text-white font-black uppercase tracking-widest text-xs h-12">
                    Upload Credentials Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="p-8 bg-slate-50 border-t flex justify-center">
            <Button variant="ghost" onClick={() => setIsDocsOpen(false)} className="rounded-full font-black uppercase tracking-widest text-[10px]">Close Viewer</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}

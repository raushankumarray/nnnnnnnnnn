
"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sparkles,
  Globe
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function CheckoutDetailsPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <ShieldCheck className="w-16 h-16 text-primary" />
        <h1 className="text-3xl font-headline font-black italic">Identity Verification Required</h1>
        <p className="text-muted-foreground max-xs mx-auto">Please sign in to your secure portal to continue with the checkout process.</p>
        <Link href="/login">
          <Button size="lg" className="rounded-full px-10 h-14 bg-primary text-white">Sign In Now</Button>
        </Link>
      </main>
    );
  }

  const hasIncompleteProfile = !profileData?.fullName || !profileData?.fullAddress;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <Navbar />
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      <section className="pt-32 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Link href="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4" /> Back to Cart
              </Link>
              <h1 className="text-5xl md:text-7xl font-headline font-black italic text-slate-900 leading-none">
                Verify <span className="text-primary">Identity</span>
              </h1>
              <p className="text-muted-foreground text-lg font-medium">Automatic profile synchronization for secure provisioning.</p>
            </div>
            
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Session Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10">
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] bg-white overflow-hidden p-2">
              <CardContent className="p-8 md:p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Registered Name</label>
                      <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <User className="w-5 h-5 text-slate-400" />
                        <span className="text-lg font-bold text-slate-700">{profileData?.fullName || user.displayName || 'Not Set'}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Contact Email</label>
                      <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <span className="text-lg font-bold text-slate-700">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mobile Network</label>
                      <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <span className="text-lg font-bold text-slate-700">{profileData?.mobile || 'Not Set'}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Billing Address</label>
                      <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 min-h-[68px]">
                        <MapPin className="w-5 h-5 text-slate-400 mt-1 shrink-0" />
                        <span className="text-sm font-bold text-slate-700 leading-relaxed">{profileData?.fullAddress || 'Address not found in profile'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {hasIncompleteProfile && (
                  <div className="p-6 bg-amber-50 rounded-[2rem] border-2 border-amber-100 flex items-start gap-4">
                    <Sparkles className="w-6 h-6 text-amber-600 mt-1 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase text-amber-700">Missing Information</p>
                      <p className="text-sm font-medium text-amber-800 leading-relaxed">
                        Some profile details are missing. We recommend completing your profile for a better administrative experience.
                      </p>
                      <Link href="/profile/edit">
                        <Button variant="link" className="p-0 h-auto text-amber-700 font-black uppercase text-[10px] tracking-widest mt-2">
                          Update Profile <ArrowRight className="ml-1 w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <p className="text-sm font-bold text-slate-500">I verify that the above information is correct for billing purposes.</p>
                  </div>
                  
                  <Link href="/checkout/payment" className="w-full md:w-auto">
                    <Button 
                      className="w-full md:w-auto rounded-full px-12 h-20 text-xl font-headline bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-105 transition-all group active:scale-95"
                    >
                      Proceed to Payment <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-8 opacity-40">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ShieldCheck className="w-4 h-4" /> AES-256 Encrypted</div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Globe className="w-4 h-4" /> Cloud Secure</div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><CheckCircle2 className="w-4 h-4" /> Verified merchant</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

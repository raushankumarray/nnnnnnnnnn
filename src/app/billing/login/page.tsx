
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Store, User, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useFirestore } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function BillingLoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();

  const handleMerchantLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!db) return;

    try {
      const q = query(
        collection(db, "merchants"), 
        where("userId", "==", userId), 
        where("password", "==", password)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const merchant = docSnap.data();
        
        if (merchant.status === 'disabled') {
          setIsLoading(false);
          toast({
            variant: "destructive",
            title: "Access Terminated",
            description: "Your account has been deactivated by administration.",
          });
          return;
        }

        // Set merchant session
        localStorage.setItem("npb_merchant_session", JSON.stringify({
          id: docSnap.id,
          shopName: merchant.shopName,
          userId: merchant.userId,
          plan: merchant.plan,
          timestamp: Date.now()
        }));

        toast({ title: "Authorized", description: `Welcome back, ${merchant.shopName}.` });
        router.push("/billing/dashboard");
      } else {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Invalid Protocol",
          description: "ID/Password combination rejected by security registry.",
        });
      }
    } catch (error) {
      console.error("Merchant login error:", error);
      setIsLoading(false);
      toast({ variant: "destructive", title: "Gateway Error", description: "Could not connect to authentication registry." });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Aesthetic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Public Gateway
        </Link>

        <Card className="border-none bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden">
          <CardHeader className="space-y-4 text-center pb-2 pt-10">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-emerald-50 rounded-3xl border-2 border-emerald-100">
                <Store className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-headline font-black italic uppercase tracking-tighter">
                  Billing <span className="text-emerald-600">Portal</span>
                </CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Merchant Operation Terminal
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleMerchantLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Merchant ID</Label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                    <Input 
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="UID-XXXX" 
                      className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-600 pl-14 font-mono text-sm" 
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Security Key</Label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                    <Input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-600 pl-14 font-mono text-sm" 
                      required
                    />
                  </div>
                </div>
              </div>
              
              <Button disabled={isLoading} className="w-full h-20 rounded-[2rem] text-xl font-headline bg-emerald-600 text-white hover:bg-slate-900 transition-all duration-500 shadow-2xl shadow-emerald-600/20 group relative border-none uppercase tracking-widest font-black">
                 {isLoading ? <Loader2 className="animate-spin" /> : "Initiate Terminal"}
              </Button>
            </form>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Registry Status: Online & Encrypted</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
          NPB Media Billing Infrastructure v1.0
        </p>
      </div>
    </main>
  );
}

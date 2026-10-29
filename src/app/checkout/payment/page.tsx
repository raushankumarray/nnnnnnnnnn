
"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Smartphone, 
  ArrowLeft, 
  QrCode, 
  Copy, 
  Check, 
  Loader2,
  Clock,
  Zap,
  Info
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CheckoutPaymentPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const upiId = "pay@npbmedia";
  
  // UPI QR Generation URL (Standard Format)
  const upiUrl = `upi://pay?pa=${upiId}&pn=NPB%20Media&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;

  const cartRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "carts", user.uid);
  }, [user, db]);

  const { data: cartData } = useDoc(cartRef);

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast({ title: "Copied!", description: "UPI ID copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalize = () => {
    setIsProcessing(true);
    // Simulating payment verification
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Order Staged",
        description: "Your payment verification request has been logged. Our team will verify and activate your modules shortly.",
      });
    }, 2000);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const amount = cartData?.totalAmount || 0;
  const totalWithTax = amount + (amount * 0.18);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <Navbar />
      
      <div className="vibrant-gradient absolute top-0 left-0 w-full h-[400px] -z-10 opacity-10" />

      <section className="pt-32 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Link href="/checkout/details" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4" /> Back to Verification
              </Link>
              <h1 className="text-5xl md:text-7xl font-headline font-black italic text-slate-900 leading-none">
                Direct <span className="text-primary">Payment</span>
              </h1>
              <p className="text-muted-foreground text-lg font-medium">Scan and pay to instantly activate your digital modules.</p>
            </div>
            
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment Gateway: Secure</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: QR Code Section */}
            <div className="lg:col-span-7">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-2">
                <CardContent className="p-10 md:p-16 flex flex-col items-center space-y-10">
                  <div className="space-y-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                      <QrCode className="w-4 h-4" /> Scan With Any UPI App
                    </div>
                    <h3 className="text-2xl font-headline font-black italic">UPI Merchant Gateway</h3>
                  </div>

                  <div className="relative p-6 bg-slate-50 rounded-[3rem] border-4 border-slate-100 shadow-inner group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.8rem]" />
                    <img 
                      src={qrCodeUrl} 
                      alt="Payment QR" 
                      className="w-64 h-64 md:w-80 md:h-80 relative z-10"
                    />
                  </div>

                  <div className="w-full space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Merchant UPI ID</label>
                      <div className="flex gap-2">
                        <div className="flex-1 h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center px-6 text-xl font-bold text-slate-700">
                          {upiId}
                        </div>
                        <Button 
                          onClick={copyUpiId}
                          variant="outline" 
                          className="h-16 w-16 rounded-2xl border-2 border-slate-100 hover:border-primary hover:bg-primary hover:text-white transition-all"
                        >
                          {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Pay_Logo.svg" alt="GPay" className="h-8 mx-auto" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" className="h-8 mx-auto" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="h-8 mx-auto" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Summary & Confirmation */}
            <div className="lg:col-span-5 space-y-8">
              <Card className="border-none shadow-xl rounded-[3rem] bg-white overflow-hidden p-2">
                <CardContent className="p-10 space-y-8">
                  <h3 className="text-2xl font-headline font-black italic">Investment <span className="text-primary">Summary</span></h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      <span>Module Price</span>
                      <span className="text-slate-900">₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      <span>GST (18%)</span>
                      <span className="text-slate-900">₹{(amount * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-slate-100 w-full" />
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Total Payable</p>
                        <p className="text-4xl font-headline font-black text-primary">₹{totalWithTax.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      onClick={handleFinalize}
                      disabled={isProcessing}
                      className="w-full h-20 rounded-[2rem] text-xl font-headline bg-foreground text-white hover:bg-primary transition-all duration-500 shadow-2xl group active:scale-95 border-none"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>I Have Paid <Check className="ml-3 w-6 h-6" /></>
                      )}
                    </Button>
                    <p className="text-[10px] font-bold text-center text-muted-foreground uppercase tracking-widest leading-relaxed">
                      Click only after completing the transaction in your UPI app.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="p-8 bg-blue-600 rounded-[3rem] text-white space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 grid-bg opacity-10" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-blue-200" />
                    <h4 className="text-lg font-headline font-black italic">Security Protocol</h4>
                  </div>
                  <p className="text-sm font-medium text-blue-100 leading-relaxed">
                    Our team verifies all direct payments manually within 30 minutes. Once verified, your software modules will be instantly provisioned to your profile.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Zap className="text-yellow-300 w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Instant Activation Post-Verify</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-6 py-4 bg-slate-100 rounded-2xl border-2 border-slate-200/50">
                <Info className="w-5 h-5 text-slate-400 shrink-0" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">
                  Need Help? Contact us via support desk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

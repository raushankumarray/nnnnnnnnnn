
"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPlus, ShieldCheck, Sparkles, ArrowLeft, Loader2, Check, Circle, X } from "lucide-react";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  dob: z.string().min(1, "Date of birth is required"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[@$!%*?&]/, "Must contain a special character (@, $, etc.)"),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange"
  });

  const passwordValue = watch("password", "");

  // Password requirement checks
  const requirements = [
    { label: "Minimum 6 characters", met: passwordValue.length >= 6 },
    { label: "At least one uppercase letter (A-Z)", met: /[A-Z]/.test(passwordValue) },
    { label: "At least one lowercase letter (a-z)", met: /[a-z]/.test(passwordValue) },
    { label: "At least one number (0-9)", met: /[0-9]/.test(passwordValue) },
    { label: "Special character (@$!%*?&)", met: /[@$!%*?&]/.test(passwordValue) },
  ];

  // Redirect on successful auth
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const onSubmit = (values: SignupValues) => {
    setIsLoading(true);

    if (!auth || !db) {
      // Prototype Mode: Simulate success
      setTimeout(() => {
        setIsLoading(false);
        toast({ 
          title: "Account Simulated (Prototype)", 
          description: "In production, an account would be created in Firebase Auth and Firestore." 
        });
        router.push("/login");
      }, 1000);
      return;
    }

    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const firebaseUser = userCredential.user;
        // Non-blocking firestore write
        setDocumentNonBlocking(doc(db, "users", firebaseUser.uid), {
          id: firebaseUser.uid,
          email: values.email,
          fullName: values.fullName,
          mobile: values.mobile,
          dob: values.dob,
          provider: "password",
          createdAt: serverTimestamp(),
        }, { merge: true });

        toast({ title: "Account created!", description: "Welcome to NPB Media." });
      })
      .catch((error: any) => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: error.message,
        });
      });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-20 relative z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        <div className="w-full max-w-xl space-y-6">
          <Link href="/login" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Login
          </Link>

          <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] bg-white overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
            <CardHeader className="space-y-4 text-center pb-2">
              <div className="flex flex-col items-center gap-2 group">
                <Logo className="w-16 h-16 transition-transform group-hover:scale-110 duration-500" />
                <span className="font-headline font-black text-2xl text-[#00008B]">Media</span>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-headline font-black italic">
                  Join <span className="text-primary">NPB</span>
                </CardTitle>
                <CardDescription className="text-sm font-medium">Create your global professional account.</CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="p-8 pt-4 space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</Label>
                    <Input {...register("fullName")} placeholder="Enter Name" className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary px-6" />
                    {errors.fullName && <p className="text-[10px] text-destructive font-black ml-2">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</Label>
                    <Input {...register("email")} type="email" placeholder="Enter Email" className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary px-6" />
                    {errors.email && <p className="text-[10px] text-destructive font-black ml-2">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Mobile Number</Label>
                    <Input {...register("mobile")} type="tel" placeholder="Enter Mobile" className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary px-6" />
                    {errors.mobile && <p className="text-[10px] text-destructive font-black ml-2">{errors.mobile.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Date of Birth</Label>
                    <Input {...register("dob")} type="date" className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary px-6" />
                    {errors.dob && <p className="text-[10px] text-destructive font-black ml-2">{errors.dob.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Enter Password</Label>
                    <Input 
                      {...register("password")} 
                      type="password" 
                      placeholder="Enter Secure Password" 
                      className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary px-6" 
                    />
                  </div>

                  {/* Password Validation Requirements */}
                  <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Password Requirements:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2 transition-all">
                          {req.met ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-300" />
                          )}
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            req.met ? "text-emerald-600" : "text-slate-400"
                          )}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button disabled={isLoading} className="w-full h-16 rounded-2xl text-xl font-headline bg-primary text-white hover:bg-foreground transition-all duration-500 shadow-xl group relative border-none">
                   {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating...</> : "Create Account"} 
                   {!isLoading && <UserPlus className="ml-2 w-5 h-5 transition-transform group-hover:scale-110" />}
                </Button>
              </form>
              
              <div className="text-center space-y-4 pt-4 border-t border-slate-50">
                <p className="text-sm font-medium text-muted-foreground">
                  Already have an account? <Link href="/login" className="text-primary font-black hover:underline uppercase tracking-widest text-xs">Sign In Here</Link>
                </p>
                <div className="flex items-center gap-4 justify-center opacity-60">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> AES-256 Encrypted</div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"><Sparkles className="w-3.5 h-3.5 text-yellow-500" /> NPB Guard</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}

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
import { useAuth, useFirestore, useUser, signInWithGoogle } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  const requirements = [
    { label: "Minimum 6 characters", met: passwordValue.length >= 6 },
    { label: "At least one uppercase letter (A-Z)", met: /[A-Z]/.test(passwordValue) },
    { label: "At least one lowercase letter (a-z)", met: /[a-z]/.test(passwordValue) },
    { label: "At least one number (0-9)", met: /[0-9]/.test(passwordValue) },
    { label: "Special character (@$!%*?&)", met: /[@$!%*?&]/.test(passwordValue) },
  ];

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user && db) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            id: user.uid,
            email: user.email || "",
            fullName: user.displayName || "Google User",
            photoURL: user.photoURL || "",
            provider: "google",
            createdAt: serverTimestamp(),
          }, { merge: true });
        }
      }
      toast({ title: "Welcome to NPB Media!", description: "Account created with Google." });
      router.push("/");
    } catch (error: any) {
      console.error("Google sign-up error:", error);
      toast({
        variant: "destructive",
        title: "Google Sign-Up Failed",
        description: error.message || "Failed to authenticate via Google.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const onSubmit = async (values: SignupValues) => {
    setIsLoading(true);

    if (!auth || !db) {
      setIsLoading(false);
      toast({ 
        variant: "destructive",
        title: "Service Initializing", 
        description: "Firebase service is initializing. Please try again in a moment." 
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const firebaseUser = userCredential.user;

      await setDoc(doc(db, "users", firebaseUser.uid), {
        id: firebaseUser.uid,
        email: values.email,
        fullName: values.fullName,
        mobile: values.mobile,
        dob: values.dob,
        provider: "password",
        createdAt: serverTimestamp(),
      }, { merge: true });

      toast({ title: "Account created!", description: "Welcome to NPB Media." });
      router.push("/");
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
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
              {/* Google Sign-Up Button */}
              <Button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading || isLoading}
                variant="outline"
                className="w-full h-14 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-sm hover:border-primary transition-all"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Sign up with Google
                  </>
                )}
              </Button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-4 text-xs font-black uppercase text-slate-400 tracking-widest absolute">
                  Or Register with Email
                </span>
              </div>

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
                
                <Button disabled={isLoading || isGoogleLoading} className="w-full h-16 rounded-2xl text-xl font-headline bg-primary text-white hover:bg-foreground transition-all duration-500 shadow-xl group relative border-none">
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

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
import { LogIn, UserPlus, Loader2, ShieldAlert } from "lucide-react";
import { useAuth, useFirestore, useUser, signInWithGoogle } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Auth Unavailable",
        description: "Firebase Authentication is initializing.",
      });
      return;
    }

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast({ title: "Welcome back!", description: "Signed in successfully." });
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
        });
      });
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user && db) {
        // Sync user profile to Firestore
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
      toast({ title: "Authorized with Google", description: `Welcome ${user?.displayName || user?.email}!` });
      router.push("/");
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message || "Failed to authenticate via Google.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-20 relative z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        <div className="w-full max-w-md space-y-6">
          <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] bg-white overflow-hidden animate-in fade-in zoom-in duration-700">
            <CardHeader className="space-y-4 text-center pb-2">
              <div className="flex flex-col items-center gap-2 group">
                <Logo className="w-16 h-16 transition-transform group-hover:scale-110 duration-500" />
                <span className="font-headline font-black text-2xl text-[#00008B]">Media</span>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-headline font-black italic">
                  Welcome <span className="text-primary">Back</span>
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  Access the NPB Media portal.
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="p-8 pt-4 space-y-6">
              {/* Google Sign-In Button */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
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
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-4 text-xs font-black uppercase text-slate-400 tracking-widest absolute">
                  Or Email Login
                </span>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</Label>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email" 
                      className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium px-6" 
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Password</Label>
                    <Input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password" 
                      className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium px-6" 
                      required
                    />
                  </div>
                </div>
                
                <Button disabled={isLoading || isGoogleLoading} className="w-full h-16 rounded-2xl text-xl font-headline bg-primary text-white hover:bg-foreground transition-all duration-500 shadow-xl shadow-primary/20 group relative overflow-hidden border-none">
                   {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"} <LogIn className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
              
              <div className="text-center space-y-4">
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <Link href="/admin/login">
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-slate-100 hover:border-foreground hover:bg-foreground hover:text-white font-black uppercase tracking-widest text-[10px] group transition-all">
                      <ShieldAlert className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                      Internal Access
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="ghost" className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:text-primary transition-all">
                      <UserPlus className="mr-2 w-4 h-4" />
                      Create New Account
                    </Button>
                  </Link>
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

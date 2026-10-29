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
import { useAuth, useUser } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
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
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .catch((error: any) => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
        });
      });
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
                
                <Button disabled={isLoading} className="w-full h-16 rounded-2xl text-xl font-headline bg-primary text-white hover:bg-foreground transition-all duration-500 shadow-xl shadow-primary/20 group relative overflow-hidden border-none">
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

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/Logo";
import { useRouter } from "next/navigation";
import { ShieldAlert, Terminal, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Local authentication logic
    setTimeout(() => {
      if (username === "Adminn" && password === "Admin@88") {
        // Set local admin session
        localStorage.setItem("npb_admin_session", "active_" + Date.now());
        toast({ title: "Authorized", description: "Executive session established." });
        router.push("/admin");
      } else {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Invalid administrative credentials.",
        });
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cybersecurity Aesthetic Background */}
      <div className="absolute inset-0 grid-bg opacity-5" />
      <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Public Gateway
        </Link>

        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-2xl shadow-2xl rounded-[3rem] overflow-hidden">
          <CardHeader className="space-y-4 text-center pb-2 border-b border-slate-800 bg-slate-900/80">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-3xl border border-primary/20">
                <ShieldAlert className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-headline font-black italic text-white uppercase tracking-tighter">
                  Command <span className="text-primary">Center</span>
                </CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                  Secure Administrative Protocol
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Username</Label>
                  <div className="relative">
                    <Terminal className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter Username" 
                      className="h-14 rounded-2xl border-slate-800 bg-slate-950 text-white focus:border-primary pl-14 font-code text-sm" 
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password" 
                      className="h-14 rounded-2xl border-slate-800 bg-slate-950 text-white focus:border-primary pl-14 font-code text-sm" 
                      required
                    />
                  </div>
                </div>
              </div>
              
              <Button disabled={isLoading} className="w-full h-16 rounded-2xl text-lg font-headline bg-primary text-white hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-primary/10 group relative border-none uppercase tracking-widest font-black">
                 {isLoading ? <Loader2 className="animate-spin" /> : "Initiate Login"}
              </Button>
            </form>

            <div className="pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Terminal Status: Ready</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
          NPB Media Security Infrastructure v4.0.2
        </p>
      </div>
    </main>
  );
}

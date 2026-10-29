
"use client";

import React, { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function HrmsLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const q = query(
        collection(db, "hrms_users"),
        where("username", "==", username),
        where("password", "==", password)
      );
      
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const userData = snap.docs[0].data();
        
        if (userData.status === 'banned' || userData.status === 'disabled') {
          toast({ variant: "destructive", title: "Access Revoked", description: `Account is ${userData.status.toUpperCase()}` });
          setIsLoading(false);
          return;
        }

        // Device Binding Logic
        const storedDeviceId = localStorage.getItem("hrms_device_id") || `DEV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        if (userData.deviceId && userData.deviceId !== storedDeviceId) {
          toast({ variant: "destructive", title: "Security Alert", description: "This account is bound to another hardware node. Contact Support." });
          setIsLoading(false);
          return;
        }
        localStorage.setItem("hrms_device_id", storedDeviceId);

        localStorage.setItem("hrms_session", JSON.stringify({
          ...userData,
          id: snap.docs[0].id
        }));

        toast({ title: "Authorized", description: "Node access granted." });
        
        // Dynamic Role Routing
        const routes: Record<string, string> = {
          super_admin: "/hrms/super-admin",
          company_admin: "/hrms/admin",
          manager: "/hrms/manager",
          hr: "/hrms/hr",
          employee: "/hrms/employee"
        };
        router.push(routes[userData.role] || "/hrms/employee");
        
      } else if (username === "adminn" && password === "Admin@88") {
        // Master override for first-time setup
        localStorage.setItem("hrms_session", JSON.stringify({ role: "super_admin", fullName: "Master Admin" }));
        router.push("/hrms/super-admin");
      } else {
        toast({ variant: "destructive", title: "Denied", description: "Invalid credentials." });
      }
    } catch (error) {
      console.error("HRMS login error:", error);
      toast({ variant: "destructive", title: "Auth Error", description: "Gateway failure." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <Card className="border-slate-800 bg-slate-900 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter Username"
                    className="h-14 rounded-xl border-slate-800 bg-slate-950 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="h-14 rounded-xl border-slate-800 bg-slate-950 text-white"
                    required
                  />
                </div>
              </div>

              <Button disabled={isLoading} className="w-full h-14 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:scale-105 transition-all">
                {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
              
              <div className="text-center pt-2">
                <button type="button" className="text-[10px] font-black uppercase text-slate-500 hover:text-primary tracking-widest transition-colors">
                  Forgot Security Key?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

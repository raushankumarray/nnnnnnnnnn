
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, Bell, LogOut, Menu, Settings as SettingsIcon } from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HrmsLayout({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const db = useFirestore();

  useEffect(() => {
    const sessionStr = localStorage.getItem("hrms_session");
    if (!sessionStr) {
      if (pathname !== "/hrms/login") router.push("/hrms/login");
      setIsChecking(false);
    } else {
      setSession(JSON.parse(sessionStr));
      setIsChecking(false);
    }
  }, [router, pathname]);

  const companyRef = useMemoFirebase(() => {
    if (!db || !session?.companyId) return null;
    return doc(db, "companies", session.companyId);
  }, [db, session?.companyId]);

  const { data: companyData } = useDoc(companyRef);

  const handleLogout = () => {
    localStorage.removeItem("hrms_session");
    router.push("/hrms/login");
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const isLoginPage = pathname === "/hrms/login";

  return (
    <div className={cn(
      "min-h-screen bg-slate-950 text-white font-body selection:bg-primary/30 antialiased",
      !isLoginPage && "flex flex-col"
    )}>
      {!isLoginPage && (
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {companyData?.logoURL ? (
                <img src={companyData.logoURL} alt="Logo" className="h-10 w-10 rounded-xl object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center font-black italic">
                  NPB
                </div>
              )}
              <div>
                <h1 className="text-lg font-headline font-black italic leading-none">{companyData?.portalName || "NPB HRMS"}</h1>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{session?.role?.replace('_', ' ')} Terminal</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
              </Button>
              <div className="h-8 w-px bg-slate-800 mx-2" />
              <div className="hidden sm:block text-right mr-4">
                <p className="text-xs font-black italic">{session?.fullName}</p>
                <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{session?.department || "Global"}</p>
              </div>
              <Button onClick={handleLogout} variant="ghost" size="icon" className="rounded-full hover:bg-rose-500/10 text-slate-500 hover:text-rose-500">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1 relative">
        {!isLoginPage && <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />}
        {children}
      </main>
    </div>
  );
}

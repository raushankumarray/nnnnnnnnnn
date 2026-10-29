
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BillingSidebar } from "@/components/billing/Sidebar";
import { Loader2 } from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const db = useFirestore();
  const { toast } = useToast();

  const isLoginPage = pathname.includes("/billing/login");

  // Initial session check
  useEffect(() => {
    const sessionStr = localStorage.getItem("npb_merchant_session");
    if (!sessionStr) {
      if (!isLoginPage) {
        router.push("/billing/login");
      }
      setIsChecking(false);
    } else {
      try {
        const session = JSON.parse(sessionStr);
        setMerchantId(session.id);
        setIsChecking(false);
      } catch (e) {
        console.error("Failed to parse merchant session:", e);
        localStorage.removeItem("npb_merchant_session");
        router.push("/billing/login");
        setIsChecking(false);
      }
    }
  }, [router, isLoginPage]);

  // Real-time account status monitor
  const merchantRef = useMemoFirebase(() => {
    if (!db || !merchantId) return null;
    return doc(db, "merchants", merchantId);
  }, [db, merchantId]);

  const { data: merchantData, isLoading: isMerchantLoading } = useDoc(merchantRef);

  useEffect(() => {
    // If we are logged in but the document is missing or disabled, force logout
    if (!isLoginPage && merchantId && !isMerchantLoading) {
      if (!merchantData || merchantData.status === 'disabled') {
        localStorage.removeItem("npb_merchant_session");
        toast({
          variant: "destructive",
          title: "Session Terminated",
          description: !merchantData 
            ? "Your account has been deleted by administration." 
            : "Your access has been revoked by administration."
        });
        router.push("/billing/login");
      }
    }
  }, [merchantData, merchantId, isMerchantLoading, isLoginPage, router, toast]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <BillingSidebar />
      <main className="flex-1 ml-20 transition-all duration-500 p-8 min-h-screen relative overflow-x-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
        
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}

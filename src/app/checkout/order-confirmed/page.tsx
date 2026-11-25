"use client";

import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  History,
  ArrowRight,
  ShieldCheck,
  Receipt,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const orderRef = useMemoFirebase(() => {
    if (!db || !orderId || !user) return null;
    return doc(db, "orders", orderId);
  }, [db, orderId, user]);

  const { data: order, isLoading: isOrderLoading } = useDoc(orderRef);

  if (isUserLoading || isOrderLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 py-32">
        <ShieldCheck className="w-14 h-14 text-primary" />
        <h1 className="text-3xl font-headline font-black">Sign In Required</h1>
        <p className="text-muted-foreground max-w-sm">
          Sign in to view your order confirmation and payment receipt.
        </p>
        <Link href="/login">
          <Button size="lg" className="rounded-full px-10 h-14 bg-primary text-white">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  const isConfirmed =
    order &&
    order.paymentStatus === "success" &&
    order.orderStatus === "confirmed";

  if (!orderId || !order || !isConfirmed) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 w-full">
        <Card className="border border-red-200 bg-white shadow-xl rounded-[2.5rem]">
          <CardContent className="p-10 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-headline font-black text-slate-900">
                Order Not Confirmed
              </h1>
              <p className="text-muted-foreground text-base">
                {order?.failureReason ||
                  "UPI payment has not succeeded for this order. Only verified UPI payments result in a confirmed order."}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link href="/checkout/payment">
                <Button className="rounded-xl h-12 px-6 bg-primary text-white font-bold">
                  <RefreshCw className="w-4 h-4 mr-2" /> Retry UPI Payment
                </Button>
              </Link>
              <Link href="/payment-history">
                <Button variant="outline" className="rounded-xl h-12 px-6">
                  <History className="w-4 h-4 mr-2" /> Payment History
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 w-full space-y-8">
      <Card className="border border-emerald-200 bg-white shadow-xl rounded-[2.5rem] overflow-hidden">
        <div className="bg-emerald-600 text-white p-8 md:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">
              UPI Payment Verified
            </p>
            <h1 className="text-4xl md:text-5xl font-headline font-black">
              Order Confirmed
            </h1>
            <p className="text-sm text-emerald-50 font-medium">
              Order #{order.orderId} is confirmed and recorded in your Payment History.
            </p>
          </div>
        </div>

        <CardContent className="p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm border-b border-slate-100 pb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                UPI UTR Reference
              </p>
              <p className="font-mono font-bold text-slate-900 mt-1 tabular-nums">
                {order.utrNumber || order.transactionRef}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Payment Method
              </p>
              <p className="font-bold text-slate-900 mt-1">
                UPI ({order.upiApp || "UPI Gateway"})
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Transaction Ref
              </p>
              <p className="font-mono text-slate-700 mt-1">{order.transactionRef}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Confirmed At
              </p>
              <p className="font-medium text-slate-700 mt-1 tabular-nums">
                {new Date(order.confirmedAt || order.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Receipt className="w-4 h-4 text-primary" /> Purchased Modules
            </div>
            <div className="space-y-3">
              {Array.isArray(order.items) &&
                order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-slate-50 text-sm"
                  >
                    <span className="font-semibold text-slate-800">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
            </div>

            <div className="pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  ₹{Number(order.subtotal || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (18%)</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  ₹{Number(order.gst || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Total Paid via UPI
                </span>
                <span className="text-3xl font-headline font-black text-emerald-600 tabular-nums">
                  ₹{Number(order.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/payment-history" className="flex-1">
              <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-primary text-white font-bold">
                <History className="w-4 h-4 mr-2" /> View Payment History
              </Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 font-bold">
                Explore More Modules <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <section className="pt-28 pb-20 flex-1 flex flex-col justify-center">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          }
        >
          <OrderConfirmedContent />
        </Suspense>
      </section>
      <Footer />
    </main>
  );
}

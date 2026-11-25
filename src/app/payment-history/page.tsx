"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Loader2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc, setDoc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type FilterStatus = "all" | "confirmed" | "pending" | "failed";

export default function PaymentHistoryPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [retryingOrderId, setRetryingOrderId] = useState<string | null>(null);
  const [fetchingOrderId, setFetchingOrderId] = useState<string | null>(null);

  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "orders"), where("userId", "==", user.uid));
  }, [db, user]);

  const { data: rawOrders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return [...rawOrders].sort((a: any, b: any) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }, [rawOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const matchesStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "confirmed"
          ? order.paymentStatus === "success" && order.orderStatus === "confirmed"
          : filterStatus === "pending"
          ? order.paymentStatus === "pending"
          : order.paymentStatus === "failed";

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesStatus;

      const matchesText =
        String(order.orderId || "").toLowerCase().includes(q) ||
        String(order.transactionRef || "").toLowerCase().includes(q) ||
        String(order.utrNumber || "").toLowerCase().includes(q) ||
        (Array.isArray(order.items) &&
          order.items.some((item: any) =>
            String(item.title || "").toLowerCase().includes(q)
          ));

      return matchesStatus && matchesText;
    });
  }, [orders, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const totalCount = orders.length;
    const confirmedList = orders.filter(
      (o: any) => o.paymentStatus === "success" && o.orderStatus === "confirmed"
    );
    const failedCount = orders.filter((o: any) => o.paymentStatus === "failed").length;
    const pendingCount = orders.filter((o: any) => o.paymentStatus === "pending").length;
    const totalPaid = confirmedList.reduce(
      (sum: number, o: any) => sum + Number(o.totalAmount || 0),
      0
    );

    return {
      totalCount,
      confirmedCount: confirmedList.length,
      failedOrPending: failedCount + pendingCount,
      totalPaid,
    };
  }, [orders]);

  const handleRetryPayment = async (order: any) => {
    if (!user || !db || !Array.isArray(order.items) || order.items.length === 0) {
      router.push("/products");
      return;
    }

    setRetryingOrderId(order.orderId);
    try {
      const subtotal = order.items.reduce(
        (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
        0
      );
      await setDoc(
        doc(db, "carts", user.uid),
        {
          userId: user.uid,
          items: order.items,
          totalAmount: subtotal,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      router.push("/checkout/payment");
    } catch (err) {
      console.error("Retry payment error:", err);
      toast({
        variant: "destructive",
        title: "Retry Error",
        description: "Could not restore order items for retry.",
      });
    } finally {
      setRetryingOrderId(null);
    }
  };

  const handleAutoFetchStatus = async (order: any) => {
    if (!db || !order?.orderId) return;
    setFetchingOrderId(order.orderId);
    try {
      const freshSnap = await getDoc(doc(db, "orders", order.orderId));
      const fresh = freshSnap.data();
      if (fresh?.paymentStatus === "success" && fresh?.orderStatus === "confirmed") {
        toast({
          title: "Order Confirmed",
          description: `UPI payment for ${order.orderId} is confirmed!`,
        });
        router.push(`/checkout/order-confirmed?orderId=${encodeURIComponent(order.orderId)}`);
      } else if (fresh?.paymentStatus === "failed") {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: fresh.failureReason || "UPI payment failed. Order not confirmed.",
        });
      } else {
        toast({
          title: "Still Pending",
          description: "No UPI confirmation received yet. Retry or enter UTR on checkout.",
        });
      }
    } catch (err) {
      console.error("Fetch order status error:", err);
    } finally {
      setFetchingOrderId(null);
    }
  };

  if (isUserLoading || isOrdersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 pt-32 pb-20">
          <ShieldCheck className="w-16 h-16 text-primary" />
          <h1 className="text-4xl font-headline font-black text-slate-900">
            Sign In to View Payment History
          </h1>
          <p className="text-muted-foreground max-w-sm">
            Access your verified UPI transactions, confirmed receipts, and failed payment records.
          </p>
          <Link href="/login">
            <Button size="lg" className="rounded-full px-10 h-14 bg-primary text-white">
              Sign In
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <section className="pt-32 pb-24 flex-1">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                UPI Gateway Ledger
              </p>
              <h1 className="text-4xl md:text-6xl font-headline font-black text-slate-900">
                Payment <span className="text-primary">History</span>
              </h1>
              <p className="text-muted-foreground text-base max-w-xl">
                Track all UPI transactions, confirmed module orders, and auto-fetched payment statuses.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/products">
                <Button variant="outline" className="rounded-xl h-11 px-5 bg-white border-slate-200">
                  Browse Modules
                </Button>
              </Link>
              <Link href="/cart">
                <Button className="rounded-xl h-11 px-5 bg-primary text-white font-bold">
                  Open Cart <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="border border-slate-200/80 shadow-sm rounded-3xl bg-white">
              <CardContent className="p-6 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">Total Transactions</p>
                <p className="text-3xl font-headline font-black text-slate-900 tabular-nums">
                  {stats.totalCount}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200/80 shadow-sm rounded-3xl bg-white">
              <CardContent className="p-6 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">Confirmed Orders</p>
                <p className="text-3xl font-headline font-black text-emerald-600 tabular-nums">
                  {stats.confirmedCount}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200/80 shadow-sm rounded-3xl bg-white">
              <CardContent className="p-6 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">Failed / Pending</p>
                <p className="text-3xl font-headline font-black text-amber-600 tabular-nums">
                  {stats.failedOrPending}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200/80 shadow-sm rounded-3xl bg-white">
              <CardContent className="p-6 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">Total UPI Paid</p>
                <p className="text-3xl font-headline font-black text-primary tabular-nums">
                  ₹{stats.totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Filters & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl w-fit">
              {(
                [
                  { key: "all", label: "All Payments" },
                  { key: "confirmed", label: "Confirmed" },
                  { key: "pending", label: "Pending" },
                  { key: "failed", label: "Failed" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterStatus(tab.key)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap",
                    filterStatus === tab.key
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Order ID, UTR, or module..."
                className="pl-10 h-11 rounded-xl bg-white border-slate-200"
              />
            </div>
          </div>

          {/* Transactions List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-5">
              {filteredOrders.map((order: any) => {
                const isConfirmed =
                  order.paymentStatus === "success" && order.orderStatus === "confirmed";
                const isFailed = order.paymentStatus === "failed";

                return (
                  <Card
                    key={order.id}
                    className="border border-slate-200/80 shadow-sm rounded-3xl bg-white overflow-hidden"
                  >
                    <CardContent className="p-6 md:p-8 space-y-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-headline font-black text-slate-900">
                              Order #{order.orderId}
                            </h3>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 text-xs font-bold",
                                isConfirmed
                                  ? "text-emerald-700"
                                  : isFailed
                                  ? "text-red-600"
                                  : "text-amber-600"
                              )}
                            >
                              {isConfirmed ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  Payment Success · Order Confirmed
                                </>
                              ) : isFailed ? (
                                <>
                                  <XCircle className="w-4 h-4" />
                                  Payment Failed · Order Not Confirmed
                                </>
                              ) : (
                                <>
                                  <Clock className="w-4 h-4" />
                                  Pending UPI Verification
                                </>
                              )}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground tabular-nums">
                            <span>{new Date(order.createdAt).toLocaleString("en-IN")}</span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1">
                              <Smartphone className="w-3.5 h-3.5" />
                              {order.upiApp || "UPI"}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">Ref: {order.transactionRef}</span>
                            {order.utrNumber && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono font-semibold text-slate-700">
                                  UTR: {order.utrNumber}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between lg:justify-end gap-5">
                          <div className="text-left lg:text-right">
                            <p className="text-xs text-muted-foreground font-medium">Total Amount</p>
                            <p className="text-2xl font-headline font-black text-slate-900 tabular-nums">
                              ₹{Number(order.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>

                          {isConfirmed ? (
                            <Link href={`/checkout/order-confirmed?orderId=${encodeURIComponent(order.orderId)}`}>
                              <Button className="rounded-xl h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                                <Receipt className="w-4 h-4 mr-2" /> Order Receipt
                              </Button>
                            </Link>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {!isFailed && (
                                <Button
                                  variant="outline"
                                  onClick={() => handleAutoFetchStatus(order)}
                                  disabled={fetchingOrderId === order.orderId}
                                  className="rounded-xl h-11 px-4 border-slate-200 font-bold text-xs"
                                >
                                  {fetchingOrderId === order.orderId ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Auto-Fetch UPI
                                    </>
                                  )}
                                </Button>
                              )}
                              <Button
                                onClick={() => handleRetryPayment(order)}
                                disabled={retryingOrderId === order.orderId}
                                className="rounded-xl h-11 px-5 bg-primary hover:bg-primary/90 text-white font-bold text-xs"
                              >
                                {retryingOrderId === order.orderId ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry UPI Pay
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Items & Failure Note */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-700">
                          {Array.isArray(order.items) &&
                            order.items.map((item: any, idx: number) => (
                              <span key={idx} className="font-medium tabular-nums">
                                {item.title} × {item.quantity} (₹
                                {(Number(item.price) * Number(item.quantity)).toLocaleString("en-IN")})
                              </span>
                            ))}
                        </div>
                        {order.failureReason && isFailed && (
                          <p className="text-xs font-medium text-red-600">
                            Reason: {order.failureReason}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border border-dashed border-slate-300 shadow-none rounded-3xl bg-white">
              <CardContent className="p-16 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <History className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-headline font-black text-slate-900">
                    No Payment Records Found
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    {filterStatus === "all"
                      ? "You haven't initiated any UPI module payments yet."
                      : `No ${filterStatus} UPI transactions match your current filter.`}
                  </p>
                </div>
                <Link href="/products" className="inline-block">
                  <Button className="rounded-xl h-12 px-6 bg-primary text-white font-bold">
                    Explore Modules
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Smartphone,
  ArrowLeft,
  QrCode,
  Copy,
  Check,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  History,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useUser,
  useFirestore,
  useDoc,
  useMemoFirebase,
} from "@/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UpiSession {
  orderId: string;
  transactionRef: string;
  merchantUpiId: string;
  upiIntentUrl: string;
  qrCodeDataUrl: string;
  subtotal: number;
  gst: number;
  totalAmount: number;
  upiApp: string;
  payerUpiId: string;
  sessionSignature: string;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  createdAt: string;
}

const UPI_APPS = [
  { id: "Google Pay", label: "Google Pay" },
  { id: "PhonePe", label: "PhonePe" },
  { id: "Paytm", label: "Paytm" },
  { id: "BHIM UPI", label: "BHIM UPI" },
] as const;

export default function CheckoutPaymentPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("Google Pay");
  const [payerUpiId, setPayerUpiId] = useState<string>("");
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const [session, setSession] = useState<UpiSession | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAutoFetching, setIsAutoFetching] = useState(false);
  const [autoFetchAttempts, setAutoFetchAttempts] = useState(0);
  const [paymentOutcome, setPaymentOutcome] = useState<
    "idle" | "pending" | "success" | "failed"
  >("idle");
  const [failureMessage, setFailureMessage] = useState<string>("");

  const hasInitiatedRef = useRef(false);
  const hasRedirectedRef = useRef(false);

  const cartRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "carts", user.uid);
  }, [user, db]);
  const { data: cartData, isLoading: isCartLoading } = useDoc(cartRef);

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);
  const { data: profileData } = useDoc(profileRef);

  // Real-time Firestore listener on the active order document for instant status auto-fetch
  const activeOrderRef = useMemoFirebase(() => {
    if (!db || !session?.orderId) return null;
    return doc(db, "orders", session.orderId);
  }, [db, session?.orderId]);
  const { data: liveOrderData } = useDoc(activeOrderRef);

  const initUpiSession = useCallback(
    async (forceReset = false) => {
      if (!user || !db) return;
      const items = cartData?.items || [];
      if (items.length === 0) return;

      if (hasInitiatedRef.current && !forceReset) return;
      hasInitiatedRef.current = true;

      setIsInitializing(true);
      setPaymentOutcome("pending");
      setFailureMessage("");
      setUtrNumber("");
      setAutoFetchAttempts(0);
      hasRedirectedRef.current = false;

      try {
        const res = await fetch("/api/payments/upi/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            items,
            upiApp: selectedUpiApp,
            payerUpiId: payerUpiId.trim(),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to initialize UPI gateway.");
        }

        const nowIso = new Date().toISOString();

        // Persist initial pending order record in Firestore for Payment History tracking
        await setDoc(doc(db, "orders", data.orderId), {
          orderId: data.orderId,
          userId: user.uid,
          userEmail: user.email || "",
          customerName:
            profileData?.fullName || user.displayName || "Customer",
          customerPhone: profileData?.mobile || "",
          items: data.items,
          subtotal: data.subtotal,
          gst: data.gst,
          totalAmount: data.totalAmount,
          paymentMethod: "UPI",
          upiApp: selectedUpiApp,
          payerUpiId: payerUpiId.trim(),
          merchantUpiId: data.merchantUpiId,
          transactionRef: data.transactionRef,
          utrNumber: "",
          paymentStatus: "pending",
          orderStatus: "pending",
          failureReason: "",
          createdAt: nowIso,
          updatedAt: nowIso,
        });

        setSession(data);
      } catch (error) {
        hasInitiatedRef.current = false;
        console.error("UPI session init error:", error);
        toast({
          variant: "destructive",
          title: "Gateway Initialization Failed",
          description:
            error instanceof Error
              ? error.message
              : "Could not start UPI session.",
        });
      } finally {
        setIsInitializing(false);
      }
    },
    [user, db, cartData?.items, selectedUpiApp, payerUpiId, profileData, toast]
  );

  // Automatically create a UPI session once cart items are loaded
  useEffect(() => {
    if (
      !isUserLoading &&
      !isCartLoading &&
      user &&
      db &&
      cartData?.items?.length > 0 &&
      !session &&
      !hasInitiatedRef.current
    ) {
      initUpiSession(false);
    }
  }, [isUserLoading, isCartLoading, user, db, cartData?.items, session, initUpiSession]);

  const handleConfirmedSuccess = useCallback(
    async (orderId: string, verifiedUtr?: string) => {
      if (hasRedirectedRef.current) return;
      hasRedirectedRef.current = true;

      setPaymentOutcome("success");
      setIsAutoFetching(false);

      // Clear cart after confirmed payment
      if (cartRef) {
        try {
          await updateDoc(cartRef, {
            items: [],
            totalAmount: 0,
            updatedAt: new Date().toISOString(),
          });
        } catch (err) {
          console.error("Cart clear error:", err);
        }
      }

      toast({
        title: "UPI Payment Confirmed",
        description: verifiedUtr
          ? `UTR ${verifiedUtr} verified. Redirecting to your confirmed order...`
          : "Payment verified! Redirecting to your confirmed order...",
      });

      setTimeout(() => {
        router.push(`/checkout/order-confirmed?orderId=${encodeURIComponent(orderId)}`);
      }, 1200);
    },
    [cartRef, router, toast]
  );

  // Watch real-time Firestore order state so external/webhook confirmations or failures update & redirect automatically
  useEffect(() => {
    if (!liveOrderData || !session) return;

    if (
      liveOrderData.paymentStatus === "success" &&
      liveOrderData.orderStatus === "confirmed" &&
      paymentOutcome !== "success"
    ) {
      handleConfirmedSuccess(session.orderId, liveOrderData.utrNumber);
    } else if (
      liveOrderData.paymentStatus === "failed" &&
      paymentOutcome !== "failed"
    ) {
      setIsAutoFetching(false);
      setPaymentOutcome("failed");
      setFailureMessage(
        liveOrderData.failureReason ||
          "Payment failed via UPI. Order has not been confirmed."
      );
    }
  }, [liveOrderData, session, paymentOutcome, handleConfirmedSuccess]);

  // Auto-fetch UPI status polling when payment is awaiting bank response
  useEffect(() => {
    if (!isAutoFetching || !session || !user || !db) return;
    if (paymentOutcome === "success" || paymentOutcome === "failed") return;

    const timer = setInterval(async () => {
      setAutoFetchAttempts((prev) => prev + 1);
      try {
        const res = await fetch("/api/payments/upi/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: session.orderId,
            transactionRef: session.transactionRef,
            totalAmount: session.totalAmount,
            userId: user.uid,
            sessionSignature: session.sessionSignature,
            action: "auto_fetch",
            utrNumber: utrNumber.trim(),
          }),
        });
        const result = await res.json();

        if (result.verified && result.paymentStatus === "success") {
          const confirmedAt = new Date().toISOString();
          await updateDoc(doc(db, "orders", session.orderId), {
            paymentStatus: "success",
            orderStatus: "confirmed",
            utrNumber: result.utrNumber,
            upiApp: selectedUpiApp,
            payerUpiId: payerUpiId.trim(),
            confirmedAt,
            updatedAt: confirmedAt,
          });
          handleConfirmedSuccess(session.orderId, result.utrNumber);
        } else if (result.paymentStatus === "failed") {
          const reason =
            result.failureReason ||
            "UPI verification failed. Order not confirmed.";
          await updateDoc(doc(db, "orders", session.orderId), {
            paymentStatus: "failed",
            orderStatus: "not_confirmed",
            failureReason: reason,
            updatedAt: new Date().toISOString(),
          });
          setIsAutoFetching(false);
          setPaymentOutcome("failed");
          setFailureMessage(reason);
        }
      } catch (err) {
        console.error("Auto-fetch UPI poll error:", err);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [
    isAutoFetching,
    session,
    user,
    db,
    paymentOutcome,
    utrNumber,
    selectedUpiApp,
    payerUpiId,
    handleConfirmedSuccess,
  ]);

  const copyUpiId = () => {
    const idToCopy = session?.merchantUpiId || "pay@npbmedia";
    navigator.clipboard.writeText(idToCopy);
    setCopied(true);
    toast({ title: "Copied", description: "Merchant UPI ID copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenUpiApp = () => {
    if (!session) return;
    setIsAutoFetching(true);
    toast({
      title: "UPI App Triggered",
      description: `Complete payment in ${selectedUpiApp}. Auto-fetching UPI status...`,
    });
    window.location.href = session.upiIntentUrl;
  };

  const handleSendCollectRequest = async () => {
    if (!session || !db) return;
    const vpa = payerUpiId.trim();
    if (!/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(vpa)) {
      toast({
        variant: "destructive",
        title: "Invalid UPI ID",
        description: "Enter a valid UPI ID such as username@okaxis or 9876543210@ybl.",
      });
      return;
    }

    try {
      await updateDoc(doc(db, "orders", session.orderId), {
        upiApp: selectedUpiApp,
        payerUpiId: vpa,
        updatedAt: new Date().toISOString(),
      });
      setIsAutoFetching(true);
      toast({
        title: "UPI Collect Request Sent",
        description: `Approve ₹${session.totalAmount.toLocaleString("en-IN")} in ${selectedUpiApp} (${vpa}), then enter your 12-digit UTR below.`,
      });
    } catch (err) {
      console.error("Collect request error:", err);
    }
  };

  const handleVerifyUpiPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !user || !db) return;

    const cleanedUtr = utrNumber.trim();
    if (!cleanedUtr) {
      setIsAutoFetching(true);
      toast({
        title: "Auto-Fetching UPI Status",
        description: "Enter your 12-digit UPI UTR reference number to verify instantly.",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/payments/upi/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: session.orderId,
          transactionRef: session.transactionRef,
          totalAmount: session.totalAmount,
          userId: user.uid,
          sessionSignature: session.sessionSignature,
          action: "verify_utr",
          utrNumber: cleanedUtr,
        }),
      });

      const result = await res.json();

      if (result.verified && result.paymentStatus === "success") {
        const confirmedAt = new Date().toISOString();
        await updateDoc(doc(db, "orders", session.orderId), {
          paymentStatus: "success",
          orderStatus: "confirmed",
          utrNumber: result.utrNumber,
          upiApp: selectedUpiApp,
          payerUpiId: payerUpiId.trim(),
          confirmedAt,
          updatedAt: confirmedAt,
        });
        await handleConfirmedSuccess(session.orderId, result.utrNumber);
      } else {
        const reason =
          result.failureReason ||
          "UPI transaction could not be verified. Order not confirmed.";
        await updateDoc(doc(db, "orders", session.orderId), {
          paymentStatus: "failed",
          orderStatus: "not_confirmed",
          utrNumber: cleanedUtr,
          failureReason: reason,
          updatedAt: new Date().toISOString(),
        });
        setIsAutoFetching(false);
        setPaymentOutcome("failed");
        setFailureMessage(reason);
        toast({
          variant: "destructive",
          title: "Payment Failed — Order Not Confirmed",
          description: reason,
        });
      }
    } catch (err) {
      console.error("Verify UPI error:", err);
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "Unable to reach UPI verification service. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleMarkPaymentFailed = async () => {
    if (!session || !user || !db) return;
    setIsVerifying(true);
    try {
      const res = await fetch("/api/payments/upi/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: session.orderId,
          transactionRef: session.transactionRef,
          totalAmount: session.totalAmount,
          userId: user.uid,
          sessionSignature: session.sessionSignature,
          action: "report_failure",
          failureReason: "Payment cancelled or declined in UPI app.",
        }),
      });
      const result = await res.json();
      const reason =
        result.failureReason || "Payment cancelled or declined in UPI app.";

      await updateDoc(doc(db, "orders", session.orderId), {
        paymentStatus: "failed",
        orderStatus: "not_confirmed",
        failureReason: reason,
        updatedAt: new Date().toISOString(),
      });

      setIsAutoFetching(false);
      setPaymentOutcome("failed");
      setFailureMessage(reason);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "Order was not confirmed and has been recorded in Payment History.",
      });
    } catch (err) {
      console.error("Report failure error:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  if (isUserLoading || isCartLoading) {
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
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 pt-32">
          <ShieldCheck className="w-14 h-14 text-primary" />
          <h1 className="text-3xl font-headline font-black">Sign In to Pay via UPI</h1>
          <p className="text-muted-foreground max-w-sm">
            Please sign in to securely initialize your UPI payment gateway and track your order history.
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

  const cartItems = cartData?.items || [];
  const hasCartItems = cartItems.length > 0;

  if (!hasCartItems && !session) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 pt-32 pb-20">
          <QrCode className="w-16 h-16 text-slate-300" />
          <h1 className="text-4xl font-headline font-black text-slate-900">
            No Pending Items in Cart
          </h1>
          <p className="text-muted-foreground max-w-md">
            Add software modules to your cart to initiate a UPI checkout, or review your previous transactions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8 h-14 bg-primary text-white">
                Browse Modules
              </Button>
            </Link>
            <Link href="/payment-history">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14">
                <History className="w-4 h-4 mr-2" /> Payment History
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const displaySubtotal =
    session?.subtotal ??
    cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const displayGst = session?.gst ?? Math.round(displaySubtotal * 0.18 * 100) / 100;
  const displayTotal =
    session?.totalAmount ?? Math.round((displaySubtotal + displayGst) * 100) / 100;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <Navbar />

      <section className="pt-32 pb-24 relative z-10 flex-1">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          {/* Top Bar Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <Link
                href="/checkout/details"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Verification
              </Link>
              <h1 className="text-4xl md:text-6xl font-headline font-black text-slate-900 leading-none">
                UPI Payment <span className="text-primary">Gateway</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium">
                <span>Order {session?.orderId || "Initializing..."}</span>
                <span aria-hidden="true">·</span>
                <span>NPCI UPI Intent &amp; Auto Verification</span>
              </div>
            </div>

            <Link href="/payment-history">
              <Button variant="outline" className="rounded-xl h-11 px-5 border-slate-200 bg-white">
                <History className="w-4 h-4 mr-2" /> Payment History
              </Button>
            </Link>
          </div>

          {/* Outcome Banner for Success or Failed State */}
          {paymentOutcome === "success" && (
            <Card className="border border-emerald-200 bg-emerald-50 rounded-3xl shadow-sm">
              <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
                  <div className="space-y-1">
                    <h2 className="text-2xl font-headline font-black text-emerald-950">
                      UPI Payment Confirmed
                    </h2>
                    <p className="text-sm font-medium text-emerald-800">
                      Redirecting automatically to your confirmed order receipt...
                    </p>
                  </div>
                </div>
                <Loader2 className="w-6 h-6 animate-spin text-emerald-700 shrink-0" />
              </CardContent>
            </Card>
          )}

          {paymentOutcome === "failed" && (
            <Card className="border border-red-200 bg-red-50 rounded-3xl shadow-sm">
              <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <XCircle className="w-10 h-10 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h2 className="text-2xl font-headline font-black text-red-950">
                      Payment Failed — Order Not Confirmed
                    </h2>
                    <p className="text-sm font-medium text-red-800">
                      {failureMessage}
                    </p>
                    <p className="text-xs text-red-700">
                      This failed attempt has been logged in your Payment History. Your cart items remain saved.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <Button
                    onClick={() => initUpiSession(true)}
                    disabled={isInitializing}
                    className="rounded-xl h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-bold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Retry UPI Payment
                  </Button>
                  <Link href="/payment-history">
                    <Button variant="outline" className="rounded-xl h-12 px-6 border-red-200 bg-white text-red-800">
                      View Payment History
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Gateway Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: UPI QR + App Selector + Collect Request */}
            <div className="lg:col-span-7">
              <Card className="border border-slate-200/80 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardContent className="p-8 md:p-12 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">
                        Scan &amp; Pay via UPI
                      </p>
                      <h2 className="text-2xl font-headline font-black text-slate-900">
                        Instant UPI QR &amp; App Intent
                      </h2>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-muted-foreground font-medium">Amount Locked</p>
                      <p className="text-2xl font-headline font-black text-slate-900 tabular-nums">
                        ₹{displayTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* UPI App Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Select Preferred UPI App
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {UPI_APPS.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={cn(
                            "h-12 px-3 rounded-xl border-2 text-xs font-bold transition-all",
                            selectedUpiApp === app.id
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-300"
                          )}
                        >
                          {app.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-200/70 space-y-4">
                    {isInitializing || !session?.qrCodeDataUrl ? (
                      <div className="w-64 h-64 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-xs font-semibold">Generating dynamic UPI QR...</span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={session.qrCodeDataUrl}
                          alt="NPB Media Dynamic UPI Payment QR Code"
                          className="w-64 h-64 rounded-2xl bg-white p-2 shadow-sm border border-slate-100"
                        />
                        <div className="text-center space-y-1">
                          <p className="text-xs font-bold text-slate-700">
                            Scan with {selectedUpiApp} or any BHIM UPI App
                          </p>
                          <p className="text-[11px] font-mono text-muted-foreground tabular-nums">
                            Ref: {session.transactionRef}
                          </p>
                        </div>
                      </>
                    )}

                    {session?.upiIntentUrl && (
                      <Button
                        type="button"
                        onClick={handleOpenUpiApp}
                        disabled={paymentOutcome === "success" || paymentOutcome === "failed"}
                        className="w-full sm:w-auto rounded-xl h-12 px-6 bg-primary text-white hover:bg-primary/90 font-bold"
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        Pay ₹{displayTotal.toLocaleString("en-IN")} with {selectedUpiApp}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>

                  {/* Merchant UPI ID Copy */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Merchant UPI ID
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 font-mono text-base font-bold text-slate-800">
                        {session?.merchantUpiId || "pay@npbmedia"}
                      </div>
                      <Button
                        type="button"
                        onClick={copyUpiId}
                        variant="outline"
                        className="h-14 px-5 rounded-xl border-slate-200 hover:border-primary hover:text-primary"
                        aria-label="Copy UPI ID"
                      >
                        {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>

                  {/* Optional UPI Collect Request */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Or Request Payment to Your UPI ID (Optional)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        value={payerUpiId}
                        onChange={(e) => setPayerUpiId(e.target.value)}
                        placeholder="e.g. yourname@okaxis"
                        className="h-12 rounded-xl bg-slate-50 border-slate-200"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendCollectRequest}
                        disabled={!session || paymentOutcome === "success" || paymentOutcome === "failed"}
                        className="h-12 px-6 rounded-xl border-slate-200 font-bold shrink-0"
                      >
                        Send Collect Request
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Order Breakdown + Auto-Fetch & UTR Verification */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border border-slate-200/80 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-2xl font-headline font-black text-slate-900">
                    Order <span className="text-primary">Summary</span>
                  </h3>

                  <div className="space-y-3 max-h-44 overflow-y-auto pr-1">
                    {(session?.items || cartItems).map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-700 truncate pr-4">
                          {item.title} × {item.quantity}
                        </span>
                        <span className="font-bold text-slate-900 tabular-nums shrink-0">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-slate-100 w-full" />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        ₹{displaySubtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>GST (18%)</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        ₹{displayGst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="h-px bg-slate-100 w-full" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Total Payable
                      </span>
                      <span className="text-3xl font-headline font-black text-primary tabular-nums">
                        ₹{displayTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Auto-Fetch & UPI Verification Box */}
              <Card className="border border-slate-200/80 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-xl font-headline font-black text-slate-900">
                        Verify UPI Payment
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Enter your 12-digit UPI UTR / Reference Number after completing payment. Successful payments auto-redirect to Order Confirmation.
                      </p>
                    </div>
                    {isAutoFetching && (
                      <RefreshCw className="w-5 h-5 text-primary animate-spin shrink-0 mt-1" />
                    )}
                  </div>

                  {isAutoFetching && paymentOutcome === "pending" && (
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs font-semibold text-blue-900">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        Auto-fetching UPI status (Attempt #{autoFetchAttempts + 1})...
                      </span>
                    </div>
                  )}

                  <form onSubmit={handleVerifyUpiPayment} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        12-Digit UPI UTR / Reference Number
                      </label>
                      <Input
                        value={utrNumber}
                        onChange={(e) =>
                          setUtrNumber(e.target.value.replace(/\D/g, "").slice(0, 12))
                        }
                        placeholder="Enter 12-digit UTR (e.g. 432910847261)"
                        inputMode="numeric"
                        maxLength={12}
                        disabled={
                          isVerifying ||
                          paymentOutcome === "success" ||
                          paymentOutcome === "failed"
                        }
                        className="h-14 rounded-xl bg-slate-50 border-slate-200 font-mono text-base tracking-wider"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        isVerifying ||
                        isInitializing ||
                        !session ||
                        paymentOutcome === "success" ||
                        paymentOutcome === "failed"
                      }
                      className="w-full h-14 rounded-2xl text-base font-headline font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Verifying UPI Status...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          {utrNumber.trim()
                            ? "Verify UPI & Confirm Order"
                            : "Start Auto-Fetch Status"}
                        </>
                      )}
                    </Button>
                  </form>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleMarkPaymentFailed}
                    disabled={
                      isVerifying ||
                      !session ||
                      paymentOutcome === "success" ||
                      paymentOutcome === "failed"
                    }
                    className="w-full h-12 rounded-2xl border-red-200 text-red-700 hover:bg-red-50 font-bold text-xs uppercase tracking-wider"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Cancel / Report Payment Failed
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

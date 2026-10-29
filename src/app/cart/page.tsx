
"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Loader2,
  PackageOpen,
  ChevronLeft,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const cartRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "carts", user.uid);
  }, [user, db]);

  const { data: cartData, isLoading: isCartLoading } = useDoc(cartRef);

  if (isUserLoading || isCartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-black italic">Sign In Required</h1>
          <p className="text-muted-foreground font-medium max-w-sm mx-auto">Please log in to your account to view your Media Cart and manage your selections.</p>
        </div>
        <Link href="/login">
          <Button size="lg" className="rounded-full px-12 h-16 text-lg font-headline bg-primary text-white shadow-xl shadow-primary/20">
            Access Portal
          </Button>
        </Link>
      </main>
    );
  }

  const items = cartData?.items || [];
  const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // Example GST
  const total = subtotal + tax;

  const updateQuantity = (productId: string, delta: number) => {
    if (!cartRef) return;
    const newItems = items.map((item: any) => {
      if (item.productId === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    const newSubtotal = newItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    updateDocumentNonBlocking(cartRef, { items: newItems, totalAmount: newSubtotal, updatedAt: new Date().toISOString() });
  };

  const removeItem = (productId: string) => {
    if (!cartRef) return;
    const newItems = items.filter((item: any) => item.productId !== productId);
    const newSubtotal = newItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    updateDocumentNonBlocking(cartRef, { items: newItems, totalAmount: newSubtotal, updatedAt: new Date().toISOString() });
    toast({ title: "Item Removed", description: "The product has been cleared from your cart." });
  };

  const clearCart = () => {
    if (!cartRef) return;
    updateDocumentNonBlocking(cartRef, { items: [], totalAmount: 0, updatedAt: new Date().toISOString() });
    toast({ title: "Cart Cleared", description: "All items have been removed from your selection." });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />

      <section className="pt-32 pb-24 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Left Side: Items List */}
              <div className="lg:col-span-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6 gap-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-headline font-black italic">Selected <span className="text-primary">Packages</span></h2>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{items.length} Modules in Cart</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={clearCart}
                    className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-black uppercase tracking-widest text-[10px] h-10 px-6 border-2 border-transparent hover:border-destructive/20 transition-all self-start sm:self-center"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Clear Entire Cart
                  </Button>
                </div>

                <div className="space-y-6">
                  {items.map((item: any) => (
                    <Card key={item.productId} className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                      <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 rounded-2xl bg-slate-100 relative overflow-hidden flex-shrink-0 border-2 border-slate-50">
                          <Image 
                            src={item.image || "https://picsum.photos/seed/cart/200/200"} 
                            alt={item.title}
                            fill
                            className="object-cover"
                            data-ai-hint="product image"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-2 text-center md:text-left">
                          <h3 className="text-2xl font-headline font-black italic transition-colors group-hover:text-primary">{item.title}</h3>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Enterprise Module</p>
                          <div className="text-primary font-black text-xl">₹{item.price.toLocaleString()}</div>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
                          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border-2 border-slate-100">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => updateQuantity(item.productId, -1)}
                              className="rounded-xl hover:bg-white transition-all h-10 w-10 shadow-sm"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-black text-lg">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => updateQuantity(item.productId, 1)}
                              className="rounded-xl hover:bg-white transition-all h-10 w-10 shadow-sm"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button 
                            variant="outline" 
                            onClick={() => removeItem(item.productId)}
                            className="rounded-xl border-slate-200 hover:bg-destructive hover:text-white hover:border-destructive transition-all font-black uppercase text-[10px] tracking-widest h-10 px-6 w-full md:w-auto"
                          >
                            <X className="w-3 h-3 mr-2" /> Remove Product
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Right Side: Order Summary */}
              <div className="lg:col-span-4">
                <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] bg-white overflow-hidden p-2 sticky top-32">
                  <div className="p-10 space-y-10">
                    <h3 className="text-3xl font-headline font-black italic">Module <span className="text-primary">Summary</span></h3>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        <span>IGST (18%)</span>
                        <span className="text-foreground">₹{tax.toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-slate-100 w-full" />
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Total Investment</p>
                          <p className="text-4xl font-headline font-black text-primary">₹{total.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Link href="/checkout/details">
                        <Button size="lg" className="w-full h-20 rounded-[2rem] text-xl font-headline bg-primary text-white hover:bg-foreground transition-all duration-500 shadow-2xl group active:scale-95 border-none">
                          Checkout Now <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-4" />
                        </Button>
                      </Link>
                      <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure AES-256 Encrypted Gateway
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100 space-y-4">
                      <div className="flex items-center gap-3">
                        <Zap className="text-yellow-500 w-5 h-5" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Instant Activation</h4>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">
                        Purchased modules are instantly added to your dashboard and ready for project deployment.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-32 space-y-10 animate-in fade-in zoom-in duration-700">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                <PackageOpen className="w-16 h-16 text-slate-200" />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-headline font-black italic">Your Cart is <span className="text-primary">Empty</span></h2>
                <p className="text-muted-foreground text-xl max-w-md mx-auto font-medium leading-relaxed">Explore our ecosystem of enterprise tools and software solutions to start building.</p>
              </div>
              <Link href="/products">
                <Button size="lg" className="rounded-full px-12 h-20 text-xl font-headline bg-primary text-white shadow-2xl hover:scale-105 transition-all">
                  Explore Ecosystem
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

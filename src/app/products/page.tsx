
"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Sparkles, 
  ArrowRight, 
  Rocket, 
  Zap, 
  Layers,
  ShieldCheck,
  Globe,
  ShoppingCart,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking, useCollection } from "@/firebase";
import { doc, collection, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Fetch live products from Firestore
  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "products"), orderBy("title", "asc"));
  }, [db]);
  const { data: liveProducts, isLoading: isProductsLoading } = useCollection(productsQuery);

  // Fetch current cart
  const cartRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "carts", user.uid);
  }, [user, db]);
  const { data: cartData } = useDoc(cartRef);

  const handleAddToCart = (product: any) => {
    if (!user) {
      toast({ 
        title: "Auth Protocol Required", 
        description: "Please sign in to add modules to your cart." 
      });
      router.push("/login");
      return;
    }

    setLoadingId(product.id);

    const currentItems = cartData?.items || [];
    const existingItemIndex = currentItems.findIndex((item: any) => item.productId === product.id);
    
    let newItems;
    if (existingItemIndex > -1) {
      newItems = [...currentItems];
      newItems[existingItemIndex].quantity += 1;
    } else {
      newItems = [
        ...currentItems,
        {
          productId: product.id,
          title: product.title,
          price: product.marketValue,
          quantity: 1,
          image: `https://picsum.photos/seed/${product.id}/400/400`
        }
      ];
    }

    const cartPayload = {
      userId: user.uid,
      items: newItems,
      totalAmount: newItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0),
      updatedAt: new Date().toISOString()
    };

    if (!cartData) {
      setDocumentNonBlocking(cartRef!, { ...cartPayload, createdAt: new Date().toISOString() }, { merge: true });
    } else {
      updateDocumentNonBlocking(cartRef!, cartPayload);
    }

    setTimeout(() => {
      setLoadingId(null);
      toast({
        title: "Added to Cart",
        description: `${product.title} has been staged for checkout.`,
      });
      router.push("/cart");
    }, 600);
  };

  if (isProductsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero Overview Section */}
      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/20 border-2 border-white/30 text-white text-sm font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
                <Package className="w-5 h-5 text-yellow-300" />
                Software Marketplace
              </div>
              <h1 className="text-6xl md:text-8xl font-headline font-black leading-[0.9] tracking-tighter drop-shadow-2xl">
                The Next Gen <span className="italic text-yellow-300">Digital Tools</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-bold border-l-4 border-yellow-300 pl-6">
                Provision high-performance software modules tailored for global business growth. Choose your stack and start building.
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-3 text-white/80 font-black uppercase tracking-widest text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Enterprise Grade
                </div>
                <div className="flex items-center gap-3 text-white/80 font-black uppercase tracking-widest text-xs">
                  <Globe className="w-5 h-5 text-blue-400" /> Secure Provisioning
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="p-12 bg-white/10 backdrop-blur-xl rounded-[4rem] border border-white/20 shadow-2xl space-y-8">
                <div className="w-20 h-20 bg-yellow-300 rounded-3xl flex items-center justify-center rotate-12 shadow-2xl">
                  <Rocket className="text-primary w-10 h-10" />
                </div>
                <h3 className="text-4xl font-headline font-black italic">Building the Future</h3>
                <p className="text-lg font-medium leading-relaxed opacity-90">
                  Access our proprietary lineup of scalable infrastructure tools and bespoke software products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-headline font-black italic">Select Your <span className="text-primary">Modules</span></h2>
            <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto">High-performance digital products with transparent market values.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {liveProducts && liveProducts.length > 0 ? (
              liveProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="group border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
                >
                  <div className={cn(
                    "h-48 flex flex-col items-center justify-center text-white relative transition-all duration-700",
                    product.color || "bg-orange-500"
                  )}>
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Package className="w-16 h-16 mb-2 transition-all duration-700 group-hover:scale-75 group-hover:rotate-12 relative z-10" />
                    <div className="absolute top-6 right-6">
                      <Zap className="w-5 h-5 text-white/40 group-hover:text-yellow-300 transition-colors" />
                    </div>
                  </div>

                  <CardContent className="flex-1 p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-headline font-black italic leading-tight group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-muted-foreground text-sm font-semibold leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                      <div className="space-y-2">
                        {product.features?.map((feature: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                      <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Market Value</p>
                          <p className="text-2xl font-headline font-black text-primary">₹{product.marketValue?.toLocaleString()}</p>
                        </div>
                        <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-black text-[8px] uppercase tracking-widest px-3 py-1">Verified</Badge>
                      </div>

                      <Button 
                        onClick={() => handleAddToCart(product)}
                        disabled={loadingId === product.id}
                        className="w-full rounded-2xl h-14 bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all group/btn border-none"
                      >
                        {loadingId === product.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Add to Cart <ShoppingCart className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground font-black uppercase tracking-widest text-sm italic">Catalog synchronizing...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12 relative z-10">
          <h2 className="text-4xl md:text-6xl font-headline font-black italic">Need a Custom Solution <span className="text-primary">Now?</span></h2>
          <p className="text-white/60 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            While our modules cover core enterprise needs, our expert team is available to build bespoke software tailored specifically to your unique vision.
          </p>
          <div className="flex justify-center">
            <Link href="/contact">
              <Button size="lg" className="rounded-full px-16 h-20 text-xl font-headline bg-primary text-white hover:bg-white hover:text-primary transition-all duration-500 shadow-2xl group active:scale-95 border-none">
                Talk to Our Team <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

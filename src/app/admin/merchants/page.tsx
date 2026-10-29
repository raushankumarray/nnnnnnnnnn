"use client";

import React, { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, orderBy } from "firebase/firestore";
import { 
  Plus, 
  Store, 
  Trash2, 
  Edit3, 
  Loader2,
  ShieldCheck,
  Zap,
  Layout,
  ExternalLink,
  ShieldAlert,
  User,
  Lock,
  Mail,
  Phone,
  Power,
  CreditCard
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PLANS = ["Basic", "Professional", "Enterprise", "Ultimate"];

export default function AdminMerchantsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    shopName: "",
    email: "",
    phone: "",
    userId: "",
    password: "",
    plan: "Basic",
    status: "active"
  });

  const merchantsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "merchants"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: merchants, isLoading } = useCollection(merchantsQuery);

  const resetForm = () => {
    setFormData({
      shopName: "",
      email: "",
      phone: "",
      userId: "",
      password: "",
      plan: "Basic",
      status: "active"
    });
    setEditingMerchant(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    if (editingMerchant) {
      updateDocumentNonBlocking(doc(db, "merchants", editingMerchant.id), formData);
      toast({ title: "Account Synchronized", description: "Merchant credentials updated." });
    } else {
      addDocumentNonBlocking(collection(db, "merchants"), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      toast({ title: "Merchant Created", description: "Access credentials provisioned successfully." });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const toggleStatus = (merchant: any) => {
    if (!db) return;
    const newStatus = merchant.status === 'active' ? 'disabled' : 'active';
    updateDocumentNonBlocking(doc(db, "merchants", merchant.id), { status: newStatus });
    toast({ 
      title: newStatus === 'active' ? "Access Restored" : "Access Terminated", 
      description: `Merchant status changed to ${newStatus.toUpperCase()}.` 
    });
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    if (confirm("Permanently purge this merchant account and all associated billing data?")) {
      deleteDocumentNonBlocking(doc(db, "merchants", id));
      toast({ variant: "destructive", title: "Account Purged", description: "Merchant removed from registry." });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-headline font-black italic text-white uppercase tracking-tighter">
            Merchant <span className="text-primary">Registry</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Billing Software Provisioning Module</p>
        </div>
        
        <Button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/10 border-none"
        >
          <Plus className="w-4 h-4 mr-2" /> Initialize New Merchant
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {merchants && merchants.length > 0 ? (
          merchants.map((merchant) => (
            <Card key={merchant.id} className="bg-slate-900/50 border-slate-800/50 rounded-[3rem] overflow-hidden group hover:bg-slate-900 transition-all duration-500 border-2">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                    <Store className="w-7 h-7" />
                  </div>
                  <Badge className={cn(
                    "text-[8px] font-black uppercase tracking-widest border-none px-3 py-1 shadow-lg",
                    merchant.status === 'active' ? "bg-emerald-600" : "bg-rose-600 animate-pulse"
                  )}>
                    {merchant.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-black italic text-white leading-tight">{merchant.shopName}</h3>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                      <User className="w-3 h-3 text-primary" /> UID: <span className="text-white">{merchant.userId}</span>
                    </p>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                      <CreditCard className="w-3 h-3 text-primary" /> PLAN: <span className="text-primary">{merchant.plan}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                    <Mail className="w-3.5 h-3.5" /> {merchant.email}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                    <Phone className="w-3.5 h-3.5" /> {merchant.phone}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => { setEditingMerchant(merchant); setFormData(merchant); setIsModalOpen(true); }}
                      className="rounded-xl border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => toggleStatus(merchant)}
                      className={cn(
                        "rounded-xl border-slate-800 bg-slate-900",
                        merchant.status === 'active' ? "text-slate-400 hover:text-rose-500" : "text-emerald-500 hover:text-emerald-400"
                      )}
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(merchant.id)}
                      className="rounded-xl border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Link href="/billing/login" target="_blank">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-32 space-y-6 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-slate-800">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <Zap className="w-10 h-10 text-slate-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-black italic text-slate-600 uppercase tracking-tighter">Merchant Matrix Null</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Initialize first billing account to start operations</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl bg-slate-950 border-slate-800 text-white rounded-[3rem] p-0 overflow-hidden">
          <div className="bg-slate-900 p-8 border-b border-slate-800">
            <DialogTitle className="text-3xl font-headline font-black italic uppercase tracking-tighter">
              {editingMerchant ? "Synchronize" : "Initialize"} <span className="text-primary">Account</span>
            </DialogTitle>
            <DialogDescription className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Resource Matrix Allocation Protocol</DialogDescription>
          </div>
          
          <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Shop / Business Name</Label>
                <div className="relative">
                  <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input required value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary pl-14" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Service Plan</Label>
                <Select value={formData.plan} onValueChange={val => setFormData({...formData, plan: val})}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:ring-primary px-6">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 border-slate-800 text-white rounded-xl">
                    {PLANS.map(p => (
                      <SelectItem key={p} value={p} className="py-3">{p} Tier</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Business Email</Label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary pl-14" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary pl-14" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Login User ID</Label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <Input required value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary pl-14 font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Login Password</Label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <Input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary pl-14 font-mono" />
                </div>
              </div>
            </div>
          </form>

          <DialogFooter className="p-8 bg-slate-900 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-full text-[10px] font-black uppercase tracking-widest">Abort</Button>
            <Button onClick={handleSubmit} className="h-14 px-10 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all border-none">
              {editingMerchant ? "Synchronize Provisioning" : "Confirm Initialization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

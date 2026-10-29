
"use client";

import React, { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, orderBy } from "firebase/firestore";
import { 
  Plus, 
  Package, 
  Trash2, 
  Edit3, 
  Loader2,
  DollarSign,
  Zap,
  Layout,
  ExternalLink,
  Layers,
  CheckCircle2
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const COLOR_OPTIONS = [
  { label: "Vibrant Orange", value: "bg-orange-500" },
  { label: "Deep Blue", value: "bg-blue-600" },
  { label: "Emerald Green", value: "bg-emerald-600" },
  { label: "Indigo Power", value: "bg-indigo-600" },
  { label: "Purple Edge", value: "bg-purple-600" },
  { label: "Cyber Pink", value: "bg-pink-600" },
  { label: "Rose Petal", value: "bg-rose-600" },
  { label: "Cyan Neon", value: "bg-cyan-600" },
];

export default function AdminProductsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    marketValue: "",
    features: "",
    color: "bg-orange-500",
  });

  const productsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "products"), orderBy("title", "asc"));
  }, [db]);

  const { data: products, isLoading } = useCollection(productsQuery);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      marketValue: "",
      features: "",
      color: "bg-orange-500",
    });
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    const payload = {
      ...formData,
      marketValue: Number(formData.marketValue),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ""),
      updatedAt: new Date().toISOString()
    };

    if (editingProduct) {
      updateDocumentNonBlocking(doc(db, "products", editingProduct.id), payload);
      toast({ title: "Registry Updated", description: "Product specs synchronized successfully." });
    } else {
      addDocumentNonBlocking(collection(db, "products"), {
        ...payload,
        id: `PROD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: new Date().toISOString()
      });
      toast({ title: "Marketplace Live", description: "New software module has been published." });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      marketValue: product.marketValue.toString(),
      features: product.features.join(', '),
      color: product.color || "bg-orange-500",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!db) return;
    if (confirm("Confirm permanent removal of this module from the marketplace?")) {
      deleteDocumentNonBlocking(doc(db, "products", id));
      toast({ variant: "destructive", title: "Resource Purged", description: "Product removed from ecosystem." });
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
            Product <span className="text-primary">Ecosystem</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Operational Inventory Matrix Module</p>
        </div>
        
        <Button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/10 border-none"
        >
          <Plus className="w-4 h-4 mr-2" /> Initialize New Module
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products && products.length > 0 ? (
          products.map((product) => (
            <Card key={product.id} className="bg-slate-900/50 border-slate-800/50 rounded-[3rem] overflow-hidden group hover:bg-slate-900 transition-all duration-500 border-2">
              <div className={cn("h-32 flex items-center justify-center text-white relative", product.color)}>
                <Package className="w-12 h-12" />
                <div className="absolute top-4 right-6">
                  <Zap className="w-4 h-4 text-white/30" />
                </div>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-black italic text-white leading-tight">{product.title}</h3>
                  <p className="text-slate-500 text-xs font-medium line-clamp-2">{product.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.features?.slice(0, 3).map((f: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-800 bg-slate-950/50 text-slate-400">
                      {f}
                    </Badge>
                  ))}
                  {product.features?.length > 3 && <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-800 bg-slate-950/50 text-slate-400">+{product.features.length - 3}</Badge>}
                </div>

                <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Market Value</p>
                    <p className="text-xl font-headline font-black text-primary">₹{product.marketValue?.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEdit(product)}
                      className="rounded-xl border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(product.id)}
                      className="rounded-xl border-slate-800 bg-slate-900 text-slate-400 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-32 space-y-6 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-slate-800">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <Layers className="w-10 h-10 text-slate-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-black italic text-slate-600 uppercase tracking-tighter">Inventory Matrix Null</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Awaiting first marketplace module initialization</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl bg-slate-950 border-slate-800 text-white rounded-[3rem] p-0 overflow-hidden">
          <div className="bg-slate-900 p-8 border-b border-slate-800">
            <DialogTitle className="text-3xl font-headline font-black italic uppercase tracking-tighter">
              {editingProduct ? "Synchronize" : "Initialize"} <span className="text-primary">Module</span>
            </DialogTitle>
            <DialogDescription className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Resource Matrix Allocation Protocol</DialogDescription>
          </div>
          
          <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Product Title</Label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary px-6" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Market Value (INR)</Label>
                <Input required type="number" value={formData.marketValue} onChange={e => setFormData({...formData, marketValue: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary px-6" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Display Theme</Label>
                <Select value={formData.color} onValueChange={val => setFormData({...formData, color: val})}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:ring-primary text-sm px-6">
                    <SelectValue placeholder="Choose Accent" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 border-slate-800 text-white rounded-xl">
                    {COLOR_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-4 h-4 rounded-full", opt.value)} />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Core Features (Comma separated)</Label>
              <Input placeholder="SEO Optimized, Responsive UI, Admin Dashboard..." value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="h-14 rounded-2xl border-slate-800 bg-slate-900 focus:border-primary px-6" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Executive Description</Label>
              <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-[150px] rounded-2xl border-slate-800 bg-slate-900 focus:border-primary p-6 resize-none" />
            </div>
          </form>

          <DialogFooter className="p-8 bg-slate-900 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-full text-[10px] font-black uppercase tracking-widest">Abort</Button>
            <Button onClick={handleSubmit} className="h-14 px-10 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all border-none">
              {editingProduct ? "Synchronize Specs" : "Confirm Initialization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

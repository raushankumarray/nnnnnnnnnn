"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Plus, 
  FileUp, 
  Edit3,
  Search, 
  Filter, 
  Loader2, 
  Box, 
  AlertCircle,
  Calendar,
  Building2,
  Package,
  IndianRupee,
  Download,
  Trash2
} from "lucide-react";
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase, 
  addDocumentNonBlocking, 
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking
} from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function AddInventoryPage() {
  const [merchant, setMerchant] = useState<any>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [stockStatus, setStockStatus] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const db = useFirestore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    company: "",
    itemName: "",
    stock: "",
    expiryDate: "",
    price: ""
  });

  useEffect(() => {
    const session = localStorage.getItem("npb_merchant_session");
    if (session) {
      setMerchant(JSON.parse(session));
    }
  }, []);

  const inventoryQuery = useMemoFirebase(() => {
    if (!db || !merchant?.id) return null;
    return query(
      collection(db, "merchants", merchant.id, "inventory"),
      orderBy("updatedAt", "desc")
    );
  }, [db, merchant?.id]);

  const { data: inventory, isLoading } = useCollection(inventoryQuery);

  const companies = useMemo(() => {
    if (!inventory) return [];
    return Array.from(new Set(inventory.map(item => item.company))).filter(Boolean);
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    if (!inventory) return [];
    return inventory.filter(item => {
      const matchesSearch = item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.company?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCompany = companyFilter === "all" || item.company === companyFilter;
      const matchesStock = stockStatus === "all" ? true :
                          stockStatus === "out" ? Number(item.stock) <= 0 :
                          stockStatus === "low" ? Number(item.stock) > 0 && Number(item.stock) < 10 : true;
      
      return matchesSearch && matchesCompany && matchesStock;
    });
  }, [inventory, searchTerm, companyFilter, stockStatus]);

  const resetForm = () => {
    setFormData({ company: "", itemName: "", stock: "", expiryDate: "", price: "" });
    setEditingItem(null);
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !merchant?.id) return;
    setIsSubmitting(true);

    const payload = {
      ...formData,
      stock: Number(formData.stock),
      price: Number(formData.price),
      updatedAt: new Date().toISOString()
    };

    if (editingItem) {
      updateDocumentNonBlocking(doc(db, "merchants", merchant.id, "inventory", editingItem.id), payload);
      toast({ title: "Registry Synchronized", description: `${formData.itemName} specs updated.` });
    } else {
      addDocumentNonBlocking(collection(db, "merchants", merchant.id, "inventory"), payload);
      toast({ title: "Stock Initialized", description: `${formData.itemName} added to registry.` });
    }
    
    setIsManualModalOpen(false);
    resetForm();
    setIsSubmitting(false);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      company: item.company || "",
      itemName: item.itemName || "",
      stock: item.stock?.toString() || "",
      expiryDate: item.expiryDate || "",
      price: item.price?.toString() || ""
    });
    setIsManualModalOpen(true);
  };

  const handleDelete = (id: string, itemName: string) => {
    if (!db || !merchant?.id) return;
    if (confirm(`Are you sure you want to permanently purge ${itemName} from the inventory registry?`)) {
      deleteDocumentNonBlocking(doc(db, "merchants", merchant.id, "inventory", id));
      toast({ variant: "destructive", title: "Resource Purged", description: `${itemName} removed from local node.` });
    }
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !db || !merchant?.id) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n');
      
      let count = 0;
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(v => v.trim());
        if (row.length < 5) continue;

        const item = {
          company: row[0],
          itemName: row[1],
          stock: Number(row[2]),
          expiryDate: row[3],
          price: Number(row[4]),
          updatedAt: new Date().toISOString()
        };

        addDocumentNonBlocking(collection(db, "merchants", merchant.id, "inventory"), item);
        count++;
      }

      toast({ title: "Bulk Sync Complete", description: `${count} items processed and uploaded.` });
      setIsUploadModalOpen(false);
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csvContent = "Company,Product Name,Quantity,Expiry Date (YYYY-MM-DD),Price\nSamsung,Galaxy S24,50,2026-12-31,79999\nApple,iPhone 15,30,2027-01-15,69999";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "inventory_template.csv";
    a.click();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Intelligence */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 shadow-sm">
            <Package className="w-4 h-4" /> Inventory Matrix Control
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic text-slate-900 leading-none tracking-tighter">
            Stock <br />
            <span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Operational node: <span className="text-slate-900 font-bold">{merchant?.shopName || 'Merchant'}</span></p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            variant="outline"
            className="h-16 px-8 rounded-[2rem] border-2 border-slate-100 hover:border-primary hover:bg-primary/5 text-slate-600 font-black uppercase text-xs tracking-widest transition-all"
          >
            <FileUp className="mr-2 w-5 h-5" /> Bulk Sync
          </Button>
          <Button 
            onClick={() => { resetForm(); setIsManualModalOpen(true); }}
            className="h-16 px-10 rounded-[2rem] bg-primary text-white font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 border-none"
          >
            <Plus className="mr-2 w-5 h-5" /> Initialize Stock
          </Button>
        </div>
      </div>

      {/* Filter Terminal */}
      <div className="p-8 bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Inventory Search Terminal</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Product Search</Label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Product or Company..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-14 rounded-2xl bg-slate-50 border-slate-100 pl-12 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Filter by Company</Label>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 px-6">
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Registry</SelectItem>
                {companies.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Stock Intelligence</Label>
            <Select value={stockStatus} onValueChange={setStockStatus}>
              <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 px-6">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Full Inventory</SelectItem>
                <SelectItem value="out" className="text-rose-500 font-bold">Not in Stock</SelectItem>
                <SelectItem value="low" className="text-orange-500 font-bold">Low Availability</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end pb-1">
            <Button 
              variant="ghost" 
              onClick={() => { setSearchTerm(""); setCompanyFilter("all"); setStockStatus("all"); }}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Registry Table */}
      <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-32 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="font-black uppercase text-[10px] tracking-widest text-slate-400">Accessing Cloud Node...</p>
            </div>
          ) : filteredInventory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Company & Product</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Availability</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Expiry Profile</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Market Price</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="p-8">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">{item.company}</p>
                          <p className="font-headline font-black italic text-lg text-slate-900">{item.itemName}</p>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            item.stock <= 0 ? "bg-rose-500 animate-pulse" : 
                            item.stock < 10 ? "bg-orange-500" : "bg-emerald-500"
                          )} />
                          <p className="font-bold text-slate-700">{item.stock} Units</p>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-2 text-slate-500 font-medium italic">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {item.expiryDate || "No Expiry"}
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <p className="text-xl font-headline font-black italic text-slate-900">₹{item.price?.toLocaleString()}</p>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(item)}
                            className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                          >
                            <Edit3 className="w-5 h-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(item.id, item.itemName)}
                            className="rounded-xl hover:bg-rose-50/50 hover:text-rose-600 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-32 text-center space-y-6">
              <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto text-slate-200">
                <Box className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-headline font-black italic text-slate-400 uppercase tracking-tighter">Inventory Node Silent</h3>
                <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto">No inventory records matching your criteria were detected in the cloud registry.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Entry Modal */}
      <Dialog open={isManualModalOpen} onOpenChange={(open) => { setIsManualModalOpen(open); if(!open) resetForm(); }}>
        <DialogContent className="max-w-4xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-900 p-10 text-white space-y-2">
            <DialogTitle className="text-3xl font-headline font-black italic uppercase tracking-tighter">
              Registry <span className="text-primary">{editingItem ? "Synchronization" : "Initialization"}</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              {editingItem ? "Modifying existing stock parameters" : "Manual Stock Protocol"}
            </DialogDescription>
          </div>
          
          <form onSubmit={handleManualAdd} className="p-10 space-y-8 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Manufacturing Company</Label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required 
                    value={formData.company} 
                    onChange={e => setFormData({...formData, company: e.target.value})} 
                    placeholder="e.g. Samsung" 
                    className="flex h-14 w-full rounded-2xl border-2 border-slate-100 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-12" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Product Specification</Label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required 
                    value={formData.itemName} 
                    onChange={e => setFormData({...formData, itemName: e.target.value})} 
                    placeholder="e.g. Galaxy S24" 
                    className="flex h-14 w-full rounded-2xl border-2 border-slate-100 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-12" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Available Quantity</Label>
                <input 
                  required 
                  type="number" 
                  value={formData.stock} 
                  onChange={e => setFormData({...formData, stock: e.target.value})} 
                  placeholder="0" 
                  className="flex h-14 w-full rounded-2xl border-2 border-slate-100 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm px-6" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Market Price (Per Unit)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required 
                    type="number" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    placeholder="0.00" 
                    className="flex h-14 w-full rounded-2xl border-2 border-slate-100 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-12" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Registry Expiry Profile</Label>
                <input 
                  type="date" 
                  value={formData.expiryDate} 
                  onChange={e => setFormData({...formData, expiryDate: e.target.value})} 
                  className="flex h-14 w-full rounded-2xl border-2 border-slate-100 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm px-6" 
                />
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button type="button" variant="ghost" onClick={() => setIsManualModalOpen(false)} className="rounded-full text-[10px] font-black uppercase tracking-widest">Abort Protocol</Button>
              <Button 
                disabled={isSubmitting}
                className="h-14 px-10 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 transition-all border-none"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingItem ? "Authorize Update" : "Authorize Sync")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-primary p-10 text-white space-y-2">
            <DialogTitle className="text-3xl font-headline font-black italic uppercase tracking-tighter">Bulk <span className="text-slate-900">Synchronization</span></DialogTitle>
            <DialogDescription className="text-white/80 text-[10px] font-black uppercase tracking-widest">Inventory Ledger Batch Import</DialogDescription>
          </div>
          
          <div className="p-12 space-y-8 bg-white">
            <div className="text-center space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-48 border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-xl transition-all">
                  <FileUp className="w-8 h-8 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-600">Select Inventory Ledger (.csv)</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Protocol: Company, Item, Stock, Expiry, Price</p>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleBulkUpload} />
              </div>

              <div className="pt-4 flex flex-col items-center gap-4">
                <Button variant="ghost" onClick={downloadTemplate} className="text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/10">
                  <Download className="mr-2 w-4 h-4" /> Download Format Template
                </Button>
                <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600 text-left max-w-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-[10px] font-bold leading-relaxed">Ensure your file follows the required protocol exactly for correct cloud synchronization.</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

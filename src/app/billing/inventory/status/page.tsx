"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  PackageSearch, 
  Search, 
  Filter, 
  FileDown, 
  Loader2, 
  Box, 
  Calendar,
  IndianRupee,
  ChevronDown,
  AlertCircle,
  TrendingDown,
  Clock,
  Layout,
  ArrowRight,
  ListFilter,
  ShieldAlert
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function StockStatusPage() {
  const [merchant, setMerchant] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [stockStatus, setStockStatus] = useState("all");

  const db = useFirestore();
  const { toast } = useToast();

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
    const today = new Date().toISOString().split('T')[0];

    return inventory.filter(item => {
      // Basic Search
      const matchesSearch = 
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.company?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Company Filter
      const matchesCompany = companyFilter === "all" || item.company === companyFilter;
      
      // Stock & Expiry Level Filter
      let matchesStock = true;
      if (stockStatus === "out") {
        matchesStock = Number(item.stock) <= 0;
      } else if (stockStatus === "low") {
        matchesStock = Number(item.stock) > 0 && Number(item.stock) < 10;
      } else if (stockStatus === "expired") {
        matchesStock = item.expiryDate && item.expiryDate < today;
      }
      
      return matchesSearch && matchesCompany && matchesStock;
    });
  }, [inventory, searchTerm, companyFilter, stockStatus]);

  const downloadReport = (mode: 'all' | 'filtered' | 'out_of_stock') => {
    let dataToExport = [];
    let filename = "Inventory_Status_Report.csv";

    switch(mode) {
      case 'all':
        dataToExport = inventory || [];
        filename = "Complete_Inventory_Ledger.csv";
        break;
      case 'filtered':
        dataToExport = filteredInventory;
        filename = `Filtered_Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'out_of_stock':
        dataToExport = inventory?.filter(item => item.stock <= 0) || [];
        filename = "Critical_Out_Of_Stock.csv";
        break;
    }

    if (dataToExport.length === 0) {
      toast({ variant: "destructive", title: "Export Error", description: "No records found for the selected reporting protocol." });
      return;
    }

    const headers = ["Company", "Product Name", "Current Stock", "Price (INR)", "Expiry Date", "Last Synchronized"];
    const rows = dataToExport.map(item => [
      `"${item.company}"`,
      `"${item.itemName}"`,
      item.stock,
      item.price,
      item.expiryDate || "N/A",
      new Date(item.updatedAt).toLocaleString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    toast({ title: "Report Exported", description: `${filename} has been saved to your downloads.` });
  };

  const isFilterActive = searchTerm || companyFilter !== 'all' || stockStatus !== 'all';

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 shadow-sm">
            <Clock className="w-4 h-4" /> Operational Monitor v2.6
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic text-slate-900 leading-none tracking-tighter">
            Inventory <br />
            <span className="text-primary">Status</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Registry Node: <span className="text-slate-900 font-bold">{merchant?.shopName || 'Merchant'}</span></p>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="h-16 px-10 rounded-[2rem] bg-slate-900 text-white font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20 border-none"
              >
                <FileDown className="mr-2 w-5 h-5" /> Reporting Gateway <ChevronDown className="ml-2 w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 rounded-2xl p-2 border-none shadow-2xl">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 p-4">Select Protocol</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => downloadReport('filtered')} className={cn("rounded-xl h-12 px-4 cursor-pointer gap-3", isFilterActive && "bg-primary/5 text-primary")}>
                <ListFilter className="w-4 h-4" />
                <span className="text-xs font-bold">Filtered Ledger (Current View)</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => downloadReport('all')} className="rounded-xl h-12 px-4 cursor-pointer gap-3">
                <Layout className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-700">Full Inventory Node</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => downloadReport('out_of_stock')} className="rounded-xl h-12 px-4 cursor-pointer gap-3">
                <TrendingDown className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-slate-700">Critical Stock Only</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Intelligence Terminal (Filters) */}
      <div className="p-8 bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Inventory Multi-Filter Terminal</h3>
          </div>
          {isFilterActive && (
            <Badge className="bg-primary text-white border-none animate-in fade-in zoom-in">Filters Active</Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Quick Search</Label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Product or Brand..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-14 rounded-2xl bg-slate-50 border-slate-100 pl-12 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Brand Origin</Label>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 px-6">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Full Registry</SelectItem>
                {companies.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Inventory Intelligence</Label>
            <Select value={stockStatus} onValueChange={setStockStatus}>
              <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 px-6">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Complete Node</SelectItem>
                <SelectItem value="expired" className="text-rose-600 font-bold">Expired Stock (Critical)</SelectItem>
                <SelectItem value="out" className="text-rose-500 font-bold">Zero Stock (Empty)</SelectItem>
                <SelectItem value="low" className="text-orange-500 font-bold">Low Depth (Warn)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
          <Button 
            variant="ghost" 
            onClick={() => { setSearchTerm(""); setCompanyFilter("all"); setStockStatus("all"); }}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all"
          >
            Reset Master Terminal
          </Button>
        </div>
      </div>

      {/* Main Status Ledger */}
      <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-32 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="font-black uppercase text-[10px] tracking-widest text-slate-400">Syncing Cloud Node...</p>
            </div>
          ) : filteredInventory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Manufacturing & Item</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Availability Profile</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Lifecycle Detail</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Value (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => {
                    const isExpired = item.expiryDate && item.expiryDate < new Date().toISOString().split('T')[0];
                    return (
                      <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <td className="p-8">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{item.company}</p>
                            <p className="font-headline font-black italic text-lg text-slate-900 group-hover:text-primary transition-colors">{item.itemName}</p>
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Badge className={cn(
                                "text-[8px] font-black uppercase tracking-widest border-none px-3 py-1 shadow-lg",
                                item.stock <= 0 ? "bg-rose-600 animate-pulse" : 
                                item.stock < 10 ? "bg-orange-500" : "bg-emerald-600"
                              )}>
                                {item.stock <= 0 ? 'Exhausted' : `${item.stock} Available`}
                              </Badge>
                              {isExpired && (
                                <Badge className="bg-rose-100 text-rose-700 border-none text-[8px] font-black uppercase tracking-widest">Expired</Badge>
                              )}
                            </div>
                            <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                              <div className={cn(
                                "h-full transition-all duration-1000",
                                item.stock <= 0 ? "bg-rose-600 w-0" : 
                                item.stock < 10 ? "bg-orange-500 w-1/4" : "bg-emerald-500 w-full"
                              )} />
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="space-y-1.5 text-slate-500 font-medium italic text-xs">
                            <div className={cn("flex items-center gap-2", isExpired && "text-rose-600 font-bold")}>
                              <Calendar className={cn("w-3.5 h-3.5", isExpired ? "text-rose-600" : "text-slate-400")} />
                              Exp: {item.expiryDate || "Open Lifecycle"}
                            </div>
                            <div className="flex items-center gap-2 opacity-60">
                              <Clock className="w-3.5 h-3.5" />
                              Sync: {new Date(item.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="p-8 text-right">
                          <div className="space-y-1">
                            <p className="text-2xl font-headline font-black italic text-slate-900">₹{item.price?.toLocaleString()}</p>
                            <p className="text-[9px] font-black uppercase text-slate-400">Master Unit Price</p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-32 text-center space-y-6">
              <div className="w-24 h-24 rounded-[3rem] bg-slate-50 flex items-center justify-center mx-auto text-slate-200 shadow-inner">
                <Box className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-headline font-black italic text-slate-400 uppercase tracking-tighter">Registry Filter Empty</h3>
                <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto">No inventory records matching your intelligence criteria were detected in this node.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Footer */}
      <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 border-t border-slate-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ShieldAlert className="w-4 h-4 text-rose-600" /> Expired Stock Monitoring</div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><AlertCircle className="w-4 h-4 text-rose-500" /> Priority Re-order Required</div>
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">NPB Media Intelligence Node | Real-time Synchronization Active</p>
      </div>
    </div>
  );
}


"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Box, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Calendar,
  IndianRupee,
  Clock,
  Search,
  Filter,
  FileDown,
  ChevronRight,
  MoreVertical,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BillingDashboardPage() {
  const [merchant, setMerchant] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [productFilter, setProductFilter] = useState("all");
  const db = useFirestore();

  useEffect(() => {
    const session = localStorage.getItem("npb_merchant_session");
    if (session) {
      setMerchant(JSON.parse(session));
    }
  }, []);

  // Fetch Merchant Invoices
  const invoicesQuery = useMemoFirebase(() => {
    if (!db || !merchant?.id) return null;
    return query(
      collection(db, "merchants", merchant.id, "invoices"),
      orderBy("createdAt", "desc")
    );
  }, [db, merchant?.id]);

  const { data: invoices, isLoading: isInvoicesLoading } = useCollection(invoicesQuery);

  // Filter Logic
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    return invoices.filter(inv => {
      const matchesSearch = 
        inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerPhone?.includes(searchTerm);
      
      const invDate = new Date(inv.createdAt).toISOString().split('T')[0];
      const matchesStart = !dateFilter.start || invDate >= dateFilter.start;
      const matchesEnd = !dateFilter.end || invDate <= dateFilter.end;

      const matchesProduct = productFilter === "all" || 
        inv.items?.some((item: any) => item.title === productFilter);

      return matchesSearch && matchesStart && matchesEnd && matchesProduct;
    });
  }, [invoices, searchTerm, dateFilter, productFilter]);

  // Stats Calculations
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRevenue = filteredInvoices
      .filter(inv => inv.createdAt.startsWith(today))
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    return [
      { 
        label: "Today's Revenue", 
        value: `₹${todayRevenue.toLocaleString()}`, 
        icon: IndianRupee, 
        color: "text-emerald-600", 
        bg: "bg-emerald-50",
        trend: "+8.4%",
        trendUp: true
      },
      { 
        label: "Total Collection", 
        value: `₹${totalRevenue.toLocaleString()}`, 
        icon: ShoppingBag, 
        color: "text-blue-600", 
        bg: "bg-blue-50",
        trend: "+12.1%",
        trendUp: true
      },
      { 
        label: "Invoices Generated", 
        value: filteredInvoices.length, 
        icon: FileDown, 
        color: "text-purple-600", 
        bg: "bg-purple-50",
        trend: "Latest",
        trendUp: true
      },
      { 
        label: "Customers Served", 
        value: [...new Set(filteredInvoices.map(i => i.customerPhone))].length, 
        icon: Users, 
        color: "text-orange-600", 
        bg: "bg-orange-50",
        trend: "Verified",
        trendUp: true
      },
    ];
  }, [filteredInvoices]);

  // Unique products for filter
  const productList = useMemo(() => {
    if (!invoices) return [];
    const products = new Set<string>();
    invoices.forEach(inv => inv.items?.forEach((item: any) => products.add(item.title)));
    return Array.from(products);
  }, [invoices]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 shadow-sm">
            <Zap className="w-4 h-4 animate-pulse" /> Operational Dashboard Active
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic text-slate-900 leading-none tracking-tighter">
            Operational <br />
            <span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Registry: <span className="text-slate-900 font-bold">{merchant?.shopName || 'Merchant Node'}</span> | {new Date().toDateString()}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 px-8 py-5 bg-white rounded-[2rem] border-2 border-slate-100 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Currency</p>
              <p className="text-sm font-bold text-slate-800">INR System (GST 18%)</p>
            </div>
          </div>
          <Button className="h-16 px-10 rounded-[2rem] bg-primary text-white font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
            Export Ledger <FileDown className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter Terminal */}
      <div className="p-8 bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Search & Filter Terminal</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Customer Search</Label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Name or Phone..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-14 rounded-2xl bg-slate-50 border-slate-100 pl-12 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Date (From)</Label>
            <Input 
              type="date" 
              value={dateFilter.start}
              onChange={e => setDateFilter({...dateFilter, start: e.target.value})}
              className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:border-primary px-6"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Date (To)</Label>
            <Input 
              type="date" 
              value={dateFilter.end}
              onChange={e => setDateFilter({...dateFilter, end: e.target.value})}
              className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:border-primary px-6"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Filter by Item</Label>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 px-6">
                <SelectValue placeholder="All Items" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Inventory</SelectItem>
                {productList.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] bg-white overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg", stat.bg, stat.color)}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm",
                  stat.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {stat.trend}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <h3 className="text-4xl font-headline font-black italic text-slate-900 leading-tight">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Ledger Table */}
      <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
        <CardHeader className="p-10 border-b border-slate-50 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-headline font-black italic flex items-center gap-3">
              <TrendingUp className="text-primary w-8 h-8" />
              Sales Ledger
            </CardTitle>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Transaction Registry ({filteredInvoices.length} results)</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <MoreVertical className="w-6 h-6 text-slate-400" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isInvoicesLoading ? (
            <div className="p-32 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="font-black uppercase text-[10px] tracking-widest text-slate-400">Synchronizing Data Node...</p>
            </div>
          ) : filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Timestamp</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Customer Details</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Purchased Items</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Gross Total</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">IGST (18%)</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Net Value</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                            <Clock className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-700">{new Date(inv.createdAt).toLocaleDateString()}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{new Date(inv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="space-y-1">
                          <p className="font-headline font-black italic text-lg text-slate-900">{inv.customerName}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inv.customerPhone}</p>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-wrap gap-2">
                          {inv.items?.map((item: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="rounded-lg border-slate-100 bg-white text-[9px] font-black uppercase px-2 py-1">
                              {item.title} x{item.quantity}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-8 font-bold text-slate-600">₹{(inv.totalAmount - (inv.gst || 0)).toLocaleString()}</td>
                      <td className="p-8 font-bold text-primary">₹{(inv.gst || 0).toLocaleString()}</td>
                      <td className="p-8 text-right">
                        <div className="flex flex-col items-end">
                          <p className="text-2xl font-headline font-black italic text-slate-900">₹{inv.totalAmount?.toLocaleString()}</p>
                          <Badge className="bg-emerald-100 text-emerald-600 border-none text-[8px] uppercase tracking-widest font-black">Success</Badge>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-32 text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-200">
                <Search className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-headline font-black italic text-slate-400">Registry Matrix Empty</h3>
                <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto">No invoices matching the current criteria were detected in the cloud node.</p>
              </div>
              <Button variant="outline" onClick={() => { setSearchTerm(""); setDateFilter({ start: "", end: "" }); setProductFilter("all"); }} className="rounded-full h-12 px-8 border-2">Reset Terminal</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={cn("block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>{children}</label>;
}

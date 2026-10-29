
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Zap, 
  User, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2, 
  Printer, 
  Clock, 
  Save, 
  Package, 
  Search, 
  FileText,
  CheckCircle2,
  Loader2,
  Building2,
  Receipt,
  IndianRupee,
  ChevronRight,
  Info
} from "lucide-react";
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase, 
  addDocumentNonBlocking, 
  updateDocumentNonBlocking, 
  deleteDocumentNonBlocking 
} from "@/firebase";
import { collection, query, orderBy, doc, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { InvoicePrinter } from "@/components/billing/InvoicePrinter";

interface BillItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  discount: number;
  expiry: string;
  total: number;
}

export default function BillingPOSPage() {
  const [merchant, setMerchant] = useState<any>(null);
  const [billType, setBillType] = useState<'customer' | 'merchant'>('customer');
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    gstNo: "",
  });
  const [cart, setCart] = useState<BillItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePrintingInvoice, setActivePrintingInvoice] = useState<any>(null);
  const [showPrintPreview, setShowPrintPrintPreview] = useState(false);

  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    const session = localStorage.getItem("npb_merchant_session");
    if (session) {
      setMerchant(JSON.parse(session));
    }
  }, []);

  // Fetch Inventory for selection
  const inventoryQuery = useMemoFirebase(() => {
    if (!db || !merchant?.id) return null;
    return query(collection(db, "merchants", merchant.id, "inventory"), orderBy("itemName", "asc"));
  }, [db, merchant?.id]);

  const { data: inventory } = useCollection(inventoryQuery);

  // Fetch Pending Invoices
  const pendingInvoicesQuery = useMemoFirebase(() => {
    if (!db || !merchant?.id) return null;
    return query(
      collection(db, "merchants", merchant.id, "invoices"), 
      where("status", "==", "pending")
    );
  }, [db, merchant?.id]);

  const { data: pendingInvoices } = useCollection(pendingInvoicesQuery);

  const handleAddItem = (inventoryItem: any) => {
    if (inventoryItem.stock <= 0) {
      toast({ variant: "destructive", title: "Out of Stock", description: `${inventoryItem.itemName} is currently exhausted.` });
      return;
    }

    const existing = cart.find(i => i.id === inventoryItem.id);
    if (existing) {
      if (existing.quantity >= inventoryItem.stock) {
        toast({ variant: "destructive", title: "Limit Reached", description: `Cannot add more. Only ${inventoryItem.stock} units available.` });
        return;
      }
      setCart(cart.map(i => i.id === inventoryItem.id ? { 
        ...i, 
        quantity: i.quantity + 1,
        total: (i.quantity + 1) * i.price
      } : i));
    } else {
      setCart([...cart, {
        id: inventoryItem.id,
        title: inventoryItem.itemName,
        price: inventoryItem.price,
        quantity: 1,
        discount: 0,
        expiry: inventoryItem.expiryDate || "N/A",
        total: inventoryItem.price
      }]);
    }
  };

  const updateItem = (id: string, updates: Partial<BillItem>) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newItem = { ...item, ...updates };
        newItem.total = (newItem.quantity * newItem.price) - newItem.discount;
        return newItem;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, i) => sum + i.total, 0);
    const gst = billType === 'merchant' ? subtotal * 0.18 : 0;
    return {
      subtotal,
      gst,
      total: subtotal + gst
    };
  }, [cart, billType]);

  const resetForm = () => {
    setCart([]);
    setCustomerInfo({ name: "", phone: "", address: "", gstNo: "" });
  };

  const saveInvoice = (status: 'pending' | 'finalized') => {
    if (!merchant || cart.length === 0 || !customerInfo.name) {
      toast({ variant: "destructive", title: "Validation Error", description: "Customer name and at least one item are required." });
      return;
    }

    setIsProcessing(true);
    const invoiceData = {
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      gstNo: billType === 'merchant' ? customerInfo.gstNo : "",
      items: cart,
      totalAmount: totals.total,
      gst: totals.gst,
      status,
      type: billType,
      createdAt: new Date().toISOString(),
      merchantName: merchant.shopName,
      merchantId: merchant.id
    };

    const invoicesRef = collection(db, "merchants", merchant.id, "invoices");
    addDocumentNonBlocking(invoicesRef, invoiceData).then((docRef: any) => {
      if (status === 'finalized') {
        // Sync Stock Deductions
        cart.forEach(item => {
          const itemRef = doc(db, "merchants", merchant.id, "inventory", item.id);
          const invItem = inventory?.find(i => i.id === item.id);
          if (invItem) {
            updateDocumentNonBlocking(itemRef, { stock: invItem.stock - item.quantity });
          }
        });
        
        setActivePrintingInvoice({ ...invoiceData, id: docRef?.id || "INV-" + Date.now() });
        setShowPrintPrintPreview(true);
        toast({ title: "Invoice Finalized", description: "Billing record pushed and ready for print." });
      } else {
        toast({ title: "Staged to Queue", description: "Draft invoice saved to pending terminal." });
      }
      resetForm();
      setIsProcessing(false);
    }).catch(err => {
      console.error("Error saving invoice:", err);
      setIsProcessing(false);
      toast({ variant: "destructive", title: "Error", description: "Failed to save invoice." });
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32">
      {/* Header Intelligence */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 shadow-sm">
            <Receipt className="w-4 h-4" /> Smart Billing Gateway v4.2
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic text-slate-900 leading-none tracking-tighter">
            Billing <br />
            <span className="text-primary">Engine</span>
          </h1>
        </div>

        {/* MODE TOGGLE BUTTONS - REQUESTED */}
        <div className="flex items-center bg-slate-100 p-2 rounded-[2.5rem] border-2 border-slate-200 shadow-inner">
          <Button 
            onClick={() => setBillType('customer')}
            className={cn(
              "h-14 px-8 rounded-full font-black uppercase text-[10px] tracking-[0.2em] transition-all border-none",
              billType === 'customer' ? "bg-white text-primary shadow-xl" : "bg-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            <User className="mr-2 w-4 h-4" /> Customers Bill
          </Button>
          <Button 
            onClick={() => setBillType('merchant')}
            className={cn(
              "h-14 px-8 rounded-full font-black uppercase text-[10px] tracking-[0.2em] transition-all border-none",
              billType === 'merchant' ? "bg-white text-emerald-600 shadow-xl" : "bg-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            <Building2 className="mr-2 w-4 h-4" /> Merchant Bill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left: Cart & Forms */}
        <div className="xl:col-span-8 space-y-10">
          {/* Customer Metadata Card */}
          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-2">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-2xl font-headline font-black italic flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                Customer Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Name / Shop Name</Label>
                  <Input 
                    placeholder="Enter recipient identity..." 
                    value={customerInfo.name}
                    onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="h-14 rounded-2xl bg-slate-50 border-slate-100 px-6 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Phone Number</Label>
                  <Input 
                    placeholder="+91 XXXXX XXXXX" 
                    value={customerInfo.phone}
                    onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="h-14 rounded-2xl bg-slate-50 border-slate-100 px-6 focus:border-primary"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Delivery Address</Label>
                  <Input 
                    placeholder="Full shipping coordinates..." 
                    value={customerInfo.address}
                    onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="h-14 rounded-2xl bg-slate-50 border-slate-100 px-6 focus:border-primary"
                  />
                </div>
                {billType === 'merchant' && (
                  <div className="space-y-2 md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                    <Label className="text-[10px] font-black uppercase text-emerald-600 ml-2">GST Identification Number (GSTIN)</Label>
                    <Input 
                      placeholder="Enter 15-digit GST code..." 
                      value={customerInfo.gstNo}
                      onChange={e => setCustomerInfo({...customerInfo, gstNo: e.target.value})}
                      className="h-14 rounded-2xl bg-emerald-50/50 border-emerald-100 px-6 focus:border-emerald-600 font-mono"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cart Table */}
          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-2xl font-headline font-black italic flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <Receipt className="w-5 h-5 text-primary" />
                  Billable Items
                </span>
                <Badge variant="outline" className="rounded-xl px-4 py-1.5 font-black uppercase text-[10px] tracking-widest text-slate-400">
                  {cart.length} Products Linked
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {cart.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Product & Expiry</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Rate (₹)</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest w-32">Qty</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest w-32">Disc (₹)</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Net Value</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                          <td className="p-6">
                            <p className="font-bold text-slate-900">{item.title}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Exp: {item.expiry}</p>
                          </td>
                          <td className="p-6">
                            <Input 
                              type="number" 
                              value={item.price} 
                              onChange={e => updateItem(item.id, { price: Number(e.target.value) })}
                              className="h-10 w-24 rounded-lg bg-slate-50 border-none text-sm font-bold"
                            />
                          </td>
                          <td className="p-6">
                            <Input 
                              type="number" 
                              value={item.quantity} 
                              onChange={e => updateItem(item.id, { quantity: Number(e.target.value) })}
                              className="h-10 w-20 rounded-lg bg-slate-50 border-none text-sm font-bold"
                            />
                          </td>
                          <td className="p-6">
                            <Input 
                              type="number" 
                              value={item.discount} 
                              onChange={e => updateItem(item.id, { discount: Number(e.target.value) })}
                              className="h-10 w-20 rounded-lg bg-slate-50 border-none text-sm font-bold"
                            />
                          </td>
                          <td className="p-6 text-right">
                            <p className="text-lg font-headline font-black italic">₹{item.total.toLocaleString()}</p>
                          </td>
                          <td className="p-6 text-right">
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-500">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-20 text-center space-y-6">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                    <Receipt className="w-10 h-10" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Cart matrix is empty. Select products from inventory.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Inventory Search & Summary */}
        <div className="xl:col-span-4 space-y-10">
          {/* Inventory Selection */}
          <Card className="border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white overflow-hidden h-[500px] flex flex-col">
            <CardHeader className="p-8 border-b border-white/5 space-y-4">
              <CardTitle className="text-xl font-headline font-black italic flex items-center gap-3">
                <Package className="w-5 h-5 text-primary" />
                Inventory Node
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input 
                  placeholder="Scan or Search Product..." 
                  className="h-12 bg-white/5 border-white/10 pl-12 rounded-xl text-xs"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-1">
              <div className="divide-y divide-white/5">
                {inventory?.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleAddItem(item)}
                    className="p-6 hover:bg-white/5 cursor-pointer transition-all group flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{item.itemName}</p>
                      <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Rate: ₹{item.price}</span>
                        <span className={cn(item.stock < 10 ? "text-orange-500" : "text-emerald-500")}>Stock: {item.stock}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Totals & Actions */}
          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-2">
            <CardContent className="p-10 space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-slate-900">₹{totals.subtotal.toLocaleString()}</span>
                </div>
                {billType === 'merchant' && (
                  <div className="flex justify-between items-center text-sm font-bold text-emerald-600 uppercase tracking-widest animate-in slide-in-from-top-1">
                    <span>IGST (18%)</span>
                    <span>₹{totals.gst.toLocaleString()}</span>
                  </div>
                )}
                <div className="h-px bg-slate-100 w-full" />
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Grand Total</p>
                    <p className="text-5xl font-headline font-black italic text-primary leading-none">₹{totals.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button 
                  onClick={() => saveInvoice('finalized')}
                  disabled={isProcessing}
                  className="h-20 rounded-[2rem] bg-primary text-white font-black uppercase tracking-widest text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all border-none"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Save & Print <Printer className="ml-3 w-6 h-6" /></>}
                </Button>
                <Button 
                  onClick={() => saveInvoice('pending')}
                  disabled={isProcessing}
                  variant="outline"
                  className="h-16 rounded-[2rem] border-2 border-slate-100 hover:bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-xs"
                >
                  Stage to Pending <Clock className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-blue-800 leading-relaxed uppercase tracking-wider">
                  Finalizing the bill will automatically deduct stock from the inventory node.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pending Ledger Section */}
      <div className="space-y-6 pt-10">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-slate-400" />
          <h3 className="text-xl font-headline font-black italic uppercase tracking-widest text-slate-500">Pending Ledger</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pendingInvoices?.map((inv) => (
            <Card key={inv.id} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden group hover:-translate-y-1 transition-all">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <User className="w-6 h-6" />
                  </div>
                  <Badge className="bg-amber-500 border-none text-white text-[8px] font-black uppercase tracking-widest">Pending</Badge>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-headline font-black italic">{inv.customerName}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inv.customerPhone}</p>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-slate-50">
                  <p className="text-2xl font-headline font-black italic text-slate-900">₹{inv.totalAmount?.toLocaleString()}</p>
                  <Button 
                    onClick={() => {
                      setCustomerInfo({ name: inv.customerName, phone: inv.customerPhone, address: inv.customerAddress, gstNo: inv.gstNo });
                      setCart(inv.items);
                      setBillType(inv.type);
                      deleteDocumentNonBlocking(doc(db, "merchants", merchant.id, "invoices", inv.id));
                      toast({ title: "Session Restored", description: "Draft moved back to active terminal." });
                    }}
                    variant="ghost" 
                    className="rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5"
                  >
                    Restore <ChevronRight className="ml-1 w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Hidden Printer Component */}
      {activePrintingInvoice && (
        <InvoicePrinter 
          invoice={activePrintingInvoice} 
          isOpen={showPrintPreview} 
          onClose={() => { setShowPrintPrintPreview(false); setActivePrintingInvoice(null); }} 
        />
      )}
    </div>
  );
}


"use client";

import React, { useRef } from "react";
import { 
  Dialog, 
  DialogContent 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, X, ShieldCheck, Globe, IndianRupee } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface InvoicePrinterProps {
  invoice: any;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoicePrinter({ invoice, isOpen, onClose }: InvoicePrinterProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'width=900,height=1200');
    if (windowPrint && printContent) {
      windowPrint.document.write(`
        <html>
          <head>
            <title>Invoice - ${invoice.id}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;700&display=swap');
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; }
              .invoice-box { max-width: 800px; margin: auto; }
              .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 4px solid #F28C30; padding-bottom: 20px; }
              .brand { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 900; color: #F28C30; font-style: italic; }
              .details { display: grid; grid-cols: 2; gap: 40px; margin-bottom: 40px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
              th { background: #f8fafc; padding: 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 900; color: #64748b; border-bottom: 2px solid #e2e8f0; }
              td { padding: 16px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
              .totals { margin-left: auto; width: 300px; space-y: 12px; }
              .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-weight: bold; }
              .grand-total { font-size: 24px; color: #F28C30; border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 12px; }
              .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; text-transform: uppercase; letter-spacing: 0.2em; }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      windowPrint.document.close();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-0 border-none shadow-2xl bg-slate-900">
        {/* Controls */}
        <div className="p-8 bg-slate-900 border-b border-white/5 flex items-center justify-between sticky top-0 z-20">
          <div className="space-y-1">
            <h3 className="text-xl font-headline font-black italic text-white uppercase tracking-tighter">Invoice <span className="text-primary">Preview</span></h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Document ID: {invoice.id}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handlePrint} className="rounded-full h-12 px-6 bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
              <Printer className="mr-2 w-4 h-4" /> Print A4
            </Button>
            <Button onClick={onClose} variant="ghost" className="rounded-full h-12 w-12 p-0 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* The Actual Invoice Content (Styled for both Preview and Print) */}
        <div className="p-12 bg-white" ref={printRef}>
          <div className="invoice-box">
            {/* Header */}
            <div className="flex justify-between items-start mb-10 pb-8 border-b-4 border-[#F28C30]">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Logo className="w-12 h-12" />
                  <span className="font-headline font-black text-3xl italic text-slate-900">NPB <span className="text-primary">Media</span></span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Registered Node: {invoice.merchantName || 'Central Terminal'}
                </div>
              </div>
              <div className="text-right space-y-1">
                <h1 className="text-4xl font-headline font-black italic uppercase text-slate-900 leading-none">Invoice</h1>
                <p className="text-xs font-bold text-slate-500">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                <p className="text-[10px] font-black uppercase text-primary tracking-widest"># {invoice.id.toUpperCase()}</p>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-20 mb-12">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-2">Bill From</p>
                <div className="space-y-1">
                  <p className="font-headline font-black text-xl italic">{invoice.merchantName}</p>
                  <p className="text-sm font-medium text-slate-600">Begusarai Tech Hub, Bihar</p>
                  <p className="text-sm font-medium text-slate-600">+91 8877300114</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-2">Bill To</p>
                <div className="space-y-1">
                  <p className="font-headline font-black text-xl italic">{invoice.customerName}</p>
                  {invoice.customerPhone && <p className="text-sm font-medium text-slate-600">{invoice.customerPhone}</p>}
                  {invoice.customerAddress && <p className="text-sm font-medium text-slate-600">{invoice.customerAddress}</p>}
                  {invoice.gstNo && <p className="text-xs font-black uppercase text-primary mt-2">GSTIN: {invoice.gstNo}</p>}
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full mb-12">
              <thead>
                <tr>
                  <th className="text-left py-4 px-2 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Item Specification</th>
                  <th className="text-right py-4 px-2 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Rate</th>
                  <th className="text-center py-4 px-2 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</th>
                  <th className="text-right py-4 px-2 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Net Value</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-50">
                    <td className="py-6 px-2">
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Life Cycle: {item.expiry}</p>
                    </td>
                    <td className="py-6 px-2 text-right font-medium">₹{item.price.toLocaleString()}</td>
                    <td className="py-6 px-2 text-center font-bold text-slate-600">x{item.quantity}</td>
                    <td className="py-6 px-2 text-right font-black">₹{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-4">
                <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-slate-900">₹{(invoice.totalAmount - (invoice.gst || 0)).toLocaleString()}</span>
                </div>
                {invoice.gst > 0 && (
                  <div className="flex justify-between text-sm font-bold text-primary uppercase tracking-widest">
                    <span>IGST (18%)</span>
                    <span>₹{invoice.gst.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-4 border-t-2 border-slate-100 flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Payable</p>
                  <p className="text-3xl font-headline font-black italic text-[#F28C30]">₹{invoice.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-20 pt-10 border-t border-slate-100 text-center space-y-6">
              <div className="flex items-center justify-center gap-10 opacity-30 grayscale">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-600">
                  <ShieldCheck className="w-4 h-4" /> SECURE TRANSACTION
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-600">
                  <Globe className="w-4 h-4" /> CLOUD VERIFIED
                </div>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
                System generated by NPB Media Intelligence Node | All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

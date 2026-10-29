
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ReceiptIndianRupee, 
  PlusCircle, 
  PackageSearch, 
  FileDown, 
  UserCircle, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Users,
  Box,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/billing/dashboard" },
  { label: "Billing", icon: ReceiptIndianRupee, href: "/billing/pos" },
  { label: "Add Stock", icon: PlusCircle, href: "/billing/inventory/add" },
  { label: "Stock Status", icon: PackageSearch, href: "/billing/inventory/status" },
];

const reportItems = [
  { label: "Sell Report", icon: TrendingUp, href: "/billing/reports/sell" },
  { label: "Stock Report", icon: Box, href: "/billing/reports/stock" },
  { label: "Customers", icon: Users, href: "/billing/reports/customers" },
  { label: "Revenue", icon: TrendingUp, href: "/billing/reports/revenue" },
];

export function BillingSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("npb_merchant_session");
    router.push("/billing/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen bg-white border-r border-slate-100 z-50 transition-all duration-500 ease-in-out group/sidebar hover:w-72 w-20 flex flex-col overflow-hidden shadow-2xl">
      {/* Brand Section */}
      <div className="p-4 h-24 flex items-center gap-4 border-b border-slate-50 overflow-hidden shrink-0">
        <Logo className="w-12 h-12 shadow-md shrink-0" />
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <p className="font-headline font-black text-xl italic text-slate-900 leading-none">Billing</p>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Portal</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 py-8 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full h-14 rounded-2xl transition-all duration-300 justify-start px-4 gap-4 overflow-hidden relative group",
                pathname === item.href 
                  ? "bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary/90" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-headline font-black italic whitespace-nowrap">
                {item.label}
              </span>
              {pathname === item.href && (
                <div className="absolute right-4 opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </Link>
        ))}

        {/* Reports Group */}
        <Collapsible open={isReportsOpen} onOpenChange={setIsReportsOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full h-14 rounded-2xl transition-all duration-300 justify-start px-4 gap-4 overflow-hidden text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                isReportsOpen && "bg-slate-50/50"
              )}
            >
              <FileDown className="w-6 h-6 shrink-0" />
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-headline font-black italic flex-1 text-left whitespace-nowrap">
                Reports
              </span>
              <ChevronDown className={cn("w-4 h-4 transition-transform opacity-0 group-hover/sidebar:opacity-100", isReportsOpen && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pt-1 opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
            {reportItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full h-10 rounded-xl justify-start px-6 gap-3 text-slate-400 hover:text-primary transition-colors",
                    pathname === item.href && "text-primary font-bold"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{item.label}</span>
                </Button>
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Footer Section */}
      <div className="p-3 border-t border-slate-50 space-y-2 shrink-0">
        <Link href="/billing/profile">
          <Button
            variant="ghost"
            className={cn(
              "w-full h-14 rounded-2xl transition-all duration-300 justify-start px-4 gap-4 text-slate-500 hover:bg-slate-50",
              pathname === "/billing/profile" && "bg-slate-50 text-slate-900"
            )}
          >
            <UserCircle className="w-6 h-6 shrink-0" />
            <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-headline font-black italic whitespace-nowrap">Profile</span>
          </Button>
        </Link>
        
        <Link href="/billing/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full h-14 rounded-2xl transition-all duration-300 justify-start px-4 gap-4 text-slate-500 hover:bg-slate-50",
              pathname === "/billing/settings" && "bg-slate-50 text-slate-900"
            )}
          >
            <Settings className="w-6 h-6 shrink-0" />
            <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-headline font-black italic whitespace-nowrap">Settings</span>
          </Button>
        </Link>

        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full h-14 rounded-2xl transition-all duration-300 justify-start px-4 gap-4 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="w-6 h-6 shrink-0" />
          <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-headline font-black italic whitespace-nowrap">Logout</span>
        </Button>
      </div>
    </aside>
  );
}

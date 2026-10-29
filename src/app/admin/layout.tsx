
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, LogOut, Menu, X, Bell } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsChecking(false);
      return;
    }

    const session = localStorage.getItem("npb_admin_session");
    if (!session) {
      router.push("/admin/login");
    } else {
      setIsChecking(false);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("npb_admin_session");
    router.push("/admin/login");
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Hide header on login page
  const showHeader = pathname !== "/admin/login";

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Enquiry", href: "/admin/enquiries" },
    { label: "Schedule Meetings", href: "/admin/meetings" },
    { label: "Career", href: "/admin/careers" },
    { label: "Merchants", href: "/admin/merchants" },
    { label: "Products", href: "/admin/products" },
    { label: "Notification", href: "/admin/notifications" },
  ];

  const NavButtons = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} onClick={() => mobile && setIsMobileMenuOpen(false)}>
          <Button 
            variant="ghost" 
            className={cn(
              "rounded-full px-6 transition-all font-black uppercase tracking-widest",
              mobile ? "w-full h-14 text-xs justify-start px-8" : "h-10 text-[10px]",
              pathname === item.href 
                ? "bg-primary text-white hover:bg-primary" 
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            )}
          >
            {item.label}
          </Button>
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary/30">
      {showHeader && (
        <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="flex items-center gap-3 group">
                <Logo className="w-10 h-10 border border-slate-800 p-0.5 group-hover:border-primary transition-colors" />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-headline font-black italic uppercase tracking-tighter">Command <span className="text-primary">Center</span></h1>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-2">
                <NavButtons />
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Desktop Logout */}
              <div className="hidden md:block">
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="rounded-full h-10 px-6 border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:bg-destructive/10 hover:border-destructive/20 text-[10px] font-black uppercase tracking-widest"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" /> Session Terminate
                </Button>
              </div>

              {/* Mobile Menu Trigger */}
              <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-slate-900 rounded-xl">
                      <Menu className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="bg-slate-950 border-slate-800 p-0 w-80">
                    <SheetHeader className="p-8 border-b border-slate-800">
                      <SheetTitle className="text-left">
                        <div className="flex items-center gap-3">
                          <Logo className="w-10 h-10" />
                          <div className="space-y-0.5">
                            <p className="text-lg font-headline font-black italic text-white uppercase leading-none">Command</p>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Center</p>
                          </div>
                        </div>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="p-6 space-y-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4 mb-2">Protocol Access</p>
                        <NavButtons mobile />
                      </div>
                      <div className="pt-6 mt-6 border-t border-slate-800">
                        <Button 
                          onClick={handleLogout}
                          variant="outline" 
                          className="w-full h-14 rounded-2xl border-destructive/20 bg-destructive/5 text-destructive font-black uppercase tracking-widest text-xs"
                        >
                          <LogOut className="w-4 h-4 mr-2" /> Terminate Session
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="relative">
        <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
        {children}
      </main>
    </div>
  );
}

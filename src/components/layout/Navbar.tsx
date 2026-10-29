"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, UserCircle, LogOut, Loader2, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Technology", href: "/technology" },
    { name: "Products", href: "/products" },
    { name: "Career", href: "/career" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsMobileMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b py-3 shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
        >
          <Logo className="transition-transform group-hover:scale-110 duration-500" />
          <span className="font-headline font-black text-2xl tracking-tight text-foreground">
            NPB <span className="text-primary">Media</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-[10px] lg:text-xs font-black uppercase tracking-widest hover:text-primary transition-colors whitespace-nowrap",
                pathname === link.href ? "text-primary" : "text-foreground/70"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            {isUserLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link href="/cart" className="relative group">
                  <Button variant="ghost" size="icon" className="rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10">
                    <ShoppingBag className="w-5 h-5" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                        <AvatarFallback className="bg-primary text-white font-black">
                          {getInitials(user.displayName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 rounded-2xl p-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-headline font-black px-4 py-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none">{user.displayName || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground font-medium">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-xl px-4 py-3 cursor-pointer">
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span className="font-black uppercase text-[10px] tracking-widest">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="rounded-xl px-4 py-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span className="font-black uppercase text-[10px] tracking-widest">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/login" title="Login">
                <Button variant="ghost" size="icon" className="rounded-full text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all">
                  <UserCircle className="w-6 h-6" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Nav Actions */}
        <div className="flex items-center gap-1 md:hidden">
          {!isUserLoading && user && (
            <div className="flex items-center gap-1">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="rounded-full text-foreground/70">
                  <ShoppingBag className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          )}
          <button
            className="p-2 text-foreground ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300 shadow-xl max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "text-lg font-black uppercase tracking-widest py-3 border-b border-muted transition-colors",
                pathname === link.href ? "text-primary" : "text-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {user && (
            <>
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-black uppercase tracking-widest py-3 border-b border-muted transition-colors",
                  pathname === "/profile" ? "text-primary" : "text-foreground"
                )}
              >
                Profile
              </Link>
              <Button 
                onClick={handleSignOut}
                variant="destructive" 
                className="w-full rounded-2xl h-14 font-black uppercase tracking-widest mt-4"
              >
                <LogOut className="mr-2 w-5 h-5" /> Sign Out
              </Button>
            </>
          )}

          {!user && (
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full rounded-2xl h-14 font-black uppercase tracking-widest bg-primary">
                <UserCircle className="mr-2 w-5 h-5" /> Sign In
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

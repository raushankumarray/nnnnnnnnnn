"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

function PageTransitionLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Stop loading when route change completes
  useEffect(() => {
    setIsLoading(false);
    setProgress(100);
    const timer = setTimeout(() => {
      setProgress(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Global listener for click events on links and buttons
  useEffect(() => {
    const handleNavigationClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      const button = target.closest("button");

      // Check if it's an internal link
      if (anchor) {
        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");

        if (
          href &&
          href.startsWith("/") &&
          !href.startsWith("#") &&
          !href.startsWith("mailto:") &&
          !href.startsWith("tel:") &&
          targetAttr !== "_blank"
        ) {
          const currentUrl = window.location.pathname;
          if (href !== currentUrl) {
            setIsLoading(true);
            setProgress(35);
          }
        }
      } else if (button && (button.type === "submit" || button.dataset.triggersLoading === "true")) {
        setIsLoading(true);
        setProgress(45);
      }
    };

    document.addEventListener("click", handleNavigationClick, { capture: true });
    return () => document.removeEventListener("click", handleNavigationClick, { capture: true });
  }, []);

  // Progress bar animation while loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) return prev;
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <>
      {/* Top sleek loading bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-1.5 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-primary via-[#F28C30] to-secondary transition-all duration-300 ease-out shadow-lg shadow-primary/50"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Elegant Backdrop Transition Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-6 p-8 rounded-[2.5rem] bg-white shadow-2xl border border-slate-100/80 animate-in zoom-in-95 duration-200">
            <div className="relative">
              <Logo className="w-16 h-16 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-headline font-black text-xl italic tracking-tight text-slate-900">
                NPB <span className="text-primary">Media</span>
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Opening Page...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PageTransitionLoader() {
  return (
    <Suspense fallback={null}>
      <PageTransitionLoaderInner />
    </Suspense>
  );
}

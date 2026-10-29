"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center w-12 h-12 bg-primary rounded-full shrink-0 shadow-lg", className)}>
      <div className="flex items-center justify-center leading-none">
        <div className="flex font-black text-xl select-none">
          <span className="text-red-600 drop-shadow-sm italic">N</span>
          <span className="text-white drop-shadow-sm italic">P</span>
          <span className="text-green-600 drop-shadow-sm italic">B</span>
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
        <div className="w-2 h-2 bg-primary rounded-full" />
      </div>
    </div>
  );
}

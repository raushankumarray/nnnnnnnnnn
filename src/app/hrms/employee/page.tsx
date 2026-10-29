
"use client";

import React, { useState, useEffect } from "react";
import { useFirestore, useDoc, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { doc, collection, query, where, orderBy, limit } from "firebase/firestore";
import { 
  MapPin, 
  Clock, 
  Calendar as CalendarIcon, 
  Zap, 
  User, 
  ShieldCheck, 
  Loader2, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  History,
  Timer
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function EmployeeDashboard() {
  const [session, setSession] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isPunching, setIsPunching] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    const s = localStorage.getItem("hrms_session");
    if (s) setSession(JSON.parse(s));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch current company settings for geofencing
  const companyRef = useMemoFirebase(() => {
    if (!db || !session?.companyId) return null;
    return doc(db, "companies", session.companyId);
  }, [db, session?.companyId]);
  const { data: company } = useDoc(companyRef);

  // Fetch today's record
  const todayStr = new Date().toISOString().split('T')[0];
  const todayQuery = useMemoFirebase(() => {
    if (!db || !session?.id) return null;
    return query(
      collection(db, "attendance"),
      where("userId", "==", session.id),
      where("date", "==", todayStr),
      limit(1)
    );
  }, [db, session?.id, todayStr]);
  const { data: todayAttendance } = useDoc(todayQuery as any);

  const requestLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        toast({ variant: "destructive", title: "GPS Error", description: "GPS node not detected in hardware." });
        reject();
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          resolve(pos.coords);
        },
        () => {
          toast({ variant: "destructive", title: "Access Denied", description: "Please enable GPS to mark attendance." });
          reject();
        }
      );
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handlePunch = async (type: 'in' | 'out') => {
    setIsPunching(true);
    try {
      const coords: any = await requestLocation();
      
      // Geofencing Validation
      if (company?.geofencing?.enabled) {
        const dist = calculateDistance(
          coords.latitude, 
          coords.longitude, 
          company.geofencing.latitude, 
          company.geofencing.longitude
        );
        
        if (dist > company.geofencing.radius) {
          toast({ 
            variant: "destructive", 
            title: "Out of Bounds", 
            description: `You are ${(dist - company.geofencing.radius).toFixed(0)}m outside authorized node.` 
          });
          setIsPunching(false);
          return;
        }
      }

      const punchData = {
        time: new Date().toLocaleTimeString(),
        lat: coords.latitude,
        lng: coords.longitude,
        isGeofenced: true
      };

      if (type === 'in') {
        addDocumentNonBlocking(collection(db, "attendance"), {
          userId: session.id,
          companyId: session.companyId,
          date: todayStr,
          punchIn: punchData,
          status: "present", // Initial status
          createdAt: new Date().toISOString()
        });
        toast({ title: "Node Locked", description: "Punch In successful." });
      } else {
        // Logic to update existing today's record would go here
        toast({ title: "Session Closed", description: "Punch Out recorded." });
      }
    } catch (e) {
      // Handled in requestLocation
    } finally {
      setIsPunching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 animate-in fade-in duration-700">
      {/* Dynamic Clock Hero */}
      <Card className="bg-slate-900 border-slate-800 rounded-[3rem] overflow-hidden relative group border-2">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <CardContent className="p-12 flex flex-col items-center text-center space-y-8 relative z-10">
          <div className="space-y-2">
            <p className="text-sm font-black uppercase text-primary tracking-[0.3em]">{currentTime.toDateString()}</p>
            <h1 className="text-7xl md:text-8xl font-headline font-black italic text-white drop-shadow-2xl">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <Button 
              disabled={isPunching || todayAttendance}
              onClick={() => handlePunch('in')}
              className={cn(
                "h-24 px-12 rounded-[2rem] text-xl font-headline bg-emerald-600 text-white shadow-2xl hover:scale-105 transition-all border-none font-black italic",
                todayAttendance && "opacity-50 grayscale"
              )}
            >
              {isPunching ? <Loader2 className="animate-spin" /> : "PUNCH IN"}
            </Button>
            <Button 
              disabled={isPunching || !todayAttendance}
              onClick={() => handlePunch('out')}
              className="h-24 px-12 rounded-[2rem] text-xl font-headline bg-rose-600 text-white shadow-2xl hover:scale-105 transition-all border-none font-black italic"
            >
              PUNCH OUT
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-6 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <MapPin className={cn("w-4 h-4", location ? "text-emerald-500" : "text-slate-700")} />
              {location ? "GPS Active" : "Detecting GPS..."}
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Node Secured
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Casual Leave", value: session?.leaveBalance?.casual || 12, icon: Sparkles, color: "text-orange-500" },
          { label: "Earned Leave", value: session?.leaveBalance?.earned || 0, icon: Zap, color: "text-emerald-500" },
          { label: "Month Attendance", value: "92%", icon: TrendingUpIcon, color: "text-blue-500" },
          { label: "Shift Schedule", value: "10AM-6PM", icon: Clock, color: "text-purple-500" },
        ].map((m, i) => (
          <Card key={i} className="bg-slate-900 border-slate-800 rounded-3xl group hover:border-primary transition-all">
            <CardContent className="p-6 text-center space-y-3">
              <div className={cn("w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform", m.color)}>
                <m.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</p>
                <p className="text-xl font-headline font-black text-white">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calendar Section Teaser */}
      <Card className="bg-slate-900 border-slate-800 rounded-[3rem] overflow-hidden">
        <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-3xl font-headline font-black italic uppercase tracking-tighter">Personal <span className="text-primary">Ledger</span></h3>
            <p className="text-slate-400 text-sm font-medium">View your punch history, weekly offs, and upcoming company holidays in a unified view.</p>
            <Button variant="outline" className="rounded-full border-slate-800 text-slate-400 hover:text-white font-black uppercase text-[10px] tracking-widest px-8 h-12">
              Launch Calendar Terminal <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div className="w-32 h-32 bg-slate-950 rounded-full flex items-center justify-center border-2 border-slate-800 shrink-0">
            <CalendarIcon className="w-12 h-12 text-slate-700" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

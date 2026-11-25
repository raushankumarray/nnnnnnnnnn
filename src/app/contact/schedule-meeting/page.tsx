"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Loader2,
  Sun,
  Moon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MAX_CALLS_PER_SLOT = 2;

const MORNING_SLOTS = [
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
] as const;

const EVENING_SLOTS = [
  "04:00 PM - 04:30 PM",
  "04:30 PM - 05:00 PM",
  "05:00 PM - 05:30 PM",
  "05:30 PM - 06:00 PM",
] as const;

const ALL_SLOTS: readonly string[] = [...MORNING_SLOTS, ...EVENING_SLOTS];

function getTodayLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ScheduleMeetingPage() {
  const todayStr = useMemo(() => getTodayLocalDate(), []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: todayStr,
    timeSlot: "",
    subject: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localBookings, setLocalBookings] = useState<Record<string, Record<string, number>>>({});
  const db = useFirestore();
  const { toast } = useToast();

  // Real-time Firestore listener for all meetings on the selected date
  const dateMeetingsQuery = useMemoFirebase(() => {
    if (!db || !formData.date) return null;
    return query(collection(db, "meetings"), where("date", "==", formData.date));
  }, [db, formData.date]);

  const { data: dateMeetings, isLoading: isSlotsLoading } = useCollection(dateMeetingsQuery);

  // Compute booked call counts per slot for the selected date (ignoring canceled meetings)
  const slotBookedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_SLOTS.forEach((slot) => {
      counts[slot] = 0;
    });

    if (db && dateMeetings) {
      dateMeetings.forEach((meeting: any) => {
        if (
          meeting.timeSlot &&
          meeting.status !== "canceled" &&
          counts[meeting.timeSlot] !== undefined
        ) {
          counts[meeting.timeSlot] += 1;
        }
      });
    } else if (!db && localBookings[formData.date]) {
      Object.entries(localBookings[formData.date]).forEach(([slot, count]) => {
        if (counts[slot] !== undefined) {
          counts[slot] = count;
        }
      });
    }

    return counts;
  }, [db, dateMeetings, localBookings, formData.date]);

  const totalSlotsCapacity = ALL_SLOTS.length * MAX_CALLS_PER_SLOT;
  const totalAvailableCalls = useMemo(() => {
    return ALL_SLOTS.reduce((acc, slot) => {
      const booked = slotBookedCounts[slot] || 0;
      return acc + Math.max(0, MAX_CALLS_PER_SLOT - booked);
    }, 0);
  }, [slotBookedCounts]);

  // Clear selected timeSlot if real-time data shows it just reached max capacity (2/2 booked)
  useEffect(() => {
    if (formData.timeSlot) {
      const booked = slotBookedCounts[formData.timeSlot] || 0;
      if (booked >= MAX_CALLS_PER_SLOT) {
        setFormData((prev) => ({ ...prev, timeSlot: "" }));
      }
    }
  }, [slotBookedCounts, formData.timeSlot]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "date") {
      if (!value) {
        setFormData((prev) => ({ ...prev, date: todayStr, timeSlot: "" }));
        return;
      }
      if (value < todayStr) {
        setFormData((prev) => ({ ...prev, date: todayStr, timeSlot: "" }));
        toast({
          variant: "destructive",
          title: "Past Dates Restricted",
          description: "Please select today's date or an upcoming date.",
        });
        return;
      }
      setFormData((prev) => ({ ...prev, date: value, timeSlot: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    const booked = slotBookedCounts[value] || 0;
    if (booked >= MAX_CALLS_PER_SLOT) {
      toast({
        variant: "destructive",
        title: "Slot Unavailable",
        description: "All 2 calls for this time slot are already booked.",
      });
      return;
    }
    setFormData((prev) => ({ ...prev, timeSlot: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.date || !formData.timeSlot || !formData.subject) {
      toast({
        variant: "destructive",
        title: "Required Information",
        description: "Please complete all mandatory fields to schedule your call.",
      });
      return;
    }

    if (formData.date < todayStr) {
      setFormData((prev) => ({ ...prev, date: todayStr }));
      toast({
        variant: "destructive",
        title: "Invalid Date",
        description: "Past dates cannot be scheduled. Please pick today or a future date.",
      });
      return;
    }

    if (!ALL_SLOTS.includes(formData.timeSlot)) {
      toast({
        variant: "destructive",
        title: "Invalid Time Slot",
        description: "Please select an available morning or evening slot.",
      });
      return;
    }

    const currentSlotBooked = slotBookedCounts[formData.timeSlot] || 0;
    if (currentSlotBooked >= MAX_CALLS_PER_SLOT) {
      setFormData((prev) => ({ ...prev, timeSlot: "" }));
      toast({
        variant: "destructive",
        title: "Slot Full",
        description: "Both calls (2/2) for this slot are already booked. Please choose another slot.",
      });
      return;
    }

    setIsSubmitting(true);

    if (!db) {
      setTimeout(() => {
        const selectedSlot = formData.timeSlot;
        const selectedDate = formData.date;
        setLocalBookings((prev) => ({
          ...prev,
          [selectedDate]: {
            ...(prev[selectedDate] || {}),
            [selectedSlot]: ((prev[selectedDate]?.[selectedSlot] || 0) + 1),
          },
        }));
        setIsSubmitting(false);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          date: selectedDate,
          timeSlot: "",
          subject: "",
        });
        toast({
          title: "Call Booked (Preview)",
          description: `Slot ${selectedSlot} reserved.`,
        });
      }, 600);
      return;
    }

    try {
      // Fresh check against Firestore before committing to prevent overbooking
      const slotCheckQuery = query(
        collection(db, "meetings"),
        where("date", "==", formData.date),
        where("timeSlot", "==", formData.timeSlot)
      );
      const snapshot = await getDocs(slotCheckQuery);
      const activeBookings = snapshot.docs.filter(
        (docSnap) => docSnap.data()?.status !== "canceled"
      ).length;

      if (activeBookings >= MAX_CALLS_PER_SLOT) {
        setIsSubmitting(false);
        setFormData((prev) => ({ ...prev, timeSlot: "" }));
        toast({
          variant: "destructive",
          title: "Slot Just Filled",
          description: "2 calls are already booked for this time slot. Please choose another slot.",
        });
        return;
      }

      const bookedSlot = formData.timeSlot;
      const bookedDate = formData.date;

      await addDoc(collection(db, "meetings"), {
        ...formData,
        status: "new",
        meetingLink: "",
        createdAt: new Date().toISOString(),
      });

      const remainingAfter = Math.max(0, MAX_CALLS_PER_SLOT - (activeBookings + 1));
      setIsSubmitting(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        date: bookedDate,
        timeSlot: "",
        subject: "",
      });
      toast({
        title: "Meeting Scheduled",
        description: `Your call for ${bookedSlot} on ${bookedDate} is confirmed. (${remainingAfter}/${MAX_CALLS_PER_SLOT} calls left in this slot)`,
      });
    } catch (err) {
      console.error("Error scheduling meeting:", err);
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Could not schedule consultation. Please try again.",
      });
    }
  };

  const renderSlotCard = (slot: string) => {
    const booked = slotBookedCounts[slot] || 0;
    const available = Math.max(0, MAX_CALLS_PER_SLOT - booked);
    const isFull = available === 0;
    const isSelected = formData.timeSlot === slot;

    return (
      <button
        key={slot}
        type="button"
        disabled={isFull || isSlotsLoading}
        onClick={() => handleSelectChange(slot)}
        className={cn(
          "flex flex-col justify-between gap-2 p-4 rounded-2xl border-2 text-left transition-all duration-200",
          isFull
            ? "border-slate-200 bg-slate-100/80 text-slate-400 cursor-not-allowed opacity-70"
            : isSelected
            ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-md shadow-emerald-600/10"
            : "border-slate-100 bg-slate-50 hover:border-emerald-300 hover:bg-white text-slate-800 cursor-pointer"
        )}
      >
        <span className="text-sm font-black tracking-tight">{slot}</span>
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-[11px] font-black uppercase tracking-wider",
              isFull
                ? "text-red-500"
                : available === 1
                ? "text-amber-600"
                : "text-emerald-600"
            )}
          >
            {isFull ? "Slot Full (0/2)" : `${available}/${MAX_CALLS_PER_SLOT} Calls Left`}
          </span>
          {isSelected && !isFull && (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
        </div>
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden vibrant-gradient text-white">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Back to Contact
            </Link>
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/20 border-2 border-white/30 text-white text-sm font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
              <CalendarDays className="w-5 h-5 text-yellow-300" />
              Book a Consultation
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-black leading-[0.9] tracking-tighter drop-shadow-2xl">
              Reserve Your <span className="italic text-yellow-300">Time Slot</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-bold border-l-4 border-yellow-300 pl-6">
              Schedule a 30-minute discovery call with our expert team to discuss your project requirements and technical roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-24 bg-background relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] bg-white overflow-hidden p-2">
            <div className="p-8 md:p-16 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest border border-emerald-100">
                    <Clock className="w-4 h-4" />
                    30-Minute Discovery Session
                  </div>
                  <h2 className="text-3xl font-headline font-black italic">
                    Select Your <span className="text-emerald-600">Preferences</span>
                  </h2>
                </div>

                {/* Live Total Available Calls Counter */}
                <div className="px-5 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Total Available ({formData.date})
                    </p>
                    <p className="text-lg font-headline font-black text-slate-900">
                      {isSlotsLoading ? "Checking..." : `${totalAvailableCalls} / ${totalSlotsCapacity} Calls`}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                      Full Name
                    </label>
                    <Input
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter Name"
                      className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-600 focus:bg-white transition-all text-lg font-medium px-6"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                      Work Email
                    </label>
                    <Input
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="Enter Email"
                      className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-600 focus:bg-white transition-all text-lg font-medium px-6"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                      Phone No.
                    </label>
                    <Input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      type="tel"
                      placeholder="Enter Phone No."
                      className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-600 focus:bg-white transition-all text-lg font-medium px-6"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        Schedule Date
                      </label>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        Today or Future Only
                      </span>
                    </div>
                    <Input
                      required
                      name="date"
                      value={formData.date}
                      min={todayStr}
                      onChange={handleInputChange}
                      type="date"
                      className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-600 focus:bg-white transition-all text-lg font-medium px-6"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                      Available Time Slot
                    </label>
                    <Select required value={formData.timeSlot} onValueChange={handleSelectChange}>
                      <SelectTrigger className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:ring-emerald-600 text-lg font-medium px-6">
                        <SelectValue placeholder="Choose Time Slot" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectGroup>
                          <SelectLabel className="text-xs font-black uppercase tracking-wider text-amber-600">
                            Morning Calls (10:00 AM – 11:30 AM • 3 Slots)
                          </SelectLabel>
                          {MORNING_SLOTS.map((slot) => {
                            const booked = slotBookedCounts[slot] || 0;
                            const available = Math.max(0, MAX_CALLS_PER_SLOT - booked);
                            const isFull = available === 0;
                            return (
                              <SelectItem
                                key={slot}
                                value={slot}
                                disabled={isFull}
                                className="py-3.5 rounded-xl text-sm font-semibold"
                              >
                                {slot} — {isFull ? "Slot Full (0/2)" : `${available}/${MAX_CALLS_PER_SLOT} Available`}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel className="text-xs font-black uppercase tracking-wider text-indigo-600">
                            Evening Calls (04:00 PM – 06:00 PM • 4 Slots)
                          </SelectLabel>
                          {EVENING_SLOTS.map((slot) => {
                            const booked = slotBookedCounts[slot] || 0;
                            const available = Math.max(0, MAX_CALLS_PER_SLOT - booked);
                            const isFull = available === 0;
                            return (
                              <SelectItem
                                key={slot}
                                value={slot}
                                disabled={isFull}
                                className="py-3.5 rounded-xl text-sm font-semibold"
                              >
                                {slot} — {isFull ? "Slot Full (0/2)" : `${available}/${MAX_CALLS_PER_SLOT} Available`}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                      Subject
                    </label>
                    <Input
                      required
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter Subject"
                      className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-600 focus:bg-white transition-all text-lg font-medium px-6"
                    />
                  </div>
                </div>

                {/* Visual Morning & Evening Slot Availability Grid */}
                <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-100 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-700">
                      Live Slot Availability (Max 2 Calls Per Slot)
                    </p>
                    <span className="text-xs font-bold text-muted-foreground">
                      Total Slots: 3 Morning + 4 Evening = {ALL_SLOTS.length} Slots
                    </span>
                  </div>

                  {/* Morning Group */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600">
                      <Sun className="w-4 h-4" />
                      Morning Session (10:00 AM – 11:30 AM • 3 Calls)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {MORNING_SLOTS.map(renderSlotCard)}
                    </div>
                  </div>

                  {/* Evening Group */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600">
                      <Moon className="w-4 h-4" />
                      Evening Session (After 4:00 PM • 4 Calls)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {EVENING_SLOTS.map(renderSlotCard)}
                    </div>
                  </div>
                </div>

                <Button
                  disabled={isSubmitting || totalAvailableCalls === 0}
                  className="w-full h-20 rounded-[2rem] text-xl font-headline bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-500 shadow-2xl shadow-emerald-600/20 group relative overflow-hidden disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" /> Requesting...
                      </>
                    ) : totalAvailableCalls === 0 ? (
                      <>All Slots Booked for {formData.date}</>
                    ) : (
                      <>
                        Request Schedule{" "}
                        <CalendarDays className="w-6 h-6 transition-transform group-hover:scale-110" />
                      </>
                    )}
                  </span>
                </Button>
              </form>

              <div className="pt-10 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-tight">
                    Secure <br />Booking
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-tight">
                    Instant <br />Confirmation
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-tight">
                    Expert <br />Architects
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}

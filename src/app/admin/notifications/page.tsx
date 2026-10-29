
"use client";

import React, { useState, useEffect } from "react";
import { useFirestore, useDoc, useCollection, useMemoFirebase, setDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { doc, collection, query, orderBy } from "firebase/firestore";
import { 
  MonitorOff, 
  AlertOctagon, 
  Zap, 
  Loader2,
  Settings,
  Timer,
  Save,
  Send,
  Info,
  CheckCircle2,
  AlertTriangle,
  History,
  Calendar,
  Trash2,
  Clock,
  Layout
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function AdminNotificationsPage() {
  const db = useFirestore();
  const { toast } = useToast();

  // System Settings Refs
  const systemRef = useMemoFirebase(() => doc(db, "settings", "system"), [db]);
  const { data: systemSettings, isLoading } = useDoc(systemRef);

  // Fetch Maintenance History
  const logsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "maintenanceLogs"), orderBy("timestamp", "desc"));
  }, [db]);
  const { data: logs } = useCollection(logsQuery);

  // Local Form State
  const [maintenanceForm, setMaintenanceForm] = useState({
    isActive: false,
    startTime: "",
    endTime: "",
    message: ""
  });

  const [popupForm, setPopupForm] = useState({
    isActive: false,
    title: "",
    displayMessage: "",
    broadcastMessage: "",
    type: "info"
  });

  // Sync local state with remote data when loaded
  useEffect(() => {
    if (systemSettings) {
      setMaintenanceForm({
        isActive: systemSettings.maintenance?.isActive || false,
        startTime: systemSettings.maintenance?.startTime || "",
        endTime: systemSettings.maintenance?.endTime || "",
        message: systemSettings.maintenance?.message || "Site is currently undergoing scheduled upgrades."
      });
      setPopupForm({
        isActive: systemSettings.popup?.isActive || false,
        title: systemSettings.popup?.title || "System Announcement",
        displayMessage: systemSettings.popup?.displayMessage || "Important update available.",
        broadcastMessage: systemSettings.popup?.broadcastMessage || "",
        type: systemSettings.popup?.type || "info"
      });
    }
  }, [systemSettings]);

  // Auto-off logic for expired maintenance
  useEffect(() => {
    if (maintenanceForm.isActive && maintenanceForm.endTime) {
      const checkExpiry = () => {
        const end = new Date(maintenanceForm.endTime);
        if (!isNaN(end.getTime()) && new Date() > end) {
          // Maintenance has expired, auto-deactivate
          const updatedForm = { ...maintenanceForm, isActive: false };
          setMaintenanceForm(updatedForm);
          
          if (systemRef) {
            setDocumentNonBlocking(systemRef, {
              maintenance: updatedForm
            }, { merge: true });
            
            toast({ 
              title: "Protocol Restored", 
              description: "Restoration time completed. System auto-restored." 
            });
          }
        }
      };

      checkExpiry(); // Initial check
      const timer = setInterval(checkExpiry, 30000); // Check every 30 seconds
      return () => clearInterval(timer);
    }
  }, [maintenanceForm.isActive, maintenanceForm.endTime, systemRef, toast]);

  const saveMaintenanceSchedule = () => {
    if (!db || !systemRef) return;
    
    // Save to main settings
    setDocumentNonBlocking(systemRef, {
      maintenance: maintenanceForm
    }, { merge: true });

    // Log to history if activating
    if (maintenanceForm.isActive) {
      addDocumentNonBlocking(collection(db, "maintenanceLogs"), {
        ...maintenanceForm,
        timestamp: new Date().toISOString()
      });
    }
    
    toast({ 
      title: "Schedule Locked", 
      description: "Maintenance protocol timing has been synchronized." 
    });
  };

  // Immediate sync for Popup Toggle (Deactivation only)
  const handlePopupToggle = (active: boolean) => {
    setPopupForm(prev => ({ ...prev, isActive: active }));
    
    // If clicking OFF, save data immediately to stop the broadcast globally
    if (!active && systemRef) {
      setDocumentNonBlocking(systemRef, {
        popup: { ...popupForm, isActive: false }
      }, { merge: true });
      
      toast({ 
        title: "Broadcast Terminated", 
        description: "Global popup has been removed from the ecosystem." 
      });
    }
  };

  const savePopupBroadcast = () => {
    if (!db || !systemRef) return;
    setDocumentNonBlocking(systemRef, {
      popup: popupForm
    }, { merge: true });
    
    toast({ 
      title: "Broadcast Pushed", 
      description: "Global popup data has been updated across the ecosystem." 
    });
  };

  const handleDeleteLog = (id: string) => {
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, "maintenanceLogs", id));
    toast({ variant: "destructive", title: "Log Purged", description: "Record removed from activation history." });
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
        <div className="space-y-2">
          <h2 className="text-4xl font-headline font-black italic text-white uppercase tracking-tighter">
            System <span className="text-primary">Protocol</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Operational Infrastructure Control Center</p>
        </div>
        
        <div className="flex items-center gap-3 px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <Settings className="w-4 h-4 text-primary animate-spin-slow" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Override Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Maintenance Mode Card */}
        <Card className="bg-slate-900 border-slate-800 rounded-[3rem] overflow-hidden group border-2">
          <CardContent className="p-8 md:p-12 space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:rotate-12 transition-transform">
                  <MonitorOff className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-black italic uppercase text-white tracking-tight">Dark Protocol</h3>
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Maintenance Scheduling</p>
                </div>
              </div>
              <Switch 
                checked={maintenanceForm.isActive} 
                onCheckedChange={(v) => setMaintenanceForm({...maintenanceForm, isActive: v})}
                className="data-[state=checked]:bg-rose-600 scale-125"
              />
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Lock Initiation (Start)
                  </Label>
                  <Input 
                    type="datetime-local"
                    value={maintenanceForm.startTime}
                    onChange={e => setMaintenanceForm({...maintenanceForm, startTime: e.target.value})}
                    className="h-14 bg-slate-950 border-slate-800 text-white rounded-2xl focus:border-rose-500 px-6 font-mono text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                    <Timer className="w-3 h-3" /> Access Restoration (End)
                  </Label>
                  <Input 
                    type="datetime-local"
                    value={maintenanceForm.endTime}
                    onChange={e => setMaintenanceForm({...maintenanceForm, endTime: e.target.value})}
                    className="h-14 bg-slate-950 border-slate-800 text-white rounded-2xl focus:border-rose-500 px-6 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Public Statement</Label>
                <Textarea 
                  value={maintenanceForm.message}
                  onChange={e => setMaintenanceForm({...maintenanceForm, message: e.target.value})}
                  placeholder="Briefly explain the reason for the lock..."
                  className="bg-slate-950 border-slate-800 text-white rounded-2xl focus:border-rose-500 min-h-[100px] p-6 resize-none italic"
                />
              </div>

              <Button 
                onClick={saveMaintenanceSchedule}
                className="w-full h-16 rounded-[2rem] bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-rose-600/20 transition-all active:scale-95"
              >
                Confirm Schedule <Save className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activation History Sidebar */}
        <div className="space-y-8">
          <Card className="bg-slate-900 border-slate-800 rounded-[3rem] overflow-hidden border-2 h-full flex flex-col">
            <CardContent className="p-8 md:p-10 flex-1 flex flex-col space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-headline font-black italic uppercase text-white tracking-tight">Activation Ledger</h3>
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Protocol History Registry</p>
                </div>
                <div className="text-center p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Total Cycles</p>
                  <p className="text-2xl font-headline font-black text-primary">{logs?.length || 0}</p>
                </div>
              </div>

              <div className="flex-1 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {logs && logs.length > 0 ? (
                  logs.map((log) => (
                    <div key={log.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 group hover:border-rose-500/30 transition-all relative overflow-hidden">
                      <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> Scheduled Protocol
                          </p>
                          <p className="text-xs font-bold text-slate-300">
                            {new Date(log.startTime).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          onClick={() => handleDeleteLog(log.id)}
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-[10px] font-medium text-slate-500 relative z-10">
                        <div>
                          <p className="font-black text-[8px] uppercase text-slate-600 mb-0.5">Start</p>
                          <p className="text-slate-400">{new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div>
                          <p className="font-black text-[8px] uppercase text-slate-600 mb-0.5">Restored</p>
                          <p className="text-emerald-500">{new Date(log.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <History className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center space-y-4 bg-slate-950/50 rounded-[2rem] border border-slate-800 border-dashed">
                    <Layout className="w-10 h-10 text-slate-700 mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">History Matrix Null.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Global Popup Card */}
      <Card className="bg-slate-900 border-slate-800 rounded-[3rem] overflow-hidden group border-2">
        <CardContent className="p-8 md:p-12 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:rotate-12 transition-transform">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-headline font-black italic uppercase text-white tracking-tight">Direct Interrupt</h3>
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Global Popup Dispatch</p>
              </div>
            </div>
            <Switch 
              checked={popupForm.isActive} 
              onCheckedChange={handlePopupToggle}
              className="data-[state=checked]:bg-blue-600 scale-125"
            />
          </div>

          {popupForm.isActive && (
            <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Broadcast Heading</Label>
                  <Input 
                    value={popupForm.title}
                    onChange={e => setPopupForm({...popupForm, title: e.target.value})}
                    placeholder="e.g. Critical Update"
                    className="h-14 bg-slate-950 border-slate-800 text-white rounded-2xl focus:border-blue-500 px-6 font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Protocol Level</Label>
                  <Select value={popupForm.type} onValueChange={v => setPopupForm({...popupForm, type: v})}>
                    <SelectTrigger className="h-14 bg-slate-950 border-slate-800 text-white rounded-2xl px-6">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-slate-800 text-white rounded-xl">
                      <SelectItem value="info" className="py-3">Information</SelectItem>
                      <SelectItem value="warning" className="py-3">Critical Alert</SelectItem>
                      <SelectItem value="success" className="py-3">Launch Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Teaser Message (Brief)</Label>
                <Input 
                  value={popupForm.displayMessage}
                  onChange={e => setPopupForm({...popupForm, displayMessage: e.target.value})}
                  placeholder="Short summary for the header..."
                  className="h-14 bg-slate-950 border-slate-800 text-white rounded-2xl focus:border-blue-500 px-6"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Complete Payload (Full Context)</Label>
                <Textarea 
                  value={popupForm.broadcastMessage}
                  onChange={e => setPopupForm({...popupForm, broadcastMessage: e.target.value})}
                  placeholder="Detailed broadcast documentation..."
                  className="bg-slate-950 border-slate-800 text-white rounded-2xl focus:border-blue-500 min-h-[120px] p-6 resize-none italic"
                />
              </div>

              <Button 
                onClick={savePopupBroadcast}
                className="w-full h-16 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-95"
              >
                Initialize Broadcast <Send className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {!popupForm.isActive && (
            <div className="py-12 text-center space-y-4 bg-slate-950/50 rounded-[2rem] border border-slate-800 border-dashed">
              <AlertOctagon className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Broadcast Terminal Silent.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="pt-10 flex justify-center border-t border-slate-800/50">
        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">NPB Media Infrastructure v5.1.0 | Master Protocol Control</p>
      </div>
    </div>
  );
}

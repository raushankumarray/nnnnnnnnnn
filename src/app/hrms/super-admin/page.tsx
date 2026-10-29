
"use client";

import React, { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Power, 
  Loader2,
  Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function SuperAdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataLimit, setDataLimit] = useState(10);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    portalName: "",
    logoURL: "",
    status: "active",
    adminUsername: "",
    adminPassword: ""
  });

  const db = useFirestore();
  const { toast } = useToast();

  const companiesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "companies"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: companies, isLoading } = useCollection(companiesQuery);

  const auditQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "audit_logs"), orderBy("timestamp", "desc"));
  }, [db]);
  const { data: auditLogs } = useCollection(auditQuery);

  const resetForm = () => {
    setFormData({ name: "", portalName: "", logoURL: "", status: "active", adminUsername: "", adminPassword: "" });
    setEditingCompany(null);
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    const companyPayload = {
      name: formData.name,
      portalName: formData.portalName,
      logoURL: formData.logoURL,
      status: formData.status,
      updatedAt: new Date().toISOString()
    };

    if (editingCompany) {
      updateDocumentNonBlocking(doc(db, "companies", editingCompany.id), companyPayload);
      toast({ title: "Registry Updated", description: `${formData.name} node synchronized.` });
    } else {
      const companyRef = await addDocumentNonBlocking(collection(db, "companies"), {
        ...companyPayload,
        createdAt: new Date().toISOString()
      });

      // Create initial Company Admin
      addDocumentNonBlocking(collection(db, "hrms_users"), {
        companyId: (companyRef as any).id,
        role: "company_admin",
        fullName: `${formData.name} Admin`,
        username: formData.adminUsername,
        password: formData.adminPassword,
        status: "active"
      });

      toast({ title: "Company Provisioned", description: `${formData.name} portal is now live.` });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const toggleCompanyStatus = (id: string, current: string) => {
    const newStatus = current === 'active' ? 'disabled' : 'active';
    updateDocumentNonBlocking(doc(db, "companies", id), { status: newStatus });
    toast({ title: "Status Transition", description: `Node status changed to ${newStatus.toUpperCase()}` });
  };

  if (isLoading) {
    return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  const filteredCompanies = companies?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.portalName.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, dataLimit);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Companies", value: companies?.length || 0, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Global Users", value: "24.5k", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Security Events", value: auditLogs?.length || 0, icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Uptime Node", value: "99.9%", icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="bg-slate-900 border-slate-800 rounded-3xl overflow-hidden group hover:border-primary transition-all">
            <CardContent className="p-6 flex items-center gap-6">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{stat.label}</p>
                <h4 className="text-2xl font-headline font-black text-white">{stat.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Control Panel */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-headline font-black italic uppercase tracking-tighter">Company <span className="text-primary">Inventory</span></h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Master Tenant Directory</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search Tenants..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-slate-900 border-slate-800 pl-12 h-12 rounded-xl text-xs font-black uppercase tracking-widest"
              />
            </div>
            <select 
              value={dataLimit} 
              onChange={e => setDataLimit(Number(e.target.value))}
              className="bg-slate-900 border-slate-800 rounded-xl px-4 h-12 text-xs font-black uppercase tracking-widest focus:ring-primary text-slate-400"
            >
              <option value={10}>Show 10</option>
              <option value={25}>Show 25</option>
              <option value={50}>Show 50</option>
            </select>
            <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="h-12 px-8 bg-primary rounded-xl font-black uppercase text-[10px] tracking-widest">
              <Plus className="w-4 h-4 mr-2" /> Register Tenant
            </Button>
          </div>
        </div>

        <Card className="bg-slate-900 border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Node / Company</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Portal Identity</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Registered</th>
                  <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredCompanies?.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        {comp.logoURL ? (
                          <img src={comp.logoURL} alt="L" className="w-10 h-10 rounded-xl object-contain bg-white/5 p-1" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black italic text-primary">
                            <Building2 className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-headline font-black text-sm">{comp.name}</p>
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">ID: {comp.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-xs font-bold text-slate-300">{comp.portalName}</p>
                    </td>
                    <td className="p-6">
                      <Badge className={cn(
                        "rounded-full px-3 py-1 text-[8px] font-black uppercase border-none",
                        comp.status === 'active' ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
                      )}>
                        {comp.status}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <p className="text-[10px] font-bold text-slate-500">{new Date(comp.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => toggleCompanyStatus(comp.id, comp.status)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-800">
                          <Power className={cn("w-4 h-4", comp.status === 'active' ? "text-emerald-500" : "text-slate-500")} />
                        </Button>
                        <Button onClick={() => { setEditingCompany(comp); setFormData(comp); setIsModalOpen(true); }} variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-800">
                          <Edit3 className="w-4 h-4 text-primary" />
                        </Button>
                        <Button onClick={() => deleteDocumentNonBlocking(doc(db, "companies", comp.id))} variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-rose-500/10 text-rose-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Registration Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-slate-950 border-slate-800 text-white rounded-3xl p-0 overflow-hidden">
          <div className="bg-slate-900 p-8 border-b border-slate-800">
            <DialogTitle className="text-3xl font-headline font-black italic uppercase tracking-tighter">
              {editingCompany ? "Update" : "Register"} <span className="text-primary">Tenant</span>
            </DialogTitle>
          </div>
          
          <form onSubmit={handleSaveCompany} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 ml-2">Official Company Name</Label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-14 bg-slate-900 border-slate-800 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 ml-2">Branded Portal Name</Label>
                <Input required value={formData.portalName} onChange={e => setFormData({...formData, portalName: e.target.value})} className="h-14 bg-slate-900 border-slate-800 rounded-xl" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 ml-2">Logo Data URL / Source</Label>
                <Input value={formData.logoURL} onChange={e => setFormData({...formData, logoURL: e.target.value})} className="h-14 bg-slate-900 border-slate-800 rounded-xl" />
              </div>
            </div>

            {!editingCompany && (
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-6">
                <p className="text-xs font-black uppercase text-primary tracking-widest">Master Admin Credentials</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-2">Admin Username</Label>
                    <Input required value={formData.adminUsername} onChange={e => setFormData({...formData, adminUsername: e.target.value})} className="h-12 bg-slate-950 border-slate-800" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-2">Secure Key (Password)</Label>
                    <Input required type="password" value={formData.adminPassword} onChange={e => setFormData({...formData, adminPassword: e.target.value})} className="h-12 bg-slate-950 border-slate-800" />
                  </div>
                </div>
              </div>
            )}
          </form>

          <DialogFooter className="p-8 bg-slate-900 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-black uppercase text-[10px] tracking-widest">Abort</Button>
            <Button onClick={handleSaveCompany} className="h-12 px-10 bg-primary rounded-xl font-black uppercase text-[10px] tracking-widest">Authorize Node</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="pt-10 flex justify-center border-t border-slate-800/50">
        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">NPB HRMS Global Fabric v4.0.1 | Master Protocol Control</p>
      </div>
    </div>
  );
}

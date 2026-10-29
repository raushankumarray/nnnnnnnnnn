
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  useUser, 
  useFirestore, 
  useDoc, 
  useMemoFirebase, 
  updateDocumentNonBlocking 
} from "@/firebase";
import { doc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  Save, 
  Loader2,
  ShieldCheck,
  MapPin,
  Globe,
  Navigation,
  Building2,
  Hash,
  FileText,
  Image as ImageIcon,
  CreditCard,
  Upload,
  CheckCircle2,
  FileUp
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  fathersName: z.string().optional(),
  mobile: z.string().min(10, "Valid mobile number is required"),
  dob: z.string().min(1, "Date of birth is required"),
  // Address Fields
  fullAddress: z.string().min(5, "Full address is required"),
  block: z.string().min(1, "Block is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
  // Document Fields (Now storing data URIs)
  resumeURL: z.string().min(1, "Professional Resume is required"),
  photoURL: z.string().min(1, "Profile Photo is required"),
  idCardType: z.string().min(1, "ID Card type is required"),
  idCardURL: z.string().min(1, "ID Card Document is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileEditPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // File Input Refs
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef);

  const { 
    register, 
    handleSubmit, 
    reset,
    setValue,
    watch,
    formState: { errors } 
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      idCardType: "Aadhar Card"
    }
  });

  const selectedIdType = watch("idCardType");
  const watchResume = watch("resumeURL");
  const watchPhoto = watch("photoURL");
  const watchIdCard = watch("idCardURL");

  // Sync form with fetched data
  useEffect(() => {
    if (profileData) {
      reset({
        fullName: profileData.fullName || "",
        fathersName: profileData.fathersName || "",
        mobile: profileData.mobile || "",
        dob: profileData.dob || "",
        fullAddress: profileData.fullAddress || "",
        block: profileData.block || "",
        district: profileData.district || "",
        state: profileData.state || "",
        country: profileData.country || "India",
        pincode: profileData.pincode || "",
        resumeURL: profileData.resumeURL || "",
        photoURL: profileData.photoURL || "",
        idCardType: profileData.idCardType || "Aadhar Card",
        idCardURL: profileData.idCardURL || "",
      });
    }
  }, [profileData, reset]);

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({ 
        variant: "destructive", 
        title: "Not Supported", 
        description: "Geolocation is not supported by your browser." 
      });
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          if (data.address) {
            const addr = data.address;
            setValue("fullAddress", data.display_name || "");
            setValue("district", addr.district || addr.city_district || addr.county || addr.city || "");
            setValue("state", addr.state || "");
            setValue("country", addr.country || "India");
            setValue("pincode", addr.postcode || "");
            setValue("block", addr.suburb || addr.neighbourhood || addr.village || addr.subdistrict || "");
            
            toast({ title: "Location Detected", description: "Address fields have been auto-filled successfully." });
          }
        } catch (error) {
          toast({ variant: "destructive", title: "Detection Failed", description: "Could not resolve address details. Please fill manually." });
        } finally {
          setIsFetchingLocation(false);
        }
      },
      () => {
        setIsFetchingLocation(false);
        toast({ variant: "destructive", title: "Permission Denied", description: "Please allow location access to use this feature." });
      }
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof ProfileFormValues) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to ~800KB for Firestore documents)
    if (file.size > 800 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Please upload a file smaller than 800KB for processing.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setValue(field, base64String, { shouldValidate: true });
      toast({
        title: "File Loaded",
        description: `${file.name} is ready for upload.`,
      });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: ProfileFormValues) => {
    if (!profileRef) return;
    
    setIsUpdating(true);
    
    updateDocumentNonBlocking(profileRef, {
      ...values,
      updatedAt: new Date().toISOString()
    });

    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Profile Updated",
        description: "Your professional profile and documents have been synchronized.",
      });
      router.push("/profile");
    }, 800);
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-8">
        <h1 className="text-4xl font-headline font-black italic">Access Denied</h1>
        <Link href="/login">
          <Button size="lg" className="rounded-full px-12 h-16 bg-primary text-white">Sign In</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <Navbar />
      
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-20 space-y-10">
        <div className="space-y-6">
          <Link href="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-black uppercase tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-headline font-black italic text-slate-900 leading-none">
              Edit <span className="text-primary">Profile</span>
            </h1>
            <p className="text-muted-foreground text-xl font-medium uppercase tracking-widest text-xs">Manage your professional information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="personal" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-white p-1.5 h-auto rounded-full border-2 border-slate-100 shadow-xl w-full max-w-2xl grid grid-cols-3">
                <TabsTrigger 
                  value="personal" 
                  className="rounded-full px-4 py-3 font-headline font-black text-[10px] md:text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                >
                  Personal
                </TabsTrigger>
                <TabsTrigger 
                  value="address" 
                  className="rounded-full px-4 py-3 font-headline font-black text-[10px] md:text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                >
                  Address
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  className="rounded-full px-4 py-3 font-headline font-black text-[10px] md:text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                >
                  Documents
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="personal" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-2">
                <CardContent className="p-8 md:p-12 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <Input 
                          {...register("fullName")}
                          placeholder="Enter full name" 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium pl-14 pr-6"
                        />
                      </div>
                      {errors.fullName && <p className="text-[10px] text-destructive font-black ml-4 uppercase">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Father's Name</Label>
                      <div className="relative">
                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <Input 
                          {...register("fathersName")}
                          placeholder="Enter father's name" 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium pl-14 pr-6"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address (Locked)</Label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <Input 
                          disabled
                          value={user.email || ""}
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed pl-14 pr-6 font-medium"
                        />
                        <ShieldCheck className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 opacity-50" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Mobile Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <Input 
                          {...register("mobile")}
                          type="tel"
                          placeholder="Enter mobile number" 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium pl-14 pr-6"
                        />
                      </div>
                      {errors.mobile && <p className="text-[10px] text-destructive font-black ml-4 uppercase">{errors.mobile.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Date of Birth *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <Input 
                          {...register("dob")}
                          type="date"
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium pl-14 pr-6"
                        />
                      </div>
                      {errors.dob && <p className="text-[10px] text-destructive font-black ml-4 uppercase">{errors.dob.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-2">
                <CardContent className="p-8 md:p-12 space-y-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-headline font-black italic">Postal Location</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Provide your primary residence details</p>
                    </div>
                    <Button 
                      type="button"
                      onClick={fetchCurrentLocation}
                      disabled={isFetchingLocation}
                      variant="outline"
                      className="rounded-full h-12 px-6 border-2 border-slate-100 hover:border-primary hover:bg-primary/5 transition-all text-[10px] font-black uppercase tracking-widest group"
                    >
                      {isFetchingLocation ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                      )}
                      Fetch Current Location
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-1 md:col-span-2 space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Full Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <Input 
                          {...register("fullAddress")}
                          placeholder="House No, Street, Landmark..." 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium pl-14 pr-6"
                        />
                      </div>
                      {errors.fullAddress && <p className="text-[10px] text-destructive font-black ml-4 uppercase">{errors.fullAddress.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Block / Area *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <Input 
                          {...register("block")}
                          placeholder="Enter block or area" 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium pl-14 pr-6"
                        />
                      </div>
                      {errors.block && <p className="text-[10px] text-destructive font-black ml-4 uppercase">{errors.block.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">District *</Label>
                      <div className="relative">
                        <Navigation className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <Input 
                          {...register("district")}
                          placeholder="Enter district" 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium pl-14 pr-6"
                        />
                      </div>
                      {errors.district && <p className="text-[10px] text-destructive font-black ml-4 uppercase">{errors.district.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">State *</Label>
                      <div className="relative">
                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <Input 
                          {...register("state")}
                          placeholder="Enter state" 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium pl-14 pr-6"
                        />
                      </div>
                      {errors.state && <p className="text-[10px] text-destructive font-black ml-4 uppercase">{errors.state.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Country *</Label>
                      <div className="relative">
                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <Input 
                          {...register("country")}
                          placeholder="Enter country" 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium pl-14 pr-6"
                        />
                      </div>
                      {errors.country && <p className="text-[10px] text-destructive font-black ml-4 uppercase">{errors.country.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Pincode *</Label>
                      <div className="relative">
                        <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <Input 
                          {...register("pincode")}
                          placeholder="6-digit PIN" 
                          className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all text-lg font-medium pl-14 pr-6"
                        />
                      </div>
                      {errors.pincode && <p className="text-[10px] text-destructive font-black ml-4 uppercase">{errors.pincode.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-2">
                <CardContent className="p-8 md:p-12 space-y-10">
                  <div className="space-y-1 pb-6 border-b border-slate-100">
                    <h3 className="text-2xl font-headline font-black italic">Professional Credentials</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Upload your documents directly from your device</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Resume Upload */}
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Professional Resume (PDF/JPEG) *</Label>
                      <div 
                        onClick={() => resumeInputRef.current?.click()}
                        className={cn(
                          "h-32 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-slate-50",
                          watchResume ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200"
                        )}
                      >
                        <input 
                          type="file" 
                          ref={resumeInputRef} 
                          className="hidden" 
                          accept=".pdf,image/jpeg,image/png"
                          onChange={(e) => handleFileChange(e, "resumeURL")}
                        />
                        {watchResume ? (
                          <>
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase">File Selected</span>
                          </>
                        ) : (
                          <>
                            <FileUp className="w-8 h-8 text-slate-300" />
                            <span className="text-[10px] font-black text-slate-400 uppercase">Click to Browse</span>
                          </>
                        )}
                      </div>
                      {errors.resumeURL && <p className="text-[10px] text-destructive font-black ml-4 uppercase">{errors.resumeURL.message}</p>}
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Profile Photo (JPEG) *</Label>
                      <div 
                        onClick={() => photoInputRef.current?.click()}
                        className={cn(
                          "h-32 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-slate-50",
                          watchPhoto ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200"
                        )}
                      >
                        <input 
                          type="file" 
                          ref={photoInputRef} 
                          className="hidden" 
                          accept="image/jpeg,image/png"
                          onChange={(e) => handleFileChange(e, "photoURL")}
                        />
                        {watchPhoto ? (
                          <>
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase">File Selected</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                            <span className="text-[10px] font-black text-slate-400 uppercase">Click to Browse</span>
                          </>
                        )}
                      </div>
                      {errors.photoURL && <p className="text-[10px] text-destructive font-black ml-4 uppercase">{errors.photoURL.message}</p>}
                    </div>

                    {/* ID Card Type Selection */}
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Identity Card Type *</Label>
                      <Select 
                        value={selectedIdType} 
                        onValueChange={(val) => setValue("idCardType", val)}
                      >
                        <SelectTrigger className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:ring-primary text-lg font-medium px-6">
                          <SelectValue placeholder="Select ID Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                          {["Aadhar Card", "Pan Card", "Voter Card", "Driving License", "Passport"].map((type) => (
                            <SelectItem key={type} value={type} className="py-4 rounded-xl text-base font-medium">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* ID Card Upload */}
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">{selectedIdType} Document *</Label>
                      <div 
                        onClick={() => idCardInputRef.current?.click()}
                        className={cn(
                          "h-16 border-2 border-dashed rounded-2xl flex items-center justify-center gap-3 cursor-pointer transition-all hover:bg-slate-50 px-6",
                          watchIdCard ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200"
                        )}
                      >
                        <input 
                          type="file" 
                          ref={idCardInputRef} 
                          className="hidden" 
                          accept=".pdf,image/jpeg,image/png"
                          onChange={(e) => handleFileChange(e, "idCardURL")}
                        />
                        {watchIdCard ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase">Document Selected</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5 text-slate-300" />
                            <span className="text-[10px] font-black text-slate-400 uppercase">Click to Select ID File</span>
                          </>
                        )}
                      </div>
                      {errors.idCardURL && <p className="text-[10px] text-destructive font-black ml-4 uppercase">{errors.idCardURL.message}</p>}
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-start gap-4">
                    <Upload className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                    <div className="space-y-1">
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Information Security</p>
                      <p className="text-sm font-medium text-blue-800 leading-relaxed">Your documents are processed through our encrypted verification pipeline. Only authorized NPB Media hiring leads can access these credentials.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="pt-8">
            <Button 
              disabled={isUpdating}
              className="w-full h-20 rounded-[2rem] text-xl font-headline bg-primary text-white hover:bg-foreground transition-all duration-500 shadow-2xl group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isUpdating ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Syncing...</>
                ) : (
                  <>Update Details <Save className="w-6 h-6 transition-transform group-hover:scale-110" /></>
                )}
              </span>
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}

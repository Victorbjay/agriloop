
"use client";

import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WASTE_TYPES, WASTE_CONDITIONS, QUALITY_GRADES } from '@/lib/constants';
import { Sparkles, Loader2, MapPin, Package, TrendingUp, Camera, X, ShieldAlert, Lock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { generateListingDescription } from '@/ai/flows/ai-listing-description-generator';
import { aiWasteValorizationSuggestion } from '@/ai/flows/ai-waste-valorization-suggestion';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { UserProfile, Listing } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function EditListingPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const listingRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'listings', id as string);
  }, [firestore, id]);

  const { data: listing, isLoading: listingLoading } = useDoc<Listing>(listingRef);

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading: profileLoading } = useDoc<UserProfile>(profileRef);
  
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isOtherType, setIsOtherType] = useState(false);
  const [customType, setCustomType] = useState('');
  
  const [formData, setFormData] = useState({
    wasteType: '' as any,
    condition: 'dried' as any,
    quantityKg: 0,
    qualityGrade: 'standard' as any,
    locationAddress: '',
    description: '',
    pricePerKg: 0,
    moqKg: 100
  });

  const [suggestions, setSuggestions] = useState<any>(null);

  useEffect(() => {
    if (listing) {
      setFormData({
        wasteType: listing.wasteType,
        condition: listing.condition,
        quantityKg: listing.quantityKg,
        qualityGrade: listing.qualityGrade,
        locationAddress: listing.locationAddress,
        description: listing.description || '',
        pricePerKg: listing.pricePerKg,
        moqKg: listing.moqKg
      });
      
      const isKnownType = WASTE_TYPES.some(t => t.value === listing.wasteType);
      if (!isKnownType && listing.wasteType !== 'other') {
        setIsOtherType(true);
        setCustomType(listing.wasteTypeLabel);
      } else if (listing.wasteType === 'other') {
        setIsOtherType(true);
        setCustomType(listing.wasteTypeLabel);
      }
      
      if (listing.images && listing.images.length > 0) {
        setPreviewImage(listing.images[0]);
      }
    }
  }, [listing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ 
          variant: "destructive", 
          title: "File too large", 
          description: "Please select an image smaller than 2MB." 
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const effectiveWasteType = isOtherType ? 'other' : formData.wasteType;
  const effectiveTypeLabel = isOtherType ? customType : (WASTE_TYPES.find(t => t.value === formData.wasteType)?.label || '');

  const handleAiDescription = async () => {
    if (!effectiveWasteType || !formData.quantityKg) {
      toast({ title: "Details required", description: "Please provide waste type and quantity first." });
      return;
    }
    setLoading(true);
    try {
      const result = await generateListingDescription({
        wasteType: effectiveTypeLabel,
        condition: formData.condition,
        quantityKg: Number(formData.quantityKg)
      });
      setFormData(prev => ({ ...prev, description: result.description }));
      toast({ title: "AI Generated", description: "Listing description is ready." });
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error", description: "Could not generate description." });
    } finally {
      setLoading(false);
    }
  };

  const handleAiPricing = async () => {
    if (!effectiveWasteType || !formData.locationAddress) {
      toast({ title: "Details required", description: "Waste type and location are needed for market analysis." });
      return;
    }
    setLoading(true);
    try {
      const result = await aiWasteValorizationSuggestion({
        wasteTypeLabel: effectiveTypeLabel,
        condition: formData.condition,
        quantityKg: Number(formData.quantityKg),
        qualityGrade: formData.qualityGrade,
        locationAddress: formData.locationAddress,
        description: formData.description
      });
      setSuggestions(result);
      toast({ title: "Suggestions Ready", description: "Check out the pricing and use cases suggested." });
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error", description: "Could not fetch market suggestions." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!user || !listingRef || !listing) return;

    if (listing.sellerId !== user.uid) {
      toast({ variant: "destructive", title: "Unauthorized", description: "You can only edit your own listings." });
      return;
    }

    if (!effectiveWasteType || !formData.pricePerKg || !formData.locationAddress) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Please fill in all required fields." });
      return;
    }

    setUpdating(true);
    
    const listingUpdateData = {
      wasteType: effectiveWasteType,
      wasteTypeLabel: effectiveTypeLabel,
      condition: formData.condition,
      quantityKg: Number(formData.quantityKg),
      pricePerKg: Number(formData.pricePerKg),
      totalPrice: Number(formData.pricePerKg) * Number(formData.quantityKg),
      moqKg: Number(formData.moqKg),
      qualityGrade: formData.qualityGrade,
      locationAddress: formData.locationAddress,
      description: formData.description,
      images: previewImage ? [previewImage] : (listing.images || []),
      updatedAt: new Date().toISOString(),
    };

    updateDocumentNonBlocking(listingRef, listingUpdateData);
    
    toast({ title: "Success!", description: "Your listing has been updated." });
    router.push('/dashboard');
  };

  if (isUserLoading || profileLoading || listingLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-6">
          <div className="bg-muted rounded-full p-6">
            <Lock className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black">Login Required</h1>
            <p className="text-muted-foreground">Sign in to manage your listings.</p>
          </div>
          <Button asChild><Link href="/login">Sign In</Link></Button>
        </main>
      </div>
    );
  }

  if (listing && listing.sellerId !== user.uid) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-6">
          <div className="bg-destructive/10 rounded-full p-6">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black">Unauthorized</h1>
            <p className="text-muted-foreground">You don't have permission to edit this listing.</p>
          </div>
          <Button asChild variant="outline"><Link href="/dashboard">Back to Dashboard</Link></Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black">Edit Listing</h1>
          <p className="text-muted-foreground">Update your waste product details.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Photo</Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted/80"
                  >
                    {previewImage ? (
                      <>
                        <Image 
                          src={previewImage} 
                          alt="Preview" 
                          fill 
                          className="rounded-2xl object-cover" 
                        />
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Camera className="h-10 w-10 opacity-50" />
                        <p className="text-sm font-bold">Upload new photo</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Waste Type</Label>
                    <Select value={formData.wasteType} onValueChange={(v) => {
                      if (v === 'other') {
                        setIsOtherType(true);
                        setFormData(p => ({ ...p, wasteType: 'other' }));
                      } else {
                        setIsOtherType(false);
                        setFormData(p => ({ ...p, wasteType: v }));
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {WASTE_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isOtherType && (
                      <div className="mt-3">
                        <Input 
                          placeholder="Specify Waste Type"
                          value={customType}
                          onChange={(e) => setCustomType(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select value={formData.condition} onValueChange={(v) => setFormData(p => ({ ...p, condition: v as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WASTE_CONDITIONS.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Quantity (KG)</Label>
                    <Input 
                      type="number" 
                      value={formData.quantityKg || ''}
                      onChange={(e) => setFormData(p => ({ ...p, quantityKg: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quality Grade</Label>
                    <Select value={formData.qualityGrade} onValueChange={(v) => setFormData(p => ({ ...p, qualityGrade: v as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUALITY_GRADES.map(q => (
                          <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Description</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleAiDescription}
                      disabled={loading}
                      className="text-primary"
                    >
                      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
                      Re-generate Description
                    </Button>
                  </div>
                  <Textarea 
                    className="min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location & Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Pickup Address</Label>
                  <Input 
                    value={formData.locationAddress}
                    onChange={(e) => setFormData(p => ({ ...p, locationAddress: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Price per KG (₦)</Label>
                    <Button variant="ghost" size="sm" onClick={handleAiPricing} disabled={loading} className="text-accent">
                      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                      Market Suggestions
                    </Button>
                  </div>
                  <Input 
                    type="number" 
                    value={formData.pricePerKg || ''}
                    onChange={(e) => setFormData(p => ({ ...p, pricePerKg: Number(e.target.value) }))}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
               <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
               <Button 
                className="px-10 font-bold" 
                onClick={handleUpdate}
                disabled={updating}
               >
                 {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Update Listing
               </Button>
            </div>
          </div>

          <aside className="space-y-6">
            {suggestions && (
              <Card className="border-none bg-primary text-primary-foreground shadow-lg">
                <CardHeader><CardTitle className="text-lg">Value-Added Uses</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {suggestions.valueAddedUses.map((use: string, idx: number) => (
                      <li key={idx} className="flex gap-2"><span className="font-bold opacity-60">{idx+1}.</span> {use}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

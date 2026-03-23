"use client";

import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WASTE_TYPES, WASTE_CONDITIONS, QUALITY_GRADES } from '@/lib/constants';
import { Sparkles, Loader2, MapPin, DollarSign, Package } from 'lucide-react';
import { useState } from 'react';
import { generateListingDescription } from '@/ai/flows/ai-listing-description-generator';
import { aiWasteValorizationSuggestion } from '@/ai/flows/ai-waste-valorization-suggestion';
import { useToast } from '@/hooks/use-toast';

export default function CreateListingPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    wasteType: '' as any,
    condition: 'dried' as any,
    quantityKg: 0,
    qualityGrade: 'standard' as any,
    locationAddress: '',
    description: '',
    pricePerKg: 0
  });

  const [suggestions, setSuggestions] = useState<any>(null);

  const handleAiDescription = async () => {
    if (!formData.wasteType || !formData.quantityKg) {
      toast({ title: "Details required", description: "Please select waste type and quantity first." });
      return;
    }
    setLoading(true);
    try {
      const result = await generateListingDescription({
        wasteType: formData.wasteType,
        condition: formData.condition,
        quantityKg: Number(formData.quantityKg)
      });
      setFormData(prev => ({ ...prev, description: result.description }));
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error", description: "Could not generate description." });
    } finally {
      setLoading(false);
    }
  };

  const handleAiPricing = async () => {
    if (!formData.wasteType || !formData.locationAddress) {
      toast({ title: "Details required", description: "Waste type and location are needed for market analysis." });
      return;
    }
    setLoading(true);
    try {
      const typeLabel = WASTE_TYPES.find(t => t.value === formData.wasteType)?.label || '';
      const result = await aiWasteValorizationSuggestion({
        wasteTypeLabel: typeLabel,
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black">Create New Listing</h1>
          <p className="text-muted-foreground">List your agricultural waste for buyers to discover.</p>
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Waste Type</Label>
                    <Select onValueChange={(v) => setFormData(p => ({ ...p, wasteType: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {WASTE_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select defaultValue="dried" onValueChange={(v) => setFormData(p => ({ ...p, condition: v as any }))}>
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
                      placeholder="e.g. 500" 
                      onChange={(e) => setFormData(p => ({ ...p, quantityKg: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quality Grade</Label>
                    <Select defaultValue="standard" onValueChange={(v) => setFormData(p => ({ ...p, qualityGrade: v as any }))}>
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
                      className="text-primary hover:text-primary/80"
                    >
                      {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                      AI Generate
                    </Button>
                  </div>
                  <Textarea 
                    placeholder="Describe your waste product..." 
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
                    placeholder="Enter full location address" 
                    onChange={(e) => setFormData(p => ({ ...p, locationAddress: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Price per KG (₦)</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleAiPricing}
                      disabled={loading}
                      className="text-accent hover:text-accent/80"
                    >
                      {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <TrendingUp className="mr-1 h-3 w-3" />}
                      Market Suggestions
                    </Button>
                  </div>
                  <Input 
                    type="number" 
                    placeholder="Enter amount" 
                    value={formData.pricePerKg || ''}
                    onChange={(e) => setFormData(p => ({ ...p, pricePerKg: Number(e.target.value) }))}
                  />
                  {suggestions && (
                    <div className="rounded-xl bg-accent/5 p-4 border border-accent/20">
                      <p className="text-xs font-bold text-accent uppercase mb-2">AI Market Insight</p>
                      <p className="text-sm font-bold">Suggested: <span className="text-accent">{suggestions.suggestedPriceRangePerKg}</span></p>
                      <p className="mt-2 text-xs text-muted-foreground">{suggestions.marketTrendsSummary}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
               <Button variant="outline">Save Draft</Button>
               <Button className="px-10">Publish Listing</Button>
            </div>
          </div>

          <aside className="space-y-6">
            {suggestions && suggestions.valueAddedUses && (
              <Card className="border-none bg-primary text-primary-foreground shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Value-Added Uses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {suggestions.valueAddedUses.map((use: string, idx: number) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="font-bold opacity-60">{idx+1}.</span>
                        {use}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            <Card className="border-none shadow-sm bg-muted/50">
              <CardContent className="p-4 text-xs text-muted-foreground italic">
                Tips: Listings with AI-generated descriptions tend to sell 40% faster on AgriLoop.
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
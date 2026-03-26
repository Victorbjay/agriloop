
"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Scale, 
  ShieldCheck, 
  Calendar, 
  ArrowLeft,
  Package,
  Info,
  Loader2,
  CreditCard,
  PlusCircle,
  Truck
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDoc, useFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Listing, UserProfile } from '@/types';
import { useMemoFirebase } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/cart-context';
import { useState, useEffect } from 'react';

export default function ListingDetailPage() {
  const { id } = useParams();
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { addToCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);

  const listingRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'listings', id as string);
  }, [firestore, id]);

  const { data: listing, isLoading } = useDoc<Listing>(listingRef);

  const sellerRef = useMemoFirebase(() => {
    if (!firestore || !listing?.sellerId) return null;
    return doc(firestore, 'users', listing.sellerId);
  }, [firestore, listing?.sellerId]);

  const { data: sellerProfile } = useDoc<UserProfile>(sellerRef);

  useEffect(() => {
    if (listing) {
      setSelectedQuantity(listing.moqKg);
    }
  }, [listing]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Listing not found.</h1>
        <Button asChild><Link href="/marketplace">Return to Marketplace</Link></Button>
      </div>
    );
  }

  const handleQuantityChange = (val: string) => {
    const num = parseInt(val);
    if (isNaN(num)) return;
    
    // Constraint check
    if (num > listing.quantityKg) {
      setSelectedQuantity(listing.quantityKg);
    } else {
      setSelectedQuantity(num);
    }
  };

  const handleAddToCart = () => {
    if (selectedQuantity < listing.moqKg) {
      toast({ 
        variant: "destructive", 
        title: "Below MOQ", 
        description: `This seller requires a minimum order of ${listing.moqKg}kg.` 
      });
      return;
    }
    addToCart(listing, selectedQuantity);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Link 
          href="/marketplace" 
          className="mb-6 flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg border-4 border-white">
              <Image 
                src={listing.images?.[0] || `https://picsum.photos/seed/${listing.id}/800/600`} 
                alt={listing.wasteTypeLabel} 
                fill 
                className="object-cover"
              />
            </div>
            
            <Card className="border-none shadow-sm bg-primary/5 border border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Truck className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-bold text-lg">Self-Pickup Available</h3>
                    <p className="text-sm text-muted-foreground">This item is located in {listing.locationAddress.split(',').slice(-1)[0].trim()}. Coordinate with the seller after secure payment.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary">{listing.wasteTypeLabel}</Badge>
                <Badge variant="secondary">{listing.condition}</Badge>
                {listing.sellerBadge !== 'none' && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-white">
                    <ShieldCheck className="h-3 w-3 text-primary" />
                    {listing.sellerBadge} Seller
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-black text-foreground">{listing.wasteTypeLabel}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">{listing.locationAddress}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Price per KG</p>
                <p className="text-3xl font-black text-primary">₦{listing.pricePerKg.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Available</p>
                <p className="text-2xl font-black">{listing.quantityKg.toLocaleString()}kg</p>
              </div>
            </div>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quantity" className="font-bold text-lg">Select Quantity (kg)</Label>
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">MOQ: {listing.moqKg}kg</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Input 
                      id="quantity"
                      type="number"
                      min={listing.moqKg}
                      max={listing.quantityKg}
                      value={selectedQuantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="h-14 text-xl font-black text-primary rounded-xl focus-visible:ring-primary border-2"
                    />
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-muted-foreground uppercase">Selection Total</p>
                      <p className="text-2xl font-black text-foreground">₦{(listing.pricePerKg * selectedQuantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 border-t">
                  <Info className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-bold">About this Biomass</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{listing.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    <span className="text-sm">MOQ: <b>{listing.moqKg}kg</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-sm">Grade: <b>{listing.qualityGrade}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm">Listed: <b>{new Date(listing.createdAt).toLocaleDateString()}</b></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                variant="outline"
                className="flex-1 font-bold h-16 border-2 rounded-2xl shadow-sm hover:bg-primary/5 hover:text-primary transition-all"
                onClick={handleAddToCart}
              >
                <PlusCircle className="mr-2 h-6 w-6" /> Add to Cart
              </Button>
              <Button 
                size="lg" 
                className="flex-1 font-bold h-16 bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl rounded-2xl text-lg"
                asChild
              >
                <Link href="/cart">
                  <CreditCard className="mr-2 h-6 w-6" /> Buy Now
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border/50">
               <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xl">
                 {listing.sellerName[0]}
               </div>
               <div>
                 <p className="font-bold">{listing.sellerName}</p>
                 <p className="text-xs text-muted-foreground">Verified AgriLoop Bio-Economy Partner</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

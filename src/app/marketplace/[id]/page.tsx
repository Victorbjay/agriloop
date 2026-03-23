"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Scale, 
  ShieldCheck, 
  Calendar, 
  ArrowLeft,
  Phone,
  MessageSquare,
  Package,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function ListingDetailPage() {
  const { id } = useParams();

  // Simulated listing detail
  const listing = {
    id: id,
    sellerName: "GreenField Cassava Processing",
    sellerBadge: "silver",
    wasteTypeLabel: "Cassava Peels",
    condition: "Dried",
    quantityKg: 2500,
    pricePerKg: 45,
    totalPrice: 112500,
    moqKg: 500,
    qualityGrade: "Premium",
    location: "Abeokuta Expressway, Ogun State",
    description: "High-quality sun-dried cassava peels. Low moisture content, ideal for livestock feed or biomass energy production. Bagged and ready for immediate pickup.",
    availableFrom: "2024-03-20",
    images: [`https://picsum.photos/seed/${id}/800/600`]
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
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
              <Image 
                src={listing.images[0]} 
                alt={listing.wasteTypeLabel} 
                fill 
                className="object-cover"
                data-ai-hint="agricultural waste"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                   <Image 
                    src={`https://picsum.photos/seed/thumb-${i}/200/200`} 
                    alt="Thumbnail" 
                    fill 
                    className="object-cover opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                   />
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary">{listing.wasteTypeLabel}</Badge>
                <Badge variant="secondary">{listing.condition}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  {listing.sellerBadge} Seller
                </Badge>
              </div>
              <h1 className="text-4xl font-black text-foreground">{listing.wasteTypeLabel} - {listing.quantityKg}kg</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">{listing.location}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Price per KG</p>
                <p className="text-3xl font-black text-primary">₦{listing.pricePerKg}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Estimated Total</p>
                <p className="text-2xl font-black">₦{listing.totalPrice.toLocaleString()}</p>
              </div>
            </div>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-bold">Description</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{listing.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">MOQ: <b>{listing.moqKg}kg</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Grade: <b>{listing.qualityGrade}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Available: <b>{listing.availableFrom}</b></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1 font-bold h-14 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                Proceed to Checkout
              </Button>
              <Button size="icon" variant="outline" className="h-14 w-14 rounded-xl">
                <MessageSquare className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="outline" className="h-14 w-14 rounded-xl">
                <Phone className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50">
               <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                 GF
               </div>
               <div>
                 <p className="font-bold">{listing.sellerName}</p>
                 <p className="text-xs text-muted-foreground">Joined 2 years ago • 45 successful deals</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

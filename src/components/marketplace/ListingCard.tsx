
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Scale, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { Listing } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const showBadge = listing.sellerBadge === 'silver' || listing.sellerBadge === 'gold';

  const badgeColor = {
    none: 'bg-muted text-muted-foreground',
    bronze: 'bg-orange-100 text-orange-700 border-orange-200',
    silver: 'bg-slate-100 text-slate-700 border-slate-200',
    gold: 'bg-amber-100 text-amber-700 border-amber-200',
  }[listing.sellerBadge || 'none'];

  return (
    <Card className="group overflow-hidden border-none shadow-md transition-all hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={listing.images?.[0] || `https://picsum.photos/seed/${listing.id}/600/400`}
          alt={listing.wasteTypeLabel}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <Badge className="bg-primary/90 backdrop-blur-sm">{listing.wasteTypeLabel}</Badge>
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground">
            {listing.condition}
          </Badge>
        </div>
        {showBadge && (
          <div className="absolute right-2 top-2">
            <Badge className={cn("flex items-center gap-1 border", badgeColor)}>
              <ShieldCheck className="h-3 w-3" />
              <span className="capitalize">{listing.sellerBadge}</span>
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="line-clamp-1 text-lg font-bold text-foreground">
            {listing.wasteTypeLabel} ({listing.quantityKg.toLocaleString()}kg)
          </h3>
          <p className="text-xl font-black text-primary">₦{listing.pricePerKg}/kg</p>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="line-clamp-1">{listing.locationAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 shrink-0 text-primary" />
            <span>MOQ: {listing.moqKg}kg</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 shrink-0 text-accent" />
            <span className="font-medium text-foreground">By {listing.sellerName}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 p-4">
        <Button size="lg" className="w-full font-bold flex gap-2 rounded-xl" asChild>
          <Link href={`/marketplace/${listing.id}`}>
            View & Select Quantity <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

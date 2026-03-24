"use client";

import { Listing } from '@/types';
import { Card } from '@/components/ui/card';
import { MapPin, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MapViewProps {
  listings: Listing[];
}

export default function MapView({ listings }: MapViewProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Nigeria center coords for placeholder map logic
  // In a real app with Google Maps, this would be dynamic
  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-inner border-4 border-white">
      {/* Simulation of an interactive map background */}
      <div className="absolute inset-0 grayscale opacity-40">
        <Image 
          src="https://picsum.photos/seed/nigeria-map/1200/800" 
          alt="Map Background" 
          fill 
          className="object-cover"
          data-ai-hint="satellite map"
        />
      </div>

      {/* Simulated Grid overlay to make it look technical */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#16a34a 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />

      {/* Map Markers Simulation */}
      {listings.map((listing, idx) => {
        // Deterministic positioning for simulation based on ID
        const top = (30 + (idx * 15) % 40) + '%';
        const left = (20 + (idx * 25) % 60) + '%';
        
        return (
          <div 
            key={listing.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
            style={{ top, left }}
          >
            <button 
              onClick={() => setSelectedListing(listing)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-xl transition-all",
                selectedListing?.id === listing.id ? "bg-accent scale-125" : "bg-primary"
              )}
            >
              <MapPin className="h-5 w-5 text-white" />
            </button>
            
            {/* Tooltip labels for high-value listings */}
            {idx < 3 && (
               <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-black shadow-sm">
                 ₦{listing.pricePerKg}/kg
               </div>
            )}
          </div>
        );
      })}

      {/* Map UI Elements */}
      <div className="absolute top-6 right-6 flex flex-col gap-2">
        <div className="rounded-xl bg-white/90 backdrop-blur p-3 shadow-lg border border-white/50 space-y-2">
          <p className="text-[10px] font-black uppercase text-muted-foreground">Map Insights</p>
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>Active Listings</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="h-3 w-3 rounded-full bg-accent" />
            <span>Selected</span>
          </div>
        </div>
      </div>

      {/* Selection Detail Panel */}
      {selectedListing && (
        <Card className="absolute bottom-6 left-6 right-6 md:left-auto md:w-80 border-none shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="relative h-32 w-full">
            <Image 
              src={selectedListing.images?.[0] || `https://picsum.photos/seed/${selectedListing.id}/400/200`}
              alt="Listing"
              fill
              className="object-cover"
            />
            <button 
              onClick={() => setSelectedListing(null)}
              className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h4 className="font-black text-lg leading-tight">{selectedListing.wasteTypeLabel}</h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {selectedListing.locationAddress}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary font-black">₦{selectedListing.pricePerKg}/kg</span>
              <span className="text-xs font-bold bg-muted px-2 py-1 rounded">{selectedListing.quantityKg}kg available</span>
            </div>
            <Button size="sm" className="w-full font-bold" asChild>
              <Link href={`/marketplace/${selectedListing.id}`}>
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Empty State Instruction */}
      {!selectedListing && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/80 backdrop-blur px-6 py-2 shadow-lg border border-white/50 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <p className="text-sm font-bold">Tap a location pin to view details</p>
        </div>
      )}
    </div>
  );
}

import Navbar from '@/components/layout/Navbar';
import ListingCard from '@/components/marketplace/ListingCard';
import FilterPanel from '@/components/marketplace/FilterPanel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Map as MapIcon, Grid as GridIcon } from 'lucide-react';
import { Listing } from '@/types';
import { Timestamp } from 'firebase/firestore';

// Mock data based on seed requirements
const mockListings: Listing[] = [
  {
    id: '1',
    sellerId: 's1',
    sellerName: 'GreenField Cassava Processing',
    sellerBadge: 'silver',
    wasteType: 'cassava_peels',
    wasteTypeLabel: 'Cassava Peels',
    condition: 'dried',
    quantityKg: 2500,
    pricePerKg: 45,
    totalPrice: 112500,
    moqKg: 500,
    qualityGrade: 'premium',
    availableFrom: Timestamp.now(),
    location: { address: 'Abeokuta Expressway, Ogun State', coordinates: { lat: 7.1475, lng: 3.3619 }, geohash: 's' },
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '2',
    sellerId: 's2',
    sellerName: 'Lagos Rice Mill Cooperative',
    sellerBadge: 'bronze',
    wasteType: 'rice_husk',
    wasteTypeLabel: 'Rice Husk',
    condition: 'dried',
    quantityKg: 5000,
    pricePerKg: 30,
    totalPrice: 150000,
    moqKg: 1000,
    qualityGrade: 'standard',
    availableFrom: Timestamp.now(),
    location: { address: 'Epe, Lagos State', coordinates: { lat: 6.5842, lng: 3.9856 }, geohash: 's' },
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '3',
    sellerId: 's3',
    sellerName: 'Sunrise Poultry Farm',
    sellerBadge: 'bronze',
    wasteType: 'poultry_manure',
    wasteTypeLabel: 'Poultry Manure',
    condition: 'fresh',
    quantityKg: 1000,
    pricePerKg: 60,
    totalPrice: 60000,
    moqKg: 200,
    qualityGrade: 'premium',
    availableFrom: Timestamp.now(),
    location: { address: 'Ikorodu, Lagos State', coordinates: { lat: 6.6194, lng: 3.5105 }, geohash: 's' },
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '4',
    sellerId: 's4',
    sellerName: 'Timber Wood Mills',
    sellerBadge: 'gold',
    wasteType: 'sawdust',
    wasteTypeLabel: 'Sawdust',
    condition: 'dried',
    quantityKg: 10000,
    pricePerKg: 15,
    totalPrice: 150000,
    moqKg: 2000,
    qualityGrade: 'standard',
    availableFrom: Timestamp.now(),
    location: { address: 'Ibadan, Oyo State', coordinates: { lat: 7.3775, lng: 3.9470 }, geohash: 's' },
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">Marketplace</h1>
            <p className="text-muted-foreground">Find high-quality agricultural waste near you.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              Map View
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <GridIcon className="h-4 w-4" />
              Grid View
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <FilterPanel />
          </aside>

          <div className="space-y-6">
            <div className="relative flex w-full max-w-2xl items-center">
              <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search waste type, location, or seller..." 
                className="h-12 pl-10 pr-24 shadow-sm"
              />
              <Button className="absolute right-1 h-10 px-6">Search</Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {mockListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
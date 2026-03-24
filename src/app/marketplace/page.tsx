"use client";

import Navbar from '@/components/layout/Navbar';
import ListingCard from '@/components/marketplace/ListingCard';
import FilterPanel from '@/components/marketplace/FilterPanel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Map as MapIcon, Grid as GridIcon, Loader2, Filter } from 'lucide-react';
import { Listing } from '@/types';
import { useCollection, useMemoFirebase, useFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function MarketplacePage() {
  const { firestore } = useFirebase();

  const activeListingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'listings'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore]);

  const { data: listings, isLoading } = useCollection<Listing>(activeListingsQuery);

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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left">
                  <SheetTitle className="text-2xl font-black">Filters</SheetTitle>
                </SheetHeader>
                <div className="py-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="outline" className="flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Map View</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <GridIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Grid View</span>
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
                placeholder="Search waste type, location..." 
                className="h-12 pl-10 pr-24 shadow-sm"
              />
              <Button className="absolute right-1 h-10 px-6">Search</Button>
            </div>

            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : listings && listings.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl bg-muted/50 text-center px-4">
                <p className="text-xl font-bold">No active listings found.</p>
                <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
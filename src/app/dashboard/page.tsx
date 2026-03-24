"use client";

import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  ShieldCheck,
  Package,
  ArrowRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useUser, useCollection, useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, doc } from 'firebase/firestore';
import { Listing, Order, UserProfile } from '@/types';
import Image from 'next/image';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();

  // Fetch user profile for name display
  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading: profileLoading } = useDoc<UserProfile>(profileRef);

  // Fetch user's listings
  const userListingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'listings'),
      where('sellerId', '==', user.uid),
      limit(20)
    );
  }, [firestore, user]);

  const { data: listings, isLoading: listingsLoading } = useCollection<Listing>(userListingsQuery);

  // Fetch user's orders (as seller)
  const userOrdersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'orders'),
      where('sellerId', '==', user.uid),
      limit(20)
    );
  }, [firestore, user]);

  const { data: orders, isLoading: ordersLoading } = useCollection<Order>(userOrdersQuery);

  if (isUserLoading || profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Please log in to view your dashboard.</h1>
        <Button asChild><Link href="/login">Go to Login</Link></Button>
      </div>
    );
  }

  const welcomeName = profile ? `${profile.firstName} ${profile.lastName}` : (user.displayName || 'Agro-Partner');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-foreground">Welcome back, {welcomeName}</h1>
            <p className="text-muted-foreground">Your account is currently <span className="font-bold text-primary">Active</span>.</p>
          </div>
          <div className="flex gap-2">
            <Button className="flex items-center gap-2" asChild>
              <Link href="/listing/create">
                <Plus className="h-4 w-4" />
                New Listing
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦0</div>
              <p className="text-xs text-muted-foreground">Start selling to see revenue</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Package className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{listings?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Live on marketplace</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Recent transactions</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Verification</CardTitle>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.verificationStatus === 'verified' ? 'Verified' : 'Pending'}</div>
              <p className="text-xs text-muted-foreground">Complete your profile</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="mb-8 bg-muted/50">
            <TabsTrigger value="listings" className="px-8">My Listings</TabsTrigger>
            <TabsTrigger value="orders" className="px-8">Recent Orders</TabsTrigger>
            <TabsTrigger value="verification" className="px-8">Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings">
             <div className="grid gap-6">
                {listingsLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
                ) : listings && listings.length > 0 ? (
                  listings.map((item) => (
                    <Card key={item.id} className="flex flex-col overflow-hidden border-none shadow-sm md:flex-row">
                      <div className="relative h-48 w-full md:w-64">
                         <Image 
                          src={item.images?.[0] || `https://picsum.photos/seed/${item.id}/300/200`} 
                          alt="Listing" 
                          fill 
                          className="object-cover"
                          data-ai-hint="waste"
                         />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                         <div className="mb-4 flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-bold">{item.wasteTypeLabel} ({item.condition})</h3>
                              <p className="text-sm text-muted-foreground">ID: {item.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-black text-primary">₦{item.pricePerKg}/kg</p>
                              <p className="text-xs text-muted-foreground">{item.quantityKg}kg available</p>
                            </div>
                         </div>
                         <div className="mt-auto flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/marketplace/${item.id}`}>View</Link>
                            </Button>
                            <Button size="sm" variant="outline">Edit</Button>
                         </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="rounded-3xl bg-muted/30 py-16 text-center">
                    <p className="text-lg font-bold">You haven't posted any listings yet.</p>
                    <Button className="mt-4" asChild><Link href="/listing/create">Create Your First Listing</Link></Button>
                  </div>
                )}
             </div>
          </TabsContent>

          <TabsContent value="orders">
             <div className="rounded-xl bg-white p-4 shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left text-sm font-bold text-muted-foreground">
                      <th className="pb-4 pl-4">Order ID</th>
                      <th className="pb-4">Buyer</th>
                      <th className="pb-4">Quantity</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 pr-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersLoading ? (
                      <tr><td colSpan={5} className="py-8 text-center"><Loader2 className="mx-auto animate-spin" /></td></tr>
                    ) : orders && orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                          <td className="py-6 pl-4 font-medium">{order.id}</td>
                          <td className="py-6">{order.buyerName}</td>
                          <td className="py-6">{order.quantityKg} kg</td>
                          <td className="py-6">
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-6 pr-4 text-right">
                            <Button size="sm" variant="ghost" className="text-primary font-bold">
                              View <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-muted-foreground">
                          No recent orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </TabsContent>
          
          <TabsContent value="verification">
            <Card className="border-none shadow-sm">
              <CardContent className="p-8">
                 <div className="flex flex-col items-center text-center space-y-6">
                    <div className="rounded-full bg-muted p-6">
                      <ShieldCheck className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black">{profile?.verificationStatus === 'verified' ? 'Verification Complete' : 'Verification Pending'}</h2>
                      <p className="max-w-md text-muted-foreground">To trade at higher volumes and earn trust badges, please complete your BVN and CAC verification.</p>
                    </div>
                    {profile?.verificationStatus !== 'verified' && (
                      <Button className="font-bold px-10">Start Verification</Button>
                    )}
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

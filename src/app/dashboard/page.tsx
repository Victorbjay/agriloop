
"use client";

import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ShieldCheck,
  Package,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShoppingCart,
  DollarSign,
  Trash2,
  ShieldAlert,
  BarChart3,
  Search,
  RefreshCw,
  Edit2
} from 'lucide-react';
import Link from 'next/link';
import { useUser, useCollection, useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, doc } from 'firebase/firestore';
import { Listing, Order, UserProfile } from '@/types';
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { deleteUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const { firestore, auth } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [switchingRole, setSwitchingRole] = useState(false);

  // Fetch user profile
  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading: profileLoading } = useDoc<UserProfile>(profileRef);

  // Fetch user's listings (Relevant for Sellers)
  const userListingsQuery = useMemoFirebase(() => {
    if (!firestore || !user || profile?.role !== 'seller') return null;
    return query(
      collection(firestore, 'listings'),
      where('sellerId', '==', user.uid),
      limit(20)
    );
  }, [firestore, user, profile?.role]);

  const { data: listings, isLoading: listingsLoading } = useCollection<Listing>(userListingsQuery);

  // Fetch user's sales (Relevant for Sellers)
  const salesQuery = useMemoFirebase(() => {
    if (!firestore || !user || profile?.role !== 'seller') return null;
    return query(
      collection(firestore, 'orders'),
      where('sellerId', '==', user.uid),
      limit(20)
    );
  }, [firestore, user, profile?.role]);

  const { data: sales, isLoading: salesLoading } = useCollection<Order>(salesQuery);

  // Fetch user's purchases (Relevant for Buyers)
  const purchasesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'orders'),
      where('buyerId', '==', user.uid),
      limit(20)
    );
  }, [firestore, user]);

  const { data: purchases, isLoading: purchasesLoading } = useCollection<Order>(purchasesQuery);

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;
    try {
      await deleteUser(auth.currentUser);
      toast({ title: "Account Deleted", description: "Your account and data have been removed." });
      router.push('/');
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Deletion Failed", 
        description: error.code === 'auth/requires-recent-login' 
          ? "Please log out and log back in to perform this sensitive action."
          : error.message 
      });
    }
  };

  const handleSwitchRole = async (targetRole: 'seller' | 'buyer') => {
    if (!profileRef || !profile) return;
    setSwitchingRole(true);
    try {
      updateDocumentNonBlocking(profileRef, {
        role: targetRole,
        updatedAt: new Date().toISOString()
      });
      
      toast({ 
        title: "Role Updated", 
        description: `You are now a ${targetRole === 'seller' ? 'Seller' : 'Buyer'}.` 
      });

      // If switching to seller and not verified, nudge to verify
      if (targetRole === 'seller' && profile.verificationStatus !== 'verified') {
        router.push('/verify');
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    } finally {
      setSwitchingRole(false);
    }
  };

  const handleDeleteListing = (listingId: string) => {
    const listingDocRef = doc(firestore, 'listings', listingId);
    deleteDocumentNonBlocking(listingDocRef);
    toast({ title: "Listing Deleted", description: "The item has been removed from the marketplace." });
  };

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

  const isSeller = profile?.role === 'seller';
  const welcomeName = profile ? `${profile.firstName} ${profile.lastName}` : (user.displayName || 'Agro-Partner');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {!profile && !profileLoading && (
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-center gap-4 text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div className="text-sm">
              <p className="font-bold">Profile Setup Incomplete</p>
              <p>We couldn't find your profile data. Please <Link href="/signup" className="underline font-bold">re-register</Link> or contact support.</p>
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground sm:text-3xl">
              {isSeller ? 'Vendor Dashboard' : 'Procurement Dashboard'}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Welcome back, <span className="font-bold text-foreground">{welcomeName}</span>. 
              Role: <span className="font-bold text-primary capitalize">{profile?.role}</span>.
            </p>
          </div>
          <div className="flex gap-2">
            {isSeller ? (
              <Button className="flex items-center gap-2 w-full sm:w-auto" asChild>
                <Link href="/listing/create">
                  <Plus className="h-4 w-4" />
                  New Listing
                </Link>
              </Button>
            ) : (
              <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto" asChild>
                <Link href="/marketplace">
                  <Search className="h-4 w-4" />
                  Find Waste
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">{isSeller ? 'Revenue' : 'Spending'}</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold">
                ₦{isSeller 
                  ? sales?.reduce((acc, o) => acc + (o.status === 'completed' ? o.totalAmount : 0), 0).toLocaleString() 
                  : purchases?.reduce((acc, o) => acc + (o.status === 'completed' ? o.totalAmount : 0), 0).toLocaleString() || 0}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Total {isSeller ? 'earned' : 'invested'}</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">{isSeller ? 'Active Listings' : 'Orders'}</CardTitle>
              <Package className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold">{isSeller ? listings?.length : purchases?.length || 0}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{isSeller ? 'Live on market' : 'Total transactions'}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Impact Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold">
                {((isSeller ? (listings?.length || 0) : (purchases?.length || 0)) * 1.5).toFixed(1)} <span className="text-xs font-normal">Tons</span>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">CO2 Diverted Est.</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Trust Rank</CardTitle>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold capitalize">{profile?.badge || 'None'}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Verification status</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={isSeller ? "listings" : "purchases"} className="w-full">
          <div className="overflow-x-auto pb-2 mb-8">
            <TabsList className="bg-muted/50 inline-flex w-auto min-w-full sm:min-w-0">
              {isSeller && <TabsTrigger value="listings" className="px-6 sm:px-8">My Listings</TabsTrigger>}
              {isSeller && <TabsTrigger value="sales" className="px-6 sm:px-8">Sales Activity</TabsTrigger>}
              <TabsTrigger value="purchases" className="px-6 sm:px-8">Purchases</TabsTrigger>
              <TabsTrigger value="verification" className="px-6 sm:px-8">Verification</TabsTrigger>
              <TabsTrigger value="settings" className="px-6 sm:px-8">Settings</TabsTrigger>
            </TabsList>
          </div>
          
          {isSeller && (
            <TabsContent value="listings">
               <div className="grid gap-6">
                  {listingsLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
                  ) : listings && listings.length > 0 ? (
                    listings.map((item) => (
                      <Card key={item.id} className="flex flex-col overflow-hidden border-none shadow-sm md:flex-row bg-white">
                        <div className="relative h-48 w-full md:w-64">
                           <Image 
                            src={item.images?.[0] || `https://picsum.photos/seed/${item.id}/300/200`} 
                            alt="Listing" 
                            fill 
                            className="object-cover"
                           />
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                           <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <h3 className="text-xl font-bold">{item.wasteTypeLabel} ({item.condition})</h3>
                                <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                              </div>
                              <div className="sm:text-right">
                                <p className="text-lg font-black text-primary">₦{item.pricePerKg}/kg</p>
                                <p className="text-xs text-muted-foreground">{item.quantityKg}kg available</p>
                              </div>
                           </div>
                           <div className="mt-auto flex flex-wrap gap-2 pt-4">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/marketplace/${item.id}`}>View</Link>
                              </Button>
                              <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5" asChild>
                                <Link href={`/listing/edit/${item.id}`}>
                                  <Edit2 className="h-3 w-3 mr-1" />
                                  Edit
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/5">
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently remove your listing from the marketplace. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteListing(item.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                           </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="rounded-3xl bg-muted/30 py-16 text-center px-4">
                      <p className="text-lg font-bold">You haven't posted any listings yet.</p>
                      <Button className="mt-4" asChild><Link href="/listing/create">Create Your First Listing</Link></Button>
                    </div>
                  )}
               </div>
            </TabsContent>
          )}

          {isSeller && (
            <TabsContent value="sales">
               <div className="rounded-xl bg-white shadow-sm overflow-x-auto">
                  <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b text-left text-xs sm:text-sm font-bold text-muted-foreground">
                        <th className="py-4 pl-4">Order ID</th>
                        <th className="py-4">Buyer</th>
                        <th className="py-4">Quantity</th>
                        <th className="py-4">Total</th>
                        <th className="py-4">Status</th>
                        <th className="py-4 pr-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesLoading ? (
                        <tr><td colSpan={6} className="py-8 text-center"><Loader2 className="mx-auto animate-spin" /></td></tr>
                      ) : sales && sales.length > 0 ? (
                        sales.map((order) => (
                          <tr key={order.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                            <td className="py-4 pl-4 font-medium text-xs sm:text-sm">{order.id}</td>
                            <td className="py-4 text-xs sm:text-sm">{order.buyerName}</td>
                            <td className="py-4 text-xs sm:text-sm">{order.quantityKg} kg</td>
                            <td className="py-4 text-xs sm:text-sm font-bold">₦{order.totalAmount.toLocaleString()}</td>
                            <td className="py-4">
                              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-orange-700 capitalize">
                                {order.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-4 pr-4 text-right">
                              <Button size="sm" variant="ghost" className="text-primary font-bold h-8 text-xs" asChild>
                                <Link href={`/orders/${order.id}`}>Manage <ArrowRight className="ml-1 h-3 w-3" /></Link>
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                            No sales activity yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </TabsContent>
          )}

          <TabsContent value="purchases">
             <div className="rounded-xl bg-white shadow-sm overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b text-left text-xs sm:text-sm font-bold text-muted-foreground">
                      <th className="py-4 pl-4">Order ID</th>
                      <th className="py-4">Seller</th>
                      <th className="py-4">Product</th>
                      <th className="py-4">Status</th>
                      <th className="py-4 pr-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchasesLoading ? (
                      <tr><td colSpan={5} className="py-8 text-center"><Loader2 className="mx-auto animate-spin" /></td></tr>
                    ) : purchases && purchases.length > 0 ? (
                      purchases.map((order) => (
                        <tr key={order.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                          <td className="py-4 pl-4 font-medium text-xs sm:text-sm">{order.id}</td>
                          <td className="py-4 text-xs sm:text-sm">{order.sellerName}</td>
                          <td className="py-4 text-xs sm:text-sm">{order.listingSnapshotWasteTypeLabel}</td>
                          <td className="py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-blue-700 capitalize">
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 pr-4 text-right">
                            <Button size="sm" variant="ghost" className="text-primary font-bold h-8 text-xs" asChild>
                              <Link href={`/orders/${order.id}`}>View <ArrowRight className="ml-1 h-3 w-3" /></Link>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">
                          No purchases found. <Link href="/marketplace" className="text-primary underline">Shop now</Link>
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
                      <ShieldCheck className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-black">{profile?.verificationStatus === 'verified' ? 'Verification Complete' : 'Verification Pending'}</h2>
                      <p className="max-w-md text-sm sm:text-base text-muted-foreground">
                        {isSeller 
                          ? 'Sellers must complete NIN and CAC verification to trade at high volumes.' 
                          : 'Complete your verification to build trust with high-quality sellers.'}
                      </p>
                    </div>
                    {profile?.verificationStatus !== 'verified' && (
                      <Button className="font-bold px-10 w-full sm:w-auto" asChild>
                        <Link href="/verify">Start Verification</Link>
                      </Button>
                    )}
                    {profile?.verificationStatus === 'verified' && (
                      <div className="rounded-xl bg-primary/10 p-4 border border-primary/20 text-primary font-bold">
                        Verified Partner Level: {profile.badge.toUpperCase()}
                      </div>
                    )}
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground">
                      {isSeller ? 'Switch to Buyer Account' : 'Become a Seller'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isSeller 
                        ? 'Switch to a procurement-focused dashboard to source agricultural waste.' 
                        : 'Unlock the ability to list agricultural waste and receive payments directly.'}
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleSwitchRole(isSeller ? 'buyer' : 'seller')} 
                    disabled={switchingRole}
                    className="font-bold h-12 px-8 shadow-md"
                  >
                    {switchingRole ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    {isSeller ? 'Switch to Buyer' : 'Switch to Seller'}
                  </Button>
                </div>

                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">Permanently remove your account and all associated trading data. This action is irreversible.</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="font-bold">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Continue Deletion
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

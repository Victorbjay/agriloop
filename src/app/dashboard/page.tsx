"use client";

import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  Package,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
  const [role] = useState<'seller' | 'buyer'>('seller'); // Simulate role

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-foreground">Welcome back, Agro-Partner</h1>
            <p className="text-muted-foreground">Your account is currently <span className="font-bold text-primary">Verified</span>.</p>
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
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦450,230</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">4 awaiting pickup</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Waste Diverted</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2 Tons</div>
              <p className="text-xs text-muted-foreground">Approx. 120kg CO2 saved</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98/100</div>
              <p className="text-xs text-muted-foreground">Top 5% of sellers</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="mb-8 bg-muted/50">
            <TabsTrigger value="listings" className="px-8">Active Listings</TabsTrigger>
            <TabsTrigger value="orders" className="px-8">Recent Orders</TabsTrigger>
            <TabsTrigger value="verification" className="px-8">Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings">
             <div className="grid gap-6">
                {[1, 2].map((i) => (
                  <Card key={i} className="flex flex-col overflow-hidden border-none shadow-sm md:flex-row">
                    <div className="relative h-48 w-full md:w-64">
                       <Image 
                        src={`https://picsum.photos/seed/list-${i}/300/200`} 
                        alt="Listing" 
                        fill 
                        className="object-cover"
                        data-ai-hint="waste"
                       />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                       <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold">Cassava Peels (Dried)</h3>
                            <p className="text-sm text-muted-foreground">ID: #LIST-2401-00{i}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-primary">₦45/kg</p>
                            <p className="text-xs text-muted-foreground">2,500kg available</p>
                          </div>
                       </div>
                       <div className="mt-auto flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Pause</Button>
                          <Button size="sm" className="bg-accent text-accent-foreground">View Insights</Button>
                       </div>
                    </div>
                  </Card>
                ))}
             </div>
          </TabsContent>

          <TabsContent value="orders">
             <div className="rounded-xl bg-white p-4 shadow-sm">
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
                    {[1, 2, 3].map((i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                        <td className="py-6 pl-4 font-medium">#ORD-00{i}A</td>
                        <td className="py-6">BioEnergy Ltd</td>
                        <td className="py-6">1,200 kg</td>
                        <td className="py-6">
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                            Awaiting Pickup
                          </span>
                        </td>
                        <td className="py-6 pr-4 text-right">
                          <Button size="sm" variant="ghost" className="text-primary font-bold">
                            View <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </TabsContent>
          
          <TabsContent value="verification">
            <Card className="border-none shadow-sm">
              <CardContent className="p-8">
                 <div className="flex flex-col items-center text-center space-y-6">
                    <div className="rounded-full bg-primary/10 p-6">
                      <ShieldCheck className="h-16 w-16 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black">Identity Verified</h2>
                      <p className="max-w-md text-muted-foreground">Your BVN and business details have been successfully verified via Interswitch identity services.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                      <div className="p-4 rounded-xl bg-muted/50 text-left">
                        <p className="text-xs font-bold text-muted-foreground uppercase">BVN Status</p>
                        <p className="font-bold flex items-center gap-1 text-primary">
                          <CheckCircle2 className="h-4 w-4" /> Verified
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50 text-left">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Role</p>
                        <p className="font-bold">Verified Seller</p>
                      </div>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Helper components missing imports
function Image({ src, alt, fill, className, dataAiHint }: any) {
  return (
    <div className={`relative h-full w-full ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="h-full w-full object-cover" 
        data-ai-hint={dataAiHint} 
      />
    </div>
  );
}
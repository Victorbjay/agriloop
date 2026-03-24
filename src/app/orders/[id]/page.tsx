
"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Order, OrderStatus } from '@/types';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { firestore } = useFirebase();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const orderRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'orders', id as string);
  }, [firestore, id]);

  const { data: order, isLoading } = useDoc<Order>(orderRef);

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!orderRef || !order) return;
    
    updateDocumentNonBlocking(orderRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
      [`timeline${newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace('_', '')}At`]: new Date().toISOString()
    });

    toast({
      title: "Status Updated",
      description: `Order status changed to ${newStatus.replace('_', ' ')}.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!order || !user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Order not found.</h1>
        <Button asChild><Link href="/dashboard">Return to Dashboard</Link></Button>
      </div>
    );
  }

  const isSeller = user.uid === order.sellerId;
  const isBuyer = user.uid === order.buyerId;

  const timelineSteps = [
    { status: 'pending_payment', label: 'Ordered', icon: Clock },
    { status: 'seller_confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { status: 'ready_for_pickup', label: 'Ready', icon: Package },
    { status: 'completed', label: 'Completed', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <Link 
          href="/dashboard" 
          className="mb-6 flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-black">Order {order.id}</h1>
                <p className="text-muted-foreground text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge className={cn(
                "w-fit px-4 py-1 text-sm font-bold capitalize",
                order.status === 'completed' ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
              )}>
                {order.status.replace('_', ' ')}
              </Badge>
            </div>

            {/* Timeline Simulation */}
            <Card className="border-none shadow-sm overflow-hidden">
               <CardContent className="p-6">
                 <div className="relative flex justify-between">
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
                    {timelineSteps.map((step, idx) => {
                      const isActive = order.status === step.status || idx < timelineSteps.findIndex(s => s.status === order.status);
                      const isCurrent = order.status === step.status;
                      
                      return (
                        <div key={step.status} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                           <div className={cn(
                             "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                             isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                             isCurrent && "ring-4 ring-primary/20"
                           )}>
                             <step.icon className="h-5 w-5" />
                           </div>
                           <span className={cn("text-xs font-bold", isActive ? "text-primary" : "text-muted-foreground")}>
                             {step.label}
                           </span>
                        </div>
                      );
                    })}
                 </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-muted/30">
                  <div className="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {order.listingSnapshotWasteTypeLabel[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{order.listingSnapshotWasteTypeLabel}</h3>
                    <p className="text-sm text-muted-foreground">{order.quantityKg} kg @ ₦{order.pricePerKg}/kg</p>
                    <p className="text-lg font-black mt-1">₦{order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pickup Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-sm">{order.pickupLocationAddress}</p>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-sm">{order.pickupLocationContactPhone}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Partner Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                      {isSeller ? order.buyerName[0] : order.sellerName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{isSeller ? 'Buyer' : 'Seller'}: {isSeller ? order.buyerName : order.sellerName}</p>
                      <p className="text-xs text-muted-foreground">Verified Member</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <aside className="space-y-6">
            <Card className="border-none shadow-lg bg-primary text-primary-foreground">
               <CardHeader>
                 <CardTitle className="text-lg">Order Actions</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                 {isSeller && order.status === 'pending_payment' && (
                   <Button 
                    className="w-full bg-white text-primary hover:bg-white/90 font-bold"
                    onClick={() => handleUpdateStatus('seller_confirmed')}
                   >
                     Confirm Order
                   </Button>
                 )}
                 {isSeller && order.status === 'seller_confirmed' && (
                   <Button 
                    className="w-full bg-white text-primary hover:bg-white/90 font-bold"
                    onClick={() => handleUpdateStatus('ready_for_pickup')}
                   >
                     Mark as Ready
                   </Button>
                 )}
                 {isBuyer && order.status === 'ready_for_pickup' && (
                   <Button 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                    onClick={() => handleUpdateStatus('completed')}
                   >
                     Confirm Receipt
                   </Button>
                 )}
                 
                 <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                   Contact Support
                 </Button>

                 {order.status !== 'completed' && order.status !== 'cancelled' && (
                   <Button variant="ghost" className="w-full text-white/70 hover:text-white" onClick={() => handleUpdateStatus('cancelled')}>
                     Cancel Order
                   </Button>
                 )}
               </CardContent>
            </Card>

            <div className="rounded-2xl border-2 border-dashed p-6 text-center space-y-3">
               <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
               <p className="text-xs text-muted-foreground italic">
                 Escrow protection is active. Funds will be released to the seller once the buyer confirms receipt.
               </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}


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
  ShieldCheck,
  Headphones
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
    { status: 'payment_held', label: 'Paid & Secured', icon: ShieldCheck },
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
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-black">Order {order.id}</h1>
                <p className="text-muted-foreground text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge className={cn(
                "w-fit px-4 py-1 text-sm font-bold capitalize",
                order.status === 'completed' ? "bg-green-100 text-green-700" : 
                order.status === 'payment_held' ? "bg-blue-100 text-blue-700" : "bg-primary/10 text-primary"
              )}>
                {order.status.replace('_', ' ')}
              </Badge>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
               <CardContent className="p-6">
                 <div className="relative flex justify-between">
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
                    {timelineSteps.map((step, idx) => {
                      const currentIdx = timelineSteps.findIndex(s => s.status === order.status);
                      const isActive = idx <= (currentIdx === -1 ? 0 : currentIdx);
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
                           <span className={cn("text-[10px] font-black uppercase tracking-tighter", isActive ? "text-primary" : "text-muted-foreground")}>
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
                  <div className="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-2xl">
                    {order.listingSnapshotWasteTypeLabel[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{order.listingSnapshotWasteTypeLabel}</h3>
                    <p className="text-sm text-muted-foreground">{order.quantityKg} kg @ ₦{order.pricePerKg}/kg</p>
                    <p className="text-xl font-black mt-1 text-primary">₦{order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground">Pickup Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-sm font-medium">{order.pickupLocationAddress}</p>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-sm font-medium">{order.pickupLocationContactPhone}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground">Partner Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                      {isSeller ? order.buyerName[0] : order.sellerName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{isSeller ? 'Buyer' : 'Seller'}: {isSeller ? order.buyerName : order.sellerName}</p>
                      <Badge variant="outline" className="text-[10px] uppercase font-black px-2 py-0">Verified Member</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <aside className="space-y-6">
            <Card className="border-none shadow-xl bg-primary text-primary-foreground overflow-hidden">
               <div className="bg-primary-container/20 p-4 border-b border-white/10">
                 <CardTitle className="text-lg flex items-center gap-2">
                   <Clock className="h-5 w-5" />
                   Order Actions
                 </CardTitle>
               </div>
               <CardContent className="p-6 space-y-4">
                 {isSeller && order.status === 'payment_held' && (
                   <Button 
                    className="w-full bg-white text-primary hover:bg-white/90 font-black h-12 text-md"
                    onClick={() => handleUpdateStatus('seller_confirmed')}
                   >
                     Confirm Order
                   </Button>
                 )}
                 {isSeller && order.status === 'seller_confirmed' && (
                   <Button 
                    className="w-full bg-white text-primary hover:bg-white/90 font-black h-12 text-md"
                    onClick={() => handleUpdateStatus('ready_for_pickup')}
                   >
                     Mark as Ready
                   </Button>
                 )}
                 {isBuyer && order.status === 'ready_for_pickup' && (
                   <Button 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-black h-12 text-md shadow-lg"
                    onClick={() => handleUpdateStatus('completed')}
                   >
                     Confirm Receipt
                   </Button>
                 )}
                 
                 <Button 
                  variant="outline" 
                  className="w-full border-white/40 text-primary hover:bg-white/10 font-bold h-12 flex gap-2"
                 >
                   <Headphones className="h-4 w-4" />
                   Contact Support
                 </Button>

                 {order.status !== 'completed' && order.status !== 'cancelled' && (
                   <Button 
                    variant="ghost" 
                    className="w-full text-white/60 hover:text-white text-xs" 
                    onClick={() => handleUpdateStatus('cancelled')}
                   >
                     Cancel Order
                   </Button>
                 )}
               </CardContent>
            </Card>

            <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-6 text-center space-y-4">
               <ShieldCheck className="h-10 w-10 text-primary mx-auto" />
               <div className="space-y-1">
                 <p className="text-sm font-black text-primary uppercase tracking-wider">Safe Loop Escrow</p>
                 <p className="text-xs text-muted-foreground leading-relaxed italic">
                   Funds are currently secured by AgriLoop. The Seller will only be paid once the Buyer confirms pickup and quality.
                 </p>
               </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

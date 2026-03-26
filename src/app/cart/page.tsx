
"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { ShoppingCart, Trash2, ArrowRight, CreditCard, Loader2, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useUser, useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { getCheckoutConfig } from '@/lib/interswitch';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter } from 'next/navigation';
import { OrderStatus } from '@/types';

export default function CartPage() {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleBulkPayment = async (response: any) => {
    if (response && response.resp === "00") {
      toast({ title: "Payment Successful", description: "Creating your bulk orders..." });
      
      const ordersRef = collection(firestore, 'orders');

      // Create an order for each item in the cart
      items.forEach((item) => {
        const orderId = `ORD-${Date.now()}-${item.id.slice(-4)}`;
        const orderData = {
          id: orderId,
          listingId: item.id,
          listingSnapshotId: item.id,
          listingSnapshotWasteType: item.wasteType,
          listingSnapshotWasteTypeLabel: item.wasteTypeLabel,
          listingSnapshotCondition: item.condition,
          listingSnapshotPricePerKg: item.pricePerKg,
          listingSnapshotMoqKg: item.moqKg,
          listingSnapshotQualityGrade: item.qualityGrade,
          listingSnapshotAvailableFrom: item.availableFrom,
          buyerId: user?.uid,
          buyerName: user?.displayName || user?.email?.split('@')[0] || 'Anonymous Buyer',
          sellerId: item.sellerId,
          sellerName: item.sellerName,
          quantityKg: item.quantity,
          pricePerKg: item.pricePerKg,
          totalAmount: item.pricePerKg * item.quantity,
          deliveryMethod: 'self_pickup',
          status: 'payment_held' as OrderStatus,
          interswitchRef: response.payRef || 'TBD',
          transactionRef: response.txnRef || 'TBD',
          paymentPaidAt: new Date().toISOString(),
          paymentVerifiedAt: new Date().toISOString(),
          pickupLocationAddress: item.locationAddress,
          pickupLocationLatitude: item.locationLatitude,
          pickupLocationLongitude: item.locationLongitude,
          pickupLocationContactPhone: '08000000000', // Mocked verified phone
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        addDocumentNonBlocking(ordersRef, orderData);
      });

      clearCart();
      router.push('/payment/callback');
    } else {
      toast({ variant: "destructive", title: "Payment Failed", description: "Bulk transaction was not completed." });
      setCheckoutLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to purchase listings." });
      router.push('/login');
      return;
    }

    if (items.length === 0) return;

    setCheckoutLoading(true);
    
    try {
      const bulkOrderId = `BLK-${Date.now()}`;
      const config = await getCheckoutConfig(
        bulkOrderId, 
        totalPrice, 
        user.email || 'customer@example.com',
        user.displayName || 'AgriLoop Buyer'
      );

      if (window.webpayCheckout) {
        window.webpayCheckout({
          ...config,
          onComplete: handleBulkPayment
        });
      } else {
        throw new Error("Payment gateway is still loading. Please refresh.");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Checkout Error", description: error.message });
      setCheckoutLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-muted rounded-full p-8">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black">Your Procurement Cart is Empty</h1>
            <p className="text-muted-foreground max-w-sm">Source high-quality biomass from our verified marketplace to start your circular transaction.</p>
          </div>
          <Button asChild size="lg" className="px-10 font-bold">
            <Link href="/marketplace">Explore Marketplace</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-2">
          <Package className="h-8 w-8 text-primary" />
          Procurement Cart
        </h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  <div className="relative h-40 w-full sm:w-48 bg-muted">
                    <Image 
                      src={item.images?.[0] || `https://picsum.photos/seed/${item.id}/200/200`} 
                      alt={item.wasteTypeLabel} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold">{item.wasteTypeLabel}</h3>
                        <p className="text-sm text-muted-foreground">{item.condition} | {item.quantity}kg</p>
                        <p className="text-xs text-muted-foreground mt-1">Vendor: <b>{item.sellerName}</b></p>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <p className="text-primary font-black">₦{item.pricePerKg}/kg</p>
                      <p className="text-xl font-black">₦{(item.pricePerKg * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button variant="ghost" onClick={clearCart} className="text-muted-foreground text-xs uppercase font-bold tracking-widest">
              Clear All Items
            </Button>
          </div>

          <aside className="space-y-6">
            <Card className="border-none shadow-lg bg-white sticky top-24">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-black text-xl border-b pb-4">Procurement Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="font-bold">₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Escrow Service Fee</span>
                    <span className="font-bold text-primary">FREE</span>
                  </div>
                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-lg font-black">Total</span>
                    <span className="text-2xl font-black text-primary">₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  className="w-full h-14 text-lg font-black shadow-lg shadow-primary/20"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <><CreditCard className="mr-2 h-5 w-5" /> Pay Now</>}
                </Button>

                <div className="rounded-xl bg-primary/5 p-4 border border-primary/20 flex gap-3">
                  <Package className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    Bulk payments are held in our <b>Safe Loop Escrow</b>. Funds are distributed to individual sellers only after you verify each receipt.
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

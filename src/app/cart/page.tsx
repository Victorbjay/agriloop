"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { ShoppingCart, Trash2, CreditCard, Loader2, Package, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useUser, useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { getCheckoutConfig } from '@/lib/interswitch';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter } from 'next/navigation';
import { OrderStatus } from '@/types';
import Image from 'next/image';

export default function CartPage() {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleBulkPayment = async (response: any) => {
    // Interswitch success response codes
    const successCodes = ["00", "000", "0"];
    if (response && (successCodes.includes(response.resp) || response.status === "SUCCESSFUL")) {
      toast({ title: "Payment Successful", description: "Finalizing your bulk procurement..." });
      
      const ordersRef = collection(firestore, 'orders');

      // Loop through all items and create individual orders for each seller
      items.forEach((item) => {
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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
          listingSnapshotImages: item.images || [],
          buyerId: user?.uid,
          buyerName: user?.displayName || user?.email?.split('@')[0] || 'AgriLoop Partner',
          sellerId: item.sellerId,
          sellerName: item.sellerName,
          quantityKg: item.quantity,
          pricePerKg: item.pricePerKg,
          totalAmount: item.pricePerKg * item.quantity,
          deliveryMethod: 'self_pickup',
          status: 'payment_held' as OrderStatus,
          interswitchRef: response.payRef || response.paymentReference || 'DEMO-REF',
          transactionRef: response.txnRef || 'DEMO-TXN',
          paymentPaidAt: new Date().toISOString(),
          paymentVerifiedAt: new Date().toISOString(),
          timelineOrderedAt: new Date().toISOString(),
          pickupLocationAddress: item.locationAddress,
          pickupLocationLatitude: item.locationLatitude,
          pickupLocationLongitude: item.locationLongitude,
          pickupLocationContactPhone: '08000000000',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        addDocumentNonBlocking(ordersRef, orderData);
      });

      localStorage.setItem('last_bulk_total', totalPrice.toString());
      localStorage.setItem('last_bulk_count', items.length.toString());

      clearCart();
      router.push('/payment/callback');
    } else if (response && response.resp === "CANCELED") {
      toast({ title: "Payment Canceled", description: "You closed the payment gateway." });
      setCheckoutLoading(false);
    } else {
      toast({ 
        variant: "destructive", 
        title: "Transaction Incomplete", 
        description: response?.desc || "The payment was not processed. Please try again or use a different card." 
      });
      setCheckoutLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Identity Required", description: "Please log in to finalize your procurement." });
      router.push('/login');
      return;
    }

    if (items.length === 0) return;

    setCheckoutLoading(true);
    
    try {
      const bulkOrderId = `BLK-${Date.now()}`;
      
      // Call server action to get secure config and hash
      const config = await getCheckoutConfig(
        bulkOrderId, 
        totalPrice, 
        user.email || 'customer@example.com',
        user.displayName || 'AgriLoop Buyer'
      );

      if (window.webpayCheckout) {
        window.webpayCheckout({
          ...config,
          onComplete: handleBulkPayment,
          onClose: () => setCheckoutLoading(false)
        });
      } else {
        throw new Error("Payment gateway is initializing. Please wait a few seconds and try again.");
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
        <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-muted/50 rounded-full p-10">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/40" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black">Your Cart is Empty</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ready to close the loop? Browse our verified marketplace to source high-quality agricultural biomass.
            </p>
          </div>
          <Button asChild size="lg" className="px-12 h-14 font-bold rounded-2xl shadow-xl shadow-primary/10">
            <Link href="/marketplace">Explore Marketplace</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-10">
          <h1 className="text-4xl font-black flex items-center gap-3">
            <Package className="h-10 w-10 text-primary" />
            Procurement Cart
          </h1>
          <p className="text-muted-foreground mt-2">Manage your bulk biomass orders before secure checkout.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {items.map((item) => (
              <Card className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white rounded-2xl" key={item.id}>
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  <div className="relative h-44 w-full sm:w-52 bg-muted">
                    <Image 
                      src={item.images?.[0] || `https://picsum.photos/seed/${item.id}/300/300`} 
                      alt={item.wasteTypeLabel} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{item.wasteTypeLabel}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.condition}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{item.quantity}kg Selected</span>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground mt-3 flex items-center gap-1">
                          Seller: <span className="text-foreground font-bold">{item.sellerName}</span>
                        </p>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-end mt-6">
                      <p className="text-sm font-bold text-muted-foreground">₦{item.pricePerKg}/kg</p>
                      <p className="text-2xl font-black text-foreground">₦{(item.pricePerKg * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button variant="ghost" onClick={clearCart} className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest hover:text-destructive">
              Discard All Items
            </Button>
          </div>

          <aside>
            <Card className="border-none shadow-2xl bg-white rounded-[2rem] sticky top-28 overflow-hidden">
              <div className="bg-primary p-6 text-primary-foreground">
                <h3 className="font-black text-2xl">Order Summary</h3>
                <p className="text-sm opacity-80">{items.length} Multi-Seller Items</p>
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Processing</span>
                    <span className="text-primary">FREE</span>
                  </div>
                  <div className="pt-6 border-t flex justify-between items-center">
                    <span className="text-lg font-black">Total Amount</span>
                    <span className="text-3xl font-black text-primary">₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    className="w-full h-16 text-xl font-black rounded-2xl shadow-xl shadow-primary/20 transition-transform active:scale-95"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <><CreditCard className="mr-2 h-6 w-6" /> Pay with Interswitch</>}
                  </Button>
                  
                  <p className="text-[10px] text-center text-muted-foreground px-4">
                    Bulk payments are held in our secure <b>Safe Loop Escrow</b>. Sellers are only paid once you verify receipt for each individual item.
                  </p>
                </div>

                <div className="rounded-2xl bg-secondary/30 p-4 flex gap-3 border border-border/50">
                  <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-foreground uppercase tracking-wider">Buyer Protection</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Your funds are 100% protected. If a seller fails to provide the waste or it doesn't match the quality grade, you can trigger a dispute.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

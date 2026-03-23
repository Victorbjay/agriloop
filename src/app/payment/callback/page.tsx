"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCallbackPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-lg border-none shadow-2xl overflow-hidden">
          <div className="bg-primary p-12 flex flex-col items-center text-primary-foreground">
             <div className="bg-white/20 p-4 rounded-full mb-6">
                <CheckCircle2 className="h-16 w-16" />
             </div>
             <h1 className="text-3xl font-black">Payment Successful!</h1>
             <p className="opacity-90">Your transaction has been verified by Interswitch.</p>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-4">
                <span className="text-muted-foreground font-medium">Order ID</span>
                <span className="font-bold">#ORD-2401-992X</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="text-muted-foreground font-medium">Amount Paid</span>
                <span className="font-bold">₦112,500.00</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="text-muted-foreground font-medium">Seller</span>
                <span className="font-bold">GreenField Cassava</span>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-xl flex gap-3">
              <Package className="h-5 w-5 text-primary shrink-0" />
              <div className="text-sm">
                <p className="font-bold text-foreground">Next Step: Pickup Coordination</p>
                <p className="text-muted-foreground">The seller has been notified. You can now access their contact details in your dashboard to coordinate pickup.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
               <Button variant="outline" asChild>
                 <Link href="/marketplace">Shop More</Link>
               </Button>
               <Button className="font-bold" asChild>
                 <Link href="/dashboard">
                   Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
               </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

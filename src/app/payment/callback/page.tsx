"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PaymentCallbackPage() {
  const [total, setTotal] = useState<string | null>(null);
  const [count, setCount] = useState<string | null>(null);

  useEffect(() => {
    setTotal(localStorage.getItem('last_bulk_total'));
    setCount(localStorage.getItem('last_bulk_count'));
    // Clean up sensitive data after display
    return () => {
      localStorage.removeItem('last_bulk_total');
      localStorage.removeItem('last_bulk_count');
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-20 flex justify-center">
        <Card className="w-full max-w-xl border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white">
          <div className="bg-primary p-12 flex flex-col items-center text-primary-foreground text-center">
             <div className="bg-white/20 p-5 rounded-full mb-6">
                <CheckCircle2 className="h-20 w-20" />
             </div>
             <h1 className="text-4xl font-black mb-2">Payment Successful</h1>
             <p className="text-lg opacity-90 max-w-sm">Your bulk transaction has been verified and funds are secured in escrow.</p>
          </div>
          
          <CardContent className="p-10 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground font-bold">Total Items</span>
                </div>
                <span className="font-black text-xl">{count || '1'} Products</span>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground font-bold">Total Paid</span>
                </div>
                <span className="font-black text-2xl text-primary">₦{Number(total || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-secondary/20 p-6 rounded-[1.5rem] flex gap-4 border border-secondary">
              <Package className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div className="space-y-2">
                <p className="font-black text-foreground uppercase tracking-wider text-xs">Escrow Coordination</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We have split your payment into individual orders. Each seller has been notified to confirm their availability. You can manage these individually in your dashboard.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-4">
               <Button variant="outline" size="lg" className="h-14 font-bold rounded-2xl border-2" asChild>
                 <Link href="/marketplace">Source More</Link>
               </Button>
               <Button size="lg" className="h-14 font-black rounded-2xl shadow-lg shadow-primary/20" asChild>
                 <Link href="/dashboard">
                   Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                 </Link>
               </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

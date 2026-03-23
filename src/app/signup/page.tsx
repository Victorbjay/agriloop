"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShieldCheck, Leaf } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [role, setRole] = useState<'seller' | 'buyer'>('seller');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-xl border-none shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary w-12 h-12 rounded-xl flex items-center justify-center mb-2">
              <Leaf className="text-primary-foreground h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-black">Join AgriLoop</CardTitle>
            <CardDescription>Start turning agricultural waste into value today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-bold text-foreground">What is your primary goal?</Label>
              <RadioGroup defaultValue="seller" onValueChange={(v) => setRole(v as any)} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="seller" id="seller" className="peer sr-only" />
                  <Label
                    htmlFor="seller"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="text-sm font-bold">I am a Seller</span>
                    <span className="text-xs text-muted-foreground">Farmer / Processor</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="buyer" id="buyer" className="peer sr-only" />
                  <Label
                    htmlFor="buyer"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="text-sm font-bold">I am a Buyer</span>
                    <span className="text-xs text-muted-foreground">Offtaker / Factory</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input id="email" type="email" placeholder="john@farm.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input id="password" type="password" />
            </div>

            <div className="rounded-lg bg-muted/50 p-4 flex gap-3 items-start">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground italic">
                By joining, you agree to undergo BVN verification to ensure marketplace integrity. 
                Your data is secured with Interswitch encryption.
              </p>
            </div>

            <Button className="w-full font-bold h-11">Create Account</Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

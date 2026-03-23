"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-none shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary w-12 h-12 rounded-xl flex items-center justify-center mb-2">
              <Leaf className="text-primary-foreground h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-black">Welcome Back</CardTitle>
            <CardDescription>Login to manage your agricultural waste loop.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="name@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button className="w-full font-bold h-11">Sign In</Button>
            <div className="text-center text-sm text-muted-foreground pt-4">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Join AgriLoop
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

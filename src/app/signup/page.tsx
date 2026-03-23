
"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShieldCheck, Leaf, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function SignupPage() {
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'seller' | 'buyer'>('seller');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const createProfile = async (uid: string, email: string, firstName: string, lastName: string) => {
    const userRef = doc(firestore, 'users', uid);
    const profileData = {
      id: uid,
      email: email,
      role: role,
      firstName: firstName,
      lastName: lastName,
      phone: '', // To be filled in profile
      bvn: '',
      bvnVerified: false,
      cacVerified: false,
      verificationStatus: 'pending',
      address: '',
      latitude: 0,
      longitude: 0,
      badge: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(userRef, profileData);
    } catch (e: any) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: userRef.path,
        operation: 'create',
        requestResourceData: profileData,
      }));
      throw e;
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.firstName) {
      toast({ title: "Required fields", description: "Please fill in all basic info.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await createProfile(
        userCredential.user.uid,
        userCredential.user.email!,
        formData.firstName,
        formData.lastName
      );
      toast({ title: "Account created!", description: "Welcome to AgriLoop." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Signup Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const nameParts = result.user.displayName?.split(' ') || ['', ''];
      await createProfile(
        result.user.uid,
        result.user.email!,
        nameParts[0],
        nameParts.slice(1).join(' ')
      );
      toast({ title: "Signed up with Google", description: "Welcome to AgriLoop." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Google Signup Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

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

            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input 
                    id="first-name" 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input 
                    id="last-name" 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@farm.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full font-bold h-11" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" type="button" className="w-full h-11" onClick={handleGoogleSignup} disabled={loading}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>

            <div className="rounded-lg bg-muted/50 p-4 flex gap-3 items-start">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground italic">
                By joining, you agree to undergo BVN verification to ensure marketplace integrity. 
                Your data is secured with Interswitch encryption.
              </p>
            </div>

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

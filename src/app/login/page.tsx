"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { auth } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({ title: "Input Required", description: "Please enter your email and password.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast({ title: "Welcome back!", description: "Successfully logged in." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Signed in with Google", description: "Welcome back." });
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        toast({ 
          variant: "destructive", 
          title: "Google Login Disabled", 
          description: "Please enable Google Sign-In in your Firebase Console (Authentication > Sign-in method)." 
        });
      } else {
        toast({ variant: "destructive", title: "Google Login Failed", description: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-muted">
          <Image 
            src="https://picsum.photos/seed/agri-login/1200/1000" 
            alt="Sustainable Agriculture" 
            fill 
            className="object-cover grayscale-[20%] sepia-[10%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
          
          <div className="relative z-10 mt-auto p-16 w-full text-white">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="h-10 w-10 text-white" />
              <h1 className="text-3xl font-black tracking-tight">AgriLoop</h1>
            </div>
            <h2 className="text-5xl font-extrabold leading-tight tracking-tight mb-4">
              Closing the loop on <br/><span className="text-accent">Agricultural Waste.</span>
            </h2>
            <p className="text-lg text-white/90 max-w-lg font-medium mb-12">
              The precision marketplace transforming biomass into high-value resources for the global bio-economy.
            </p>
            <div className="flex gap-12">
              <div className="flex flex-col">
                <span className="text-accent font-black text-3xl">4.2M</span>
                <span className="text-white/70 text-[10px] tracking-widest uppercase font-bold">Tons Repurposed</span>
              </div>
              <div className="flex flex-col">
                <span className="text-accent font-black text-3xl">850+</span>
                <span className="text-white/70 text-[10px] tracking-widest uppercase font-bold">Verified Partners</span>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-white">
          <div className="w-full max-w-md space-y-10">
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-foreground tracking-tighter">Welcome Back</h3>
              <p className="text-muted-foreground font-medium">Enter your credentials to access the exchange.</p>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase" htmlFor="email">
                    Email Address
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@enterprise.com" 
                    className="h-12 bg-muted/30 border-none rounded-xl focus-visible:ring-primary"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase" htmlFor="password">
                    Password
                  </Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-12 bg-muted/30 border-none rounded-xl focus-visible:ring-primary"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Button type="submit" className="w-full h-14 font-black rounded-xl text-lg shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px]" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In'}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                  By signing in, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                </p>
              </div>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow h-px bg-muted"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">or continue with</span>
              <div className="flex-grow h-px bg-muted"></div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                type="button" 
                className="h-12 rounded-xl border-muted transition-colors font-bold text-sm flex gap-2"
                onClick={handleGoogleLogin} 
                disabled={loading}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>
            </div>

            <p className="text-center text-sm font-medium text-muted-foreground pb-8">
              New to the circular economy? 
              <Link href="/signup" className="text-primary font-bold hover:underline ml-1">
                Create an Account
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

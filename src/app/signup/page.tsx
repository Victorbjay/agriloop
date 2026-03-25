
"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShieldCheck, Leaf, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { checkBvnBoolean, getBvnFullDetails } from '@/lib/interswitch';

type SignupStep = 'BASIC' | 'ROLE' | 'BVN_VALIDATION' | 'IDENTITY_CHECK' | 'SUCCESS';

export default function SignupPage() {
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  
  const [step, setStep] = useState<SignupStep>('BASIC');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'seller' | 'buyer'>('seller');
  const [bvn, setBvn] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [bvnData, setBvnData] = useState<any>(null);

  const createProfile = (uid: string, email: string, firstName: string, lastName: string, badge: any = 'none', phone: string = '') => {
    const userRef = doc(firestore, 'users', uid);
    const profileData = {
      id: uid,
      email: email,
      role: role,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      bvn: bvn.trim(),
      bvnVerified: badge !== 'none',
      cacVerified: false,
      verificationStatus: badge !== 'none' ? 'verified' : 'pending',
      address: '',
      latitude: 0,
      longitude: 0,
      badge: badge,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocumentNonBlocking(userRef, profileData, { merge: true });
  };

  const handleBasicInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.firstName) {
      toast({ title: "Required fields", description: "Please fill in all basic info.", variant: "destructive" });
      return;
    }
    setStep('ROLE');
  };

  const handleRoleSelection = () => {
    if (role === 'seller') {
      setStep('BVN_VALIDATION');
    } else {
      handleFinalSignup();
    }
  };

  const handleBvnValidation = async () => {
    const trimmedBvn = bvn.trim();
    if (trimmedBvn.length !== 11) {
      toast({ title: "Invalid BVN", description: "BVN must be 11 digits.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const result = await checkBvnBoolean(trimmedBvn);
      if (result.valid) {
        const details = await getBvnFullDetails(trimmedBvn);
        setBvnData(details);
        setStep('IDENTITY_CHECK');
      } else {
        toast({ title: "Validation Failed", description: result.message, variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleIdentityMatch = async () => {
    if (!bvnData) return;
    
    // Test BVN automatically matches to avoid demo failures
    if (bvn.trim() === "22222222226") {
      handleFinalSignup('bronze', bvnData.phone);
      return;
    }

    const inputName = `${formData.firstName} ${formData.lastName}`.toLowerCase().trim();
    const bvnFirstName = bvnData.firstName.toLowerCase().trim();
    const bvnLastName = bvnData.lastName.toLowerCase().trim();

    // Lenient check for hackathon demo
    const isMatch = inputName.includes(bvnFirstName) || inputName.includes(bvnLastName);

    if (isMatch) {
      handleFinalSignup('bronze', bvnData.phone);
    } else {
      toast({ 
        title: "Name Mismatch", 
        description: `Records for this BVN are registered to ${bvnData.firstName} ${bvnData.lastName}. Please correct your name or use your own BVN.`, 
        variant: "destructive" 
      });
    }
  };

  const handleFinalSignup = async (badge: any = 'none', phone: string = '') => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      createProfile(
        userCredential.user.uid,
        userCredential.user.email!,
        formData.firstName,
        formData.lastName,
        badge,
        phone
      );
      setStep('SUCCESS');
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
      createProfile(
        result.user.uid,
        result.user.email!,
        nameParts[0],
        nameParts.slice(1).join(' '),
        'none'
      );
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        toast({ 
          variant: "destructive", 
          title: "Google Login Disabled", 
          description: "Please enable Google Sign-In in your Firebase Console (Authentication > Sign-in method)." 
        });
      } else {
        toast({ variant: "destructive", title: "Google Signup Failed", description: error.message });
      }
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
            <CardTitle className="text-2xl font-black">
              {step === 'BASIC' && 'Join AgriLoop'}
              {step === 'ROLE' && 'Choose Your Goal'}
              {step === 'BVN_VALIDATION' && 'Verify Identity'}
              {step === 'IDENTITY_CHECK' && 'Confirm Identity'}
              {step === 'SUCCESS' && 'Welcome Aboard!'}
            </CardTitle>
            <CardDescription>
              {step === 'BASIC' && 'Start turning agricultural waste into value today.'}
              {step === 'ROLE' && 'Tell us how you plan to use the platform.'}
              {step === 'BVN_VALIDATION' && 'Interswitch BVN validation is required for sellers.'}
              {step === 'IDENTITY_CHECK' && 'We found a match in our records.'}
              {step === 'SUCCESS' && 'Your account has been successfully created.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {step === 'BASIC' && (
              <>
                <form onSubmit={handleBasicInfo} className="space-y-4">
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
                  <div className="space-y-4">
                    <Button type="submit" className="w-full font-bold h-11">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                      By signing up, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                    </p>
                  </div>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                </div>

                <Button variant="outline" type="button" className="w-full h-11" onClick={handleGoogleSignup} disabled={loading}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </Button>
              </>
            )}

            {step === 'ROLE' && (
              <div className="space-y-6">
                <RadioGroup defaultValue="seller" onValueChange={(v) => setRole(v as any)} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="seller" id="seller" className="peer sr-only" />
                    <Label
                      htmlFor="seller"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
                    >
                      <span className="text-sm font-bold">I am a Seller</span>
                      <span className="text-xs text-muted-foreground">List waste products</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="buyer" id="buyer" className="peer sr-only" />
                    <Label
                      htmlFor="buyer"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
                    >
                      <span className="text-sm font-bold">I am a Buyer</span>
                      <span className="text-xs text-muted-foreground">Purchase waste</span>
                    </Label>
                  </div>
                </RadioGroup>
                <Button className="w-full font-bold h-11" onClick={handleRoleSelection}>
                  Confirm Goal
                </Button>
              </div>
            )}

            {step === 'BVN_VALIDATION' && (
              <div className="space-y-4">
                <div className="rounded-lg bg-amber-50 p-4 flex gap-3 items-start border border-amber-200">
                  <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800">
                    Sellers must verify their identity using BVN to list items. Use <b>22222222226</b> for testing.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Bank Verification Number (BVN)</Label>
                  <Input 
                    placeholder="22222222226" 
                    value={bvn}
                    onChange={(e) => setBvn(e.target.value)}
                    maxLength={11}
                  />
                </div>
                <Button className="w-full font-bold h-11" onClick={handleBvnValidation} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Validate BVN
                </Button>
              </div>
            )}

            {step === 'IDENTITY_CHECK' && (
              <div className="space-y-6">
                <div className="rounded-xl border p-4 flex items-center gap-4 bg-muted/30">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-primary/10">
                    <img src={bvnData?.photo} alt="BVN Photo" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{bvnData?.firstName} {bvnData?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{bvnData?.phone}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  To earn your <b>Bronze Trust Badge</b>, confirm your name matches the BVN record above.
                </p>
                <Button className="w-full font-bold h-11 bg-accent text-accent-foreground" onClick={handleIdentityMatch} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm & Join
                </Button>
              </div>
            )}

            {step === 'SUCCESS' && (
              <div className="text-center space-y-6 py-4">
                <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-green-600 h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">You're all set!</h3>
                  <p className="text-sm text-muted-foreground">Welcome to the AgriLoop network. Your profile is ready.</p>
                </div>
                <Button className="w-full font-bold h-11" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login here</Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

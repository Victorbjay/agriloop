
"use client";

import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useFirebase, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { checkNinBoolean, getNinFullDetails } from '@/lib/interswitch';
import { UserProfile } from '@/types';

type VerificationStep = 'START' | 'NIN_VALIDATION' | 'IDENTITY_CHECK' | 'SUCCESS';

export default function VerificationPage() {
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile } = useDoc<UserProfile>(profileRef);

  const [step, setStep] = useState<VerificationStep>('START');
  const [loading, setLoading] = useState(false);
  const [nin, setNin] = useState('');
  const [ninData, setNinData] = useState<any>(null);

  const handleNinValidation = async () => {
    const trimmedNin = nin.trim();
    if (trimmedNin.length !== 11) {
      toast({ title: "Invalid NIN", description: "NIN must be 11 digits.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const result = await checkNinBoolean(trimmedNin);
      if (result.valid) {
        const details = await getNinFullDetails(trimmedNin);
        setNinData(details);
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
    if (!ninData || !user || !profileRef) return;
    
    setLoading(true);
    try {
      updateDocumentNonBlocking(profileRef, {
        nin: nin.trim(),
        ninVerified: true,
        verificationStatus: 'verified',
        badge: 'bronze',
        updatedAt: new Date().toISOString(),
      });
      setStep('SUCCESS');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Verification Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-xl border-none shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary w-12 h-12 rounded-xl flex items-center justify-center mb-2">
              <ShieldCheck className="text-primary-foreground h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-black">
              {step === 'START' && 'Verify Your Identity'}
              {step === 'NIN_VALIDATION' && 'Enter NIN'}
              {step === 'IDENTITY_CHECK' && 'Confirm Details'}
              {step === 'SUCCESS' && 'Verified!'}
            </CardTitle>
            <CardDescription>
              {step === 'START' && 'Complete your verification to earn a trust badge and list items.'}
              {step === 'NIN_VALIDATION' && 'We use Interswitch to securely validate your identity.'}
              {step === 'IDENTITY_CHECK' && 'Confirm the details below match your identity.'}
              {step === 'SUCCESS' && 'Your profile has been upgraded with a Bronze Badge.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {step === 'START' && (
              <div className="space-y-4">
                <div className="rounded-xl bg-muted/30 p-6 text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Verified users can trade at unlimited volumes and appear higher in marketplace search results.</p>
                </div>
                <Button className="w-full font-bold h-11" onClick={() => setStep('NIN_VALIDATION')}>
                  Start NIN Check <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 'NIN_VALIDATION' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>National Identification Number (NIN)</Label>
                  <Input 
                    placeholder="Enter 11-digit NIN" 
                    value={nin}
                    onChange={(e) => setNin(e.target.value)}
                    maxLength={11}
                  />
                  <p className="text-[10px] text-muted-foreground italic">Use 12345678901 for demo testing.</p>
                </div>
                <Button className="w-full font-bold h-11" onClick={handleNinValidation} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify with Interswitch
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setStep('START')}>Back</Button>
              </div>
            )}

            {step === 'IDENTITY_CHECK' && (
              <div className="space-y-6">
                <div className="rounded-xl border p-6 space-y-4 bg-muted/10">
                   <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/20 overflow-hidden">
                        <img src={ninData?.photo} alt="Identity" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-lg font-black">{ninData?.firstName} {ninData?.lastName}</p>
                        <p className="text-sm text-muted-foreground">{ninData?.phone}</p>
                      </div>
                   </div>
                </div>
                <p className="text-sm text-center text-muted-foreground">By confirming, you agree that these details match your legal identity.</p>
                <Button className="w-full font-bold h-11 bg-accent text-accent-foreground" onClick={handleIdentityMatch} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm & Complete
                </Button>
              </div>
            )}

            {step === 'SUCCESS' && (
              <div className="text-center space-y-6 py-4">
                <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-green-600 h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">Success!</h3>
                  <p className="text-muted-foreground">You are now a verified AgriLoop partner.</p>
                </div>
                <Button className="w-full font-bold h-11" onClick={() => router.push('/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

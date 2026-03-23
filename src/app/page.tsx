import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import { 
  ArrowRight, 
  Recycle, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Globe, 
  Leaf, 
  ArrowUpRight 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 lg:pt-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                <Recycle className="h-4 w-4" />
                Empowering Nigeria's Circular Economy
              </div>
              <h1 className="text-5xl font-black tracking-tight text-foreground md:text-7xl">
                Turn Agricultural <span className="text-primary">Waste</span> into <span className="text-accent">Wealth</span>
              </h1>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground lg:mx-0">
                Connecting farmers and agro-processors with bio-energy and organic fertilizer companies. 
                Secure payments, verified sellers, and direct logistics.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button size="lg" className="h-14 px-8 text-lg font-bold" asChild>
                  <Link href="/marketplace">
                    Explore Marketplace <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold" asChild>
                  <Link href="/signup">Start Selling Waste</Link>
                </Button>
              </div>
              <div className="flex items-center justify-center gap-8 pt-8 lg:justify-start">
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-black text-foreground">50k+</p>
                  <p className="text-sm text-muted-foreground">Tons Recycled</p>
                </div>
                <div className="h-10 w-px bg-border"></div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-black text-foreground">2,500+</p>
                  <p className="text-sm text-muted-foreground">Verified Farmers</p>
                </div>
                <div className="h-10 w-px bg-border"></div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-black text-foreground">₦120M+</p>
                  <p className="text-sm text-muted-foreground">Paid to Sellers</p>
                </div>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
              <div className="relative aspect-[4/3] rounded-3xl bg-secondary p-4 shadow-2xl">
                 <Image
                  src="https://picsum.photos/seed/agri-hero/800/600"
                  alt="AgriLoop Ecosystem"
                  fill
                  className="rounded-2xl object-cover"
                  priority
                  data-ai-hint="farm waste"
                />
                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-6 shadow-xl md:p-8">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-100 p-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Profit Increase</p>
                      <p className="text-2xl font-black text-foreground">+24% avg.</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-6 -top-6 rounded-2xl bg-accent p-6 text-accent-foreground shadow-xl md:p-8">
                   <p className="text-center text-sm font-bold uppercase tracking-widest">New Listing</p>
                   <p className="text-center text-3xl font-black">2.5 Tons</p>
                   <p className="text-center text-xs opacity-80">Cassava Peels - Ogun</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features */}
      <section className="bg-secondary/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground md:text-4xl">Why AgriLoop?</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">The only platform in West Africa providing an end-to-end B2B solution for agricultural byproduct valorization.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "BVN Verified Sellers",
                desc: "Every seller is verified using Interswitch identity services to ensure trust and transparency in every transaction."
              },
              {
                icon: Globe,
                title: "Geo-Sourcing",
                desc: "Find waste closest to your factory. Reduce logistics costs by sourcing from farmers within a specific radius."
              },
              {
                icon: Recycle,
                title: "ESG Reporting",
                desc: "Get automated reports on your carbon footprint reduction and waste diverted from landfills for your ESG goals."
              }
            ].map((feature, i) => (
              <div key={i} className="rounded-3xl bg-white p-8 shadow-sm transition-transform hover:-translate-y-2">
                <div className="mb-6 inline-flex rounded-2xl bg-primary/10 p-4 text-primary">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-4 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-20 text-primary-foreground md:px-16">
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-4xl font-black md:text-6xl">Ready to loop your waste?</h2>
              <p className="mb-10 text-xl opacity-90">Join thousands of farmers and companies building a sustainable future.</p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Get Started Now</Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Talk to Sales</Button>
              </div>
            </div>
            {/* Abstract decorative circles */}
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl"></div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-muted/20 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
             <Leaf className="h-6 w-6 text-primary" />
             <span className="text-lg font-bold text-primary">AgriLoop</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 AgriLoop Marketplace. All rights reserved. Hackathon MVP v0.1.</p>
        </div>
      </footer>
    </div>
  );
}
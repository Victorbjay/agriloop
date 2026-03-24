"use client";

import Navbar from '@/components/layout/Navbar';
import { Card } from '@/components/ui/card';
import { 
  Gavel, 
  ShoppingCart, 
  ShieldCheck, 
  FileText
} from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <header className="mb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent mb-6">
              <Gavel className="h-4 w-4 mr-2" />
              <span className="text-xs font-bold tracking-widest uppercase">Legal Framework</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-3xl">
                <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tight leading-tight mb-6">
                  Terms of Service
                </h1>
                <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                  Effective as of June 14, 2024. These terms govern your access to and use of the AgriLoop Global Commodities Exchange and waste management ecosystem.
                </p>
              </div>
              <Card className="p-6 bg-muted/30 border-none shadow-none flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Version</p>
                  <p className="font-bold text-foreground">V2.4 Precision-Organic</p>
                </div>
              </Card>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Table of Contents Sidebar */}
            <aside className="lg:col-span-3">
              <div className="sticky top-32 space-y-8">
                <Card className="p-8 bg-muted/30 border-none shadow-none">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-6">Contents</h3>
                  <nav className="flex flex-col gap-4">
                    <a href="#acceptance" className="text-sm font-bold text-primary border-l-2 border-primary pl-4">01. Acceptance</a>
                    <a href="#obligations" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pl-4">02. Obligations</a>
                    <a href="#payment" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pl-4">03. Payments</a>
                    <a href="#dispute" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pl-4">04. Disputes</a>
                    <a href="#liability" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pl-4">05. Liability</a>
                  </nav>
                </Card>
                <div className="bg-accent/5 p-6 rounded-xl space-y-4">
                  <h4 className="text-sm font-bold text-foreground">Need legal clarification?</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Contact our compliance team for specific regulatory inquiries.</p>
                  <button className="text-xs font-bold text-primary uppercase tracking-wider hover:underline">Contact Compliance</button>
                </div>
              </div>
            </aside>

            {/* Legal Text Content */}
            <article className="lg:col-span-9 space-y-24">
              <section id="acceptance" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-black text-muted-foreground/20 italic">01</span>
                  <h2 className="text-3xl font-black text-foreground">Acceptance of Terms</h2>
                </div>
                <div className="space-y-6 text-lg text-muted-foreground leading-loose">
                  <p>
                    By accessing or using the AgriLoop platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not access or use the Service. AgriLoop reserves the right to update these terms at any time.
                  </p>
                  <Card className="p-8 bg-primary/5 border-l-4 border-primary shadow-none">
                    <p className="text-foreground italic font-medium">
                      "Our mission is to facilitate a transparent, sustainable resource cycle. These terms ensure the integrity of the AgriLoop ecosystem for all participants."
                    </p>
                  </Card>
                </div>
              </section>

              <section id="obligations" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-black text-muted-foreground/20 italic">02</span>
                  <h2 className="text-3xl font-black text-foreground">User Obligations</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-8 bg-muted/20 border-none shadow-none space-y-6">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-primary h-6 w-6" />
                      <h3 className="font-bold text-foreground uppercase tracking-wider text-sm">For Sellers</h3>
                    </div>
                    <ul className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                      <li className="flex gap-2"><span className="text-primary font-black">•</span> Accurate disclosure of waste origin and certification.</li>
                      <li className="flex gap-2"><span className="text-primary font-black">•</span> Compliance with regional environmental transport laws.</li>
                      <li className="flex gap-2"><span className="text-primary font-black">•</span> Maintenance of valid sanitation permits.</li>
                    </ul>
                  </Card>
                  <Card className="p-8 bg-muted/20 border-none shadow-none space-y-6">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="text-primary h-6 w-6" />
                      <h3 className="font-bold text-foreground uppercase tracking-wider text-sm">For Buyers</h3>
                    </div>
                    <ul className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                      <li className="flex gap-2"><span className="text-primary font-black">•</span> Timely acceptance of shipments and volume verification.</li>
                      <li className="flex gap-2"><span className="text-primary font-black">•</span> Proof of appropriate industrial processing capabilities.</li>
                      <li className="flex gap-2"><span className="text-primary font-black">•</span> Adherence to agreed payment schedules via escrow.</li>
                    </ul>
                  </Card>
                </div>
              </section>

              <section id="payment" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-black text-muted-foreground/20 italic">03</span>
                  <h2 className="text-3xl font-black text-foreground">Payment & Integrations</h2>
                </div>
                <Card className="p-10 bg-white border-none shadow-sm space-y-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2 space-y-4 text-muted-foreground">
                      <p>
                        All financial transactions are processed through our primary banking partner, <strong>Interswitch</strong>. This integration ensures bank-grade security and immediate settlement.
                      </p>
                      <p>
                        AgriLoop utilizes a proprietary Escrow system. Funds are captured at order confirmation and released only upon verification of receipt.
                      </p>
                    </div>
                    <Card className="md:w-1/2 bg-muted/30 p-6 border-none shadow-none space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Secure Processing Flow</h4>
                      <div className="space-y-3">
                        {['Order Placed & Interswitch Auth', 'Funds Held in Neutral Escrow', 'Delivery Proof & Verification', 'Automated Merchant Payout'].map((step, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs font-bold bg-white p-3 rounded-lg">
                            <span className="bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">{i+1}</span>
                            {step}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </Card>
              </section>

              <section id="dispute" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-black text-muted-foreground/20 italic">04</span>
                  <h2 className="text-3xl font-black text-foreground">Dispute Resolution</h2>
                </div>
                <div className="space-y-8 text-lg text-muted-foreground leading-loose">
                  <p>In the event of a quality mismatch, parties agree to first engage in a 48-hour "Good Faith Negotiation" mediated by the AgriLoop Resolution Center.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: 'Stage 1', desc: 'Direct mediation via dashboard tools.' },
                      { title: 'Stage 2', desc: 'Third-party physical verification.' },
                      { title: 'Stage 3', desc: 'Regional Commodity Exchange arbitration.' }
                    ].map((stage, i) => (
                      <Card key={i} className="p-6 bg-muted/20 border-none shadow-none">
                        <h4 className="font-bold text-foreground text-sm mb-2">{stage.title}</h4>
                        <p className="text-xs">{stage.desc}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>

              <section id="liability" className="scroll-mt-32 pb-12">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-black text-muted-foreground/20 italic">05</span>
                  <h2 className="text-3xl font-black text-foreground">Limitation of Liability</h2>
                </div>
                <Card className="bg-foreground p-10 text-background border-none space-y-6 shadow-xl">
                  <p className="font-black text-xl leading-tight">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, AGRILOOP SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR PUNITIVE DAMAGES ARISING FROM COMMODITY TRADING.
                  </p>
                  <p className="text-sm opacity-70 leading-relaxed">
                    AgriLoop acts as a marketplace facilitator and does not take ownership of physical commodities. All biological risks associated with waste materials remain with the transacting parties.
                  </p>
                </Card>
              </section>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}

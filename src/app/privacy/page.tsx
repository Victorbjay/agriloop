
"use client";

import Navbar from '@/components/layout/Navbar';
import { Card } from '@/components/ui/card';
import { 
  ShieldCheck, 
  Database, 
  BarChart3, 
  Network, 
  Download, 
  FileEdit, 
  Trash2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <header className="mb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
              <ShieldCheck className="h-4 w-4 mr-2" />
              <span className="text-xs font-bold tracking-widest uppercase">Legal Transparency</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tight leading-tight max-w-3xl mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
              Last updated: October 24, 2024. Our commitment to securing the precision data that fuels the global agricultural resource cycle.
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Table of Contents Sidebar */}
            <aside className="lg:w-1/4 lg:sticky lg:top-32 self-start space-y-8">
              <Card className="p-8 bg-muted/30 border-none shadow-none">
                <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-6">Navigation</h3>
                <nav className="flex flex-col gap-4">
                  <a href="#collection" className="text-sm font-bold text-primary border-l-2 border-primary pl-4 hover:translate-x-1 transition-all">Information Collection</a>
                  <a href="#usage" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pl-4">Data Usage</a>
                  <a href="#sharing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pl-4">Sharing Policies</a>
                  <a href="#rights" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pl-4">User Rights</a>
                  <a href="#security" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors pl-4">Security Protocols</a>
                </nav>
              </Card>
              <div className="p-6 rounded-xl bg-primary/5">
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                  Need a summary? <button className="text-primary underline font-bold">Download the PDF</button> version of our Data Ethics Handbook.
                </p>
              </div>
            </aside>

            {/* Policy Content */}
            <div className="lg:w-3/4 space-y-24">
              {/* Section 1 */}
              <section id="collection" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Database className="text-primary h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground">Information Collection</h2>
                </div>
                <div className="space-y-6 text-lg text-muted-foreground leading-loose">
                  <p>
                    At AgriLoop, we operate under the principle of <strong>Precision Organicism</strong>. This means we only collect the data necessary to facilitate the exchange of organic agricultural waste and high-value resource inputs.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-white border-none shadow-sm">
                      <span className="text-primary font-bold block mb-2 uppercase text-sm tracking-wider">Entity Data</span>
                      <p className="text-base">Corporate registration, tax identifiers, and operational licensing required for the AgriLoop Verification badge.</p>
                    </Card>
                    <Card className="p-6 bg-white border-none shadow-sm">
                      <span className="text-primary font-bold block mb-2 uppercase text-sm tracking-wider">Logistical Data</span>
                      <p className="text-base">Precise GPS coordinates for pick-up/drop-off points, tonnage measurements, and moisture content sensors.</p>
                    </Card>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="usage" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <BarChart3 className="text-accent h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground">Data Usage</h2>
                </div>
                <div className="space-y-8">
                  <Card className="p-8 bg-muted/20 border-none">
                    <h4 className="text-foreground font-bold text-xl mb-2">Cycle Optimization</h4>
                    <p className="text-muted-foreground">We use historical transaction data to predict market fluctuations and suggest optimal logistics routes, reducing carbon footprints by up to 14% across our network.</p>
                  </Card>
                  <Card className="p-8 bg-muted/20 border-none">
                    <h4 className="text-foreground font-bold text-xl mb-2">Compliance Reporting</h4>
                    <p className="text-muted-foreground">Data is used to generate Sustainability Reports for our members, providing verified carbon credits and waste diversion metrics required for global compliance standards.</p>
                  </Card>
                </div>
              </section>

              {/* Section 3 */}
              <section id="sharing" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Network className="text-primary h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground">Sharing Policies</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-4 text-xs font-bold tracking-widest uppercase">Recipient Group</th>
                        <th className="p-4 text-xs font-bold tracking-widest uppercase">Purpose</th>
                        <th className="p-4 text-xs font-bold tracking-widest uppercase">Retention</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-4 font-bold text-foreground">Verified Buyers</td>
                        <td className="p-4 text-muted-foreground">Logistics and quality assurance</td>
                        <td className="p-4 text-muted-foreground">Active Transaction</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold text-foreground">Third-party Logistics</td>
                        <td className="p-4 text-muted-foreground">Route fulfillment and billing</td>
                        <td className="p-4 text-muted-foreground">7 Years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 4 */}
              <section id="rights" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <FileEdit className="text-accent h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground">User Rights</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-white shadow-sm border-none">
                    <Download className="text-primary h-6 w-6 mb-4" />
                    <h5 className="font-bold text-foreground mb-2">Portability</h5>
                    <p className="text-sm text-muted-foreground">Request a full export of your resource data in JSON or CSV format.</p>
                  </Card>
                  <Card className="p-6 bg-white shadow-sm border-none">
                    <ShieldCheck className="text-primary h-6 w-6 mb-4" />
                    <h5 className="font-bold text-foreground mb-2">Correction</h5>
                    <p className="text-sm text-muted-foreground">Rectify any inaccuracies in your laboratory analysis reports.</p>
                  </Card>
                  <Card className="p-6 bg-white shadow-sm border-none">
                    <Trash2 className="text-primary h-6 w-6 mb-4" />
                    <h5 className="font-bold text-foreground mb-2">Erasure</h5>
                    <p className="text-sm text-muted-foreground">Request the permanent purging of personal identifier data.</p>
                  </Card>
                </div>
              </section>

              {/* Section 5 */}
              <section id="security" className="scroll-mt-32 pb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lock className="text-primary h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground">Security Protocols</h2>
                </div>
                <Card className="bg-foreground p-10 text-background border-none relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-4">Bank-Grade Encryption</h3>
                    <p className="text-background/80 leading-relaxed max-w-md mb-6">All data in transit and at rest is secured via AES-256-GCM. Our private key infrastructure is decentralized across multiple zones.</p>
                    <div className="flex gap-4">
                      <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest">ISO 27001</span>
                      <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest">SOC 2 Type II</span>
                    </div>
                  </div>
                  <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full" />
                </Card>
              </section>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-24 py-24 bg-muted/30 rounded-[3rem] text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-4xl font-black text-foreground mb-6">Still have questions?</h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Our legal and data protection team is available to discuss our privacy architecture in detail.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="px-10 h-14 font-black">Contact Privacy Team</Button>
              <Button size="lg" variant="outline" className="px-10 h-14 font-black">Data Ethics Board</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

"use client";

import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, Globe, Recycle, TrendingDown } from 'lucide-react';

export default function ImpactPage() {
  const stats = [
    { label: "CO2 Emissions Saved", value: "450 Tons", icon: TrendingDown, color: "text-green-600" },
    { label: "Waste Diverted", value: "1,200 Tons", icon: Recycle, color: "text-primary" },
    { label: "Community Income", value: "₦45M+", icon: Leaf, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl font-black text-foreground md:text-5xl">Our Collective Impact</h1>
          <p className="text-lg text-muted-foreground">
            AgriLoop isn't just a marketplace; it's a movement towards a zero-waste agricultural sector in West Africa.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm text-center">
              <CardHeader>
                <div className="mx-auto bg-muted rounded-full p-4 w-fit mb-2">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <CardTitle className="text-3xl font-black">{stat.value}</CardTitle>
                <p className="text-sm font-bold text-muted-foreground uppercase">{stat.label}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-none shadow-md overflow-hidden bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6" />
                Regional Contribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Ogun State Cluster</span>
                  <span>75% Efficiency</span>
                </div>
                <Progress value={75} className="bg-white/20" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Lagos Industrial Zone</span>
                  <span>40% Efficiency</span>
                </div>
                <Progress value={40} className="bg-white/20" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Oyo Farming Belt</span>
                  <span>62% Efficiency</span>
                </div>
                <Progress value={62} className="bg-white/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md flex items-center justify-center p-8 bg-accent/10">
            <div className="text-center space-y-4">
               <div className="bg-accent rounded-full p-4 w-fit mx-auto mb-4">
                 <Leaf className="h-10 w-10 text-white" />
               </div>
               <h3 className="text-2xl font-black">Regenerative Future</h3>
               <p className="text-muted-foreground">
                 By looping waste back into the production cycle, we've helped over 2,500 farmers transition to more sustainable practices while increasing their household income by an average of 18%.
               </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

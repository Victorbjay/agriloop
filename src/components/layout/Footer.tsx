
"use client";

import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-secondary/30 mt-auto">
      <div className="container mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center max-w-7xl">
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-primary mb-2">
            <Leaf className="h-6 w-6" />
            <span className="text-lg font-black uppercase tracking-tighter">AgriLoop</span>
          </div>
          <p className="text-sm tracking-wide text-muted-foreground font-medium">
            © 2024 AgriLoop. Precision Organicism in Waste Management.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="/privacy" className="text-sm tracking-wide uppercase font-bold text-primary hover:underline transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm tracking-wide uppercase font-medium text-muted-foreground hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/verify" className="text-sm tracking-wide uppercase font-medium text-muted-foreground hover:text-primary transition-colors">
            Compliance
          </Link>
          <Link href="/impact" className="text-sm tracking-wide uppercase font-medium text-muted-foreground hover:text-primary transition-colors">
            Impact Report
          </Link>
          <Link href="mailto:support@agriloop.com" className="text-sm tracking-wide uppercase font-medium text-muted-foreground hover:text-primary transition-colors">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}

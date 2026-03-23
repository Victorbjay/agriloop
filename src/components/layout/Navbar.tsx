
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Leaf, ShoppingCart, User, Menu, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useUser, useFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { auth } = useFirebase();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
    { name: 'Impact', href: '/impact', icon: Leaf },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-lg bg-primary p-1.5">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">AgriLoop</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {!isUserLoading && user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {user.email?.[0].toUpperCase()}
                </div>
              </>
            ) : !isUserLoading && (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Join AgriLoop</Link>
                </Button>
              </>
            )}
            {isUserLoading && (
              <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-b bg-background p-4 md:hidden">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-muted-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr />
            {user ? (
              <>
                <Button asChild className="w-full" variant="ghost">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                </Button>
                <Button onClick={handleLogout} className="w-full" variant="outline">Logout</Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full">
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Join AgriLoop</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}


import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/cart-context';

export const metadata: Metadata = {
  title: 'AgriLoop | Agricultural Waste Marketplace',
  description: 'Turn agricultural waste into wealth with AgriLoop.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <FirebaseClientProvider>
          <CartProvider>
            <div className="flex-grow flex flex-col">
              {children}
            </div>
            <Footer />
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
        {/* Interswitch Inline Checkout SDK */}
        <Script 
          src="https://newwebpay.qa.interswitchng.com/inline-checkout.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

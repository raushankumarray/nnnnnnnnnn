import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';
import { CookieConsent } from "@/components/ui/CookieConsent";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Chatbot } from "@/components/ui/Chatbot";
import { GlobalSystemListener } from "@/components/ui/GlobalSystemListener";

export const metadata: Metadata = {
  title: 'NPB Media | Modern Software Solutions',
  description: 'NPB Media provides high-end software development, UI/UX design, and AI-powered digital transformation right from Begusarai.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%23F28C30"/><text x="50%" y="52%" dominant-baseline="central" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="10"><tspan fill="%23FF0000">N</tspan><tspan fill="white">P</tspan><tspan fill="%23008000">B</tspan></text></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen">
        <FirebaseClientProvider>
          <GlobalSystemListener />
          {children}
          <CookieConsent />
          <WhatsAppButton />
          <Chatbot />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Wordmark from "@/components/brand/Wordmark";
import Link from "next/link";
import { ShoppingBag, PlusCircle } from "lucide-react";
import { AccessibilityProvider } from "@/components/ui/AccessibilityProvider";
import { AccessibilityToolbar } from "@/components/ui/AccessibilityToolbar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VISART — Your craft. Digitally understood.",
  description: "An artisan platform turning handmade craft into professional, market-ready digital stories, fair price guidance, multilingual reach, and shareable catalogue pages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-[#F5F0E8] text-[#1E211F] antialiased selection:bg-[#B85C43]/20 selection:text-[#1E211F]" suppressHydrationWarning>
        <AccessibilityProvider>
          {/* Navigation Header */}
          <header className="sticky top-0 z-40 bg-[#F5F0E8]/90 backdrop-blur-md border-b border-[#D8D0C4]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <Link href="/" className="group flex items-center gap-3">
                <Wordmark />
              </Link>

              <nav className="flex items-center gap-6 sm:gap-8">
                <Link 
                  href="/#how-it-works" 
                  className="text-sm font-medium text-[#68655F] hover:text-[#1E211F] transition-colors hidden md:inline-block"
                >
                  How it works
                </Link>
                <Link 
                  href="/workspace" 
                  className="text-sm font-medium text-[#68655F] hover:text-[#1E211F] transition-colors hidden sm:inline-flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4 text-[#A88752]" />
                  <span>Workspace</span>
                </Link>
                <Link 
                  href="/admin" 
                  className="text-sm font-medium text-[#68655F] hover:text-[#B85C43] transition-colors hidden sm:inline-flex items-center gap-1.5"
                >
                  <span>Admin</span>
                </Link>
                <Link
                  href="/create"
                  className="px-5 py-2.5 bg-[#1E211F] hover:bg-[#27344A] text-[#FBF8F2] text-sm font-medium rounded-full transition-all duration-200 shadow-sm flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-[#B85C43]" />
                  <span>Create my listing</span>
                </Link>
              </nav>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1">
            {children}
          </main>

          {/* Floating Inclusive Mode Toolbar */}
          <AccessibilityToolbar />

          {/* Editorial Footer */}
          <footer className="bg-[#1E211F] text-[#F5F0E8] border-t border-[#27344A] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="font-serif-editorial text-2xl tracking-widest text-[#FBF8F2]">VISART</span>
                <p className="text-xs text-[#68655F] mt-2 max-w-sm">
                  Empowering artisans to become digitally visible without having to become digitally fluent.
                </p>
              </div>
              <div className="flex flex-wrap gap-6 text-xs text-[#68655F]">
                <span>InHack Problem Statement 2</span>
                <span>•</span>
                <span>Editorial Craft Studio</span>
                <span>•</span>
                <span>Built for Artisans</span>
              </div>
            </div>
          </footer>
        </AccessibilityProvider>
      </body>
    </html>
  );
}

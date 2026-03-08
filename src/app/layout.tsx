import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { MainLayout } from "@/components/layout";


export const metadata: Metadata = {
  title: "FusionCell - Wholesale Cell Phone Repair Parts",
  description: "Your trusted wholesale partner for high-quality cell phone repair parts. Premium components for repair shops and technicians.",
  keywords: ["cell phone parts", "wholesale repair parts", "iPhone parts", "Samsung parts", "screen replacement", "repair shop supplies"],
  authors: [{ name: "FusionCell" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "FusionCell - Wholesale Cell Phone Repair Parts",
    description: "Your trusted wholesale partner for high-quality cell phone repair parts.",
    url: "https://fusioncell.com",
    siteName: "FusionCell",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FusionCell - Wholesale Cell Phone Repair Parts",
    description: "Your trusted wholesale partner for high-quality cell phone repair parts.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

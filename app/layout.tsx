import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Next-Events",
  description:
    "An event management booking platform built with Next.js and AI tools.",
};

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${cormorantGaramond.variable} ${dmSans.className} antialiased`}
      >
        {children}
        <Toaster
          toastOptions={{
            // sensible defaults so toasts always auto-dismiss
            success: { duration: 2500 },
            error: { duration: 4000 },
          }}
        />
      </body>
    </html>
  );
}

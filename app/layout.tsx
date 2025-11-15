import type { Metadata } from "next";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { UploadProvider } from "@/contexts/upload-context";
import { UploadNotification } from "@/components/upload-notification";
import ErrorBoundary from "@/components/error-boundary";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FileRBC",
  description: "FileRBC - Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navigation />
          <ErrorBoundary> 
            <UploadProvider>
              {children}
              <UploadNotification />
            </UploadProvider>
          </ErrorBoundary>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

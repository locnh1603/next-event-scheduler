import React from 'react';
import '../globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import NavBar from '@/components/navbar';
import { Toaster } from 'sonner';
export const metadata: Metadata = {
  title: 'Event Scheduler',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="main m-0">
        <NavBar />
        <div className="min-h-[95vh] p-4">{children}</div>
      </div>
      <Toaster />
      <SpeedInsights />
    </div>
  );
}

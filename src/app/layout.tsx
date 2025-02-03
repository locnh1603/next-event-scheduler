import React from "react";
import './globals.css';
import {SpeedInsights} from '@vercel/speed-insights/next';
import {Metadata} from 'next';
import NavBar from '@/components/navbar';
export const metadata: Metadata = {
  title: 'Event Scheduler',
}
export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        <div className="main m-0">
          <NavBar></NavBar>
          <div className="h-[95vh] p-4">
            {children}
          </div>
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}

import React from "react";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter";
import './globals.css';
import {Box} from "@mui/material";
import {SpeedInsights} from '@vercel/speed-insights/next';
import {Metadata} from 'next';
import NavBar from '@/app/components/navbar';
export const metadata: Metadata = {
  title: 'Event Scheduler',
}
export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Box sx={{ height: '100%', width: "100%" }}>
            <NavBar></NavBar>
            <Box component="main" sx={{ p: 3, height: "100%" }}>
              {children}
            </Box>
          </Box>
        </AppRouterCacheProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

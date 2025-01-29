import React from "react";
import Head from "next/head";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter";
import './globals.css';
import {Box} from "@mui/material";
import NavBar from '@/components/navbar';
import {SWRConfig} from 'swr';
import {getSession} from '@/app/utils/session';

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <AppRouterCacheProvider>
          <SWRConfig
            value={{
              shouldRetryOnError: false
            }}
          >
            <Box sx={{ height: '100%', width: "100%" }}>
              <NavBar session={session}></NavBar>
              <Box component="main" sx={{ p: 3, height: "100%" }}>
                {children}
              </Box>
            </Box>
          </SWRConfig>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

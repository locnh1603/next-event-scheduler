"use client"

import useSWR from 'swr';

import {Box, Typography} from '@mui/material';
import URLConstants from '@/app/utilities/constant';
import fetcher from '@/app/utilities/fetcher';
import Loading from '@/components/loading';

export default function Events() {
  const { data, error, isLoading } = useSWR(URLConstants.Events, fetcher);
  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <Box>
      <Typography variant="h5">Events</Typography>
      <Typography variant="h4">Hot Events</Typography>
      <Typography variant="h4">New Events</Typography>
    </Box>
  );
}

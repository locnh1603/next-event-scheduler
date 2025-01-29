import {Box, Typography} from '@mui/material';
import { cookies } from "next/headers";

export default async function Events() {
  const cookieStore = await cookies();
  const Cookie = cookieStore.toString();
  const data = await fetch(`${process.env.API_URL}/events`, {
    method: 'GET',
    credentials: 'include',
    headers: { Cookie },
  });
  const events = await data.json();
  console.log(events);
  return (
    <Box>
      <Typography variant="h5">Events</Typography>
      <Typography variant="h4">Hot Events</Typography>
      <Typography variant="h4">New Events</Typography>
    </Box>
  );
}

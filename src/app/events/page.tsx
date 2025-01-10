import {Box, Typography} from '@mui/material';

export default async function Events() {
  const data = await fetch(`${process.env.API_URL}/events`, {
    method: 'GET'
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

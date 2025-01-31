import {Box, Typography} from '@mui/material';
import fetchWithCookie from '@/app/utilities/fetch';
import {EventModel} from '@/app/models/event.model';
const Events = async () => {
  const data = await fetchWithCookie(`${process.env.API_URL}/events`, {
    method: 'GET'
  });
  const events: EventModel[] = await data.json();
  return (
    <Box>
      <Typography variant="h5">{events.length} Events</Typography>
      <Typography variant="h4">Hot Events</Typography>
      <Typography variant="h4">New Events</Typography>
    </Box>
  );
}
export default Events;

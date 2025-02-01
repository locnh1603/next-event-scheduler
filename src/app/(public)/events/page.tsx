import {Box, Typography} from '@mui/material';
import fetchWithCookie from '@/app/utilities/fetch';
import {IResponseBody} from '@/app/models/fetch.model';
import LinkButton from '@/app/components/button';
const Events = async () => {
  const body = JSON.stringify({
    payload: {
      ids: []
    },
    command: 'getEvents'
  });
  const data = await fetchWithCookie(`${process.env.API_URL}/events`, {
    method: 'POST',
    body,
  });
  const response: IResponseBody<Event[]> = await data.json();
  const payload: Event[] = response.payload;
  return (
    <Box>
      <Typography variant="h5">{payload.length} Events</Typography>
      <Typography variant="h4">Hot Events</Typography>
      <Typography variant="h4">New Events</Typography>
      <LinkButton href='/events/create'>Create Event</LinkButton>
    </Box>
  );
}
export default Events;

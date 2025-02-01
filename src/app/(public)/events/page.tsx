import {Box, Typography} from '@mui/material';
import fetchWithCookie from '@/app/utilities/fetch';
import {IResponseBody} from '@/app/models/fetch.model';
import LinkButton from '@/app/components/button';
import {EventModel} from '@/app/models/event.model';
import Carousel from '@/app/components/carousel';
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
  const { payload }: IResponseBody<EventModel[]> = await data.json();
  const carouselData = payload.map((item) => ({ image: item.image, name: item.name }));
  return (
    <Box>
      <Typography variant="h5">Events</Typography>
      <Typography variant="h4">Hot Events</Typography>
      <Box sx={{ height: 200 }}>
        <Carousel loop={true} data={carouselData}></Carousel>
      </Box>
      <Typography variant="h4">New Events</Typography>
      <Box sx={{ height: 200 }}>
        <Carousel loop={true} data={carouselData}></Carousel>
      </Box>
      <LinkButton href={`/events/${payload[0]?.id}`}>Create Event</LinkButton>
    </Box>
  );
}
export default Events;

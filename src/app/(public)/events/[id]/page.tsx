import {Box, Typography} from '@mui/material';
import fetchWithCookie from '@/app/utilities/fetch';
import {eventCommand} from '@/app/api/events/route';
import {IResponseBody} from '@/app/models/fetch.model';
import {EventModel} from '@/app/models/event.model';

const EventDetail = async({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = JSON.stringify({
    payload: {
      ids: [id]
    },
    command: eventCommand.getEvents
  });
  const data = await fetchWithCookie(`${process.env.API_URL}/events`, {
    method: 'POST',
    body,
  });
  const { payload }: IResponseBody<EventModel[]> = await data.json();
  return (
    <Box>
      <Typography variant="h5">Event Details</Typography>
      { payload[0]?.name }
    </Box>
  );
};

export default EventDetail;

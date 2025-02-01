import {Box, Typography} from '@mui/material';
import fetchWithCookie from '@/app/utilities/fetch';
import {IResponseBody} from '@/app/models/fetch.model';
import {EventModel} from '@/app/models/event.model';
import {EventCommands} from '@/app/enums/event.enum';

const EventDetail = async({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = JSON.stringify({
    payload: {
      ids: [id]
    },
    command: EventCommands.getEvents
  });
  const data = await fetchWithCookie(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
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

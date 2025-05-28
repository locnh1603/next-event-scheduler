import { EventContentArg } from '@fullcalendar/core/index.js';
import EventViewDialog from './event-dialog';

interface EventTileProps {
  eventInfo: EventContentArg;
}
const EventTile = ({ eventInfo }: EventTileProps) => {
  return (
    <EventViewDialog eventId={eventInfo.event.id}>
      <div>{eventInfo.event.title}</div>
    </EventViewDialog>
  );
};

export default EventTile;

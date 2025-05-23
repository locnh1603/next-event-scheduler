interface EventTileProps {
  eventInfo: any;
}
const EventTile = ({eventInfo}: EventTileProps) => {
  console.log(eventInfo);
  return (
    <>
      {eventInfo.event.title}
    </>
  )
}

export default EventTile;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { env } from '@env';
import { v1 } from 'uuid';

const generateInvitationLink = (eventId: string) => {
  const uuidString = v1();
  const expiredTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
  return `${env.APP_URL}/events/invitation/${eventId}-${uuidString}-${expiredTime}`;
};

interface EmailTemplateProps {
  senderName: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventId: string;
}
export const EmailTemplate = ({
  senderName,
  eventName,
  eventDate,
  eventLocation,
  eventId,
}: EmailTemplateProps) => (
  <Card>
    <CardHeader>
      <CardTitle>You are invited to an event</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-lg">Dear guest,</p>
      <p className="text-lg">{senderName} has invited you to an event.</p>
      <p className="text-lg">
        <strong>{eventName}</strong> on {eventDate} at {eventLocation}
      </p>
      <p>
        Click here to accept the invitation:
        <a href={generateInvitationLink(eventId)}>Accept</a>
      </p>
      <p className="text-sm text-muted-foreground">
        Please do not reply to this email. It is an automated invitation.
      </p>
    </CardContent>
  </Card>
);

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card';
import { env } from '@env';

const generateInvitationLink = (invitationToken: string) => {
  return `${env.APP_URL}/invitation/${invitationToken}`;
};

interface EmailTemplateProps {
  senderName: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  invitationToken: string;
}
export const EmailTemplate = ({
  senderName,
  eventName,
  eventDate,
  eventLocation,
  invitationToken,
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
        <a href={generateInvitationLink(invitationToken)}>Accept</a>
      </p>
      <p className="text-sm text-muted-foreground">
        Please do not reply to this email. It is an automated invitation.
      </p>
    </CardContent>
  </Card>
);

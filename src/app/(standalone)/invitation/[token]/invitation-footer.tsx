'use client';

import { Button } from '@/components/shadcn-ui/button';
import { EventCommands } from '@/enums/event.enum';
import { customFetch } from '@/services/app/client/client-fetch';
import { env } from '@env';
import { toast } from 'sonner';

interface InvitationFooterProps {
  token: string;
  status: 'accepted' | 'declined' | 'pending';
}

export const InvitationFooter = ({ token, status }: InvitationFooterProps) => {
  const handleResponse = async (status: 'accepted' | 'declined') => {
    try {
      const body = JSON.stringify({
        payload: {
          token,
          status,
        },
        command:
          status === 'accepted'
            ? EventCommands.acceptInvitation
            : EventCommands.declineInvitation,
      });
      const response = await customFetch(`${env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'POST',
        body,
      });
      if (response) {
        toast.success(`Invitation ${status}! You can close this page.`, {
          onDismiss: () => {
            window.close();
          },
          duration: 5000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${status} invitation.`);
    }
  };

  return (
    <div className="flex justify-center gap-4">
      {status !== 'accepted' && (
        <Button variant={'outline'} onClick={() => handleResponse('accepted')}>
          Accept
        </Button>
      )}
      {status !== 'declined' && (
        <Button variant={'outline'} onClick={() => handleResponse('declined')}>
          Decline
        </Button>
      )}
    </div>
  );
};

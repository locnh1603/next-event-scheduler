'use client';

import { Button } from '@/components/shadcn-ui/button';
import { customFetch } from '@/services/app/client/client-fetch';
import { env } from '@env';
import { toast } from 'sonner';

interface InvitationFooterProps {
  token: string;
}

export const InvitationFooter = ({ token }: InvitationFooterProps) => {
  const handleResponse = async (status: 'accepted' | 'declined') => {
    try {
      const body = JSON.stringify({
        payload: {
          token,
          status,
        },
        command:
          status === 'accepted' ? 'acceptInvitation' : 'declineInvitation',
      });
      const response = await customFetch(`${env.API_URL}/invitations`, {
        method: 'POST',
        body,
      });
      if (response) {
        toast.success(`Invitation ${status}!`);
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button variant={'outline'} onClick={() => handleResponse('accepted')}>
        Accept
      </Button>
      <Button
        className="ml-2"
        variant={'outline'}
        onClick={() => handleResponse('declined')}
      >
        Decline
      </Button>
    </div>
  );
};

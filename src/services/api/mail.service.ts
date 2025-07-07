import { EmailTemplate } from '@/components/email-template';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/utilities/date-util';
import { env } from '@env';
import { Resend } from 'resend';

class MailService {
  private resend = new Resend(env.RESEND_API_KEY);
  /**
   * Sends invitation emails to a list of recipients for a given event.
   * @param invitations - An array of objects, each containing the email and invitation ID.
   * @param eventId - The ID of the event for which the invitation is being sent.
   * @param subject - The subject of the email. Defaults to 'Event Invitation'.
   * @returns A promise that resolves with the data from the email sending service.
   */
  async inviteEmails(
    invitations: { id: string; email: string; token: string }[],
    eventId: string,
    subject: string = 'Event Invitation'
  ) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Unauthorized');
      }
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single();
      if (userError) {
        throw new Error(`Failed to fetch user profile: ${userError.message}`);
      }
      if (eventError || !event) {
        throw new Error(`Event with ID ${eventId} not found.`);
      }
      const senderName =
        `${userProfile?.firstname}${userProfile?.lastname}`.replaceAll(
          ' ',
          ''
        ) || 'EventOrganizer';
      const from = `${senderName} <events@mail.locnh.io.vn>`;
      const eventDate = formatDate(new Date(event.start_time));

      const emailPromises = invitations.map((invitation) => {
        return this.resend.emails.send({
          from,
          to: invitation.email,
          subject,
          react: EmailTemplate({
            senderName,
            eventName: event.name,
            eventDate,
            eventLocation: event.location,
            invitationToken: invitation.token,
          }),
        });
      });
      await Promise.all(emailPromises);
      return { success: true };
    } catch (error) {
      console.error('Error sending email', error);
      throw error;
    }
  }
}

export const mailService = new MailService();

import { Resend } from 'resend';
import { env } from '@env';
import { EmailTemplate } from '@/components/email-template';
import { formatDate } from '@/utilities/date-util';
import { createClient } from '@/lib/supabase/server';
const supabase = await createClient();
class MailService {
  private resend = new Resend(env.RESEND_API_KEY);

  async inviteEmails(
    to: string[],
    eventId: string,
    userId: string,
    subject: string = 'Event Invitation'
  ) {
    try {
      // Fetch event from Supabase
      const { data: event, error: eventError } = await supabase
        .from('public.events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError || !event) {
        throw new Error(`Event with ID ${eventId} not found.`);
      }

      const { data: userData, error: userError } =
        await supabase.auth.admin.getUserById(userId);

      if (userError || !userData?.user) {
        throw new Error(`User with ID ${userId} not found.`);
      }

      const user = userData.user;
      const senderName =
        user.user_metadata?.name || user.email || 'Unknown User';
      const from = `${senderName} <events@mail.locnh.io.vn>`;
      const eventDate = formatDate(new Date(event.start_date));

      const { data } = await this.resend.emails.send({
        from,
        to,
        subject,
        react: EmailTemplate({
          senderName: from,
          eventName: event.name,
          eventDate,
          eventLocation: event.location,
          eventId: event.id,
        }),
      });
      return data;
    } catch (error) {
      console.error('Error sending email', error);
      throw error;
    }
  }
}

export const mailService = new MailService();

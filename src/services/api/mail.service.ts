import { Resend } from 'resend';
import { env } from '@env';
import { EmailTemplate } from '@/components/email-template';
import { formatDate } from '@/utilities/date-util';
import { Types } from 'mongoose';
import Event from '@/models/event.model';
import { User } from '@/models/user.model';

class MailService {
  private resend = new Resend(env.RESEND_API_KEY);
  async inviteEmails(to: string[], eventId: string, userId: Types.ObjectId, subject: string = 'Event Invitation') {
    try {
      const event = await Event.findOne({ id: eventId });
      if (!event) {
        throw new Error(`Event with ID ${eventId} not found.`);
      }
      const user = await User.findOne({ _id: userId });
      if (!user) {
        throw new Error(`User with ID ${userId} not found.`);
      }
      console.log(event, user, to);
      const from = `${user.name} <events@mail.locnh.io.vn>`;
      const eventDate = formatDate(new Date(event.startDate));
      const { data } = await this.resend.emails.send({
        from,
        to,
        subject,
        react: EmailTemplate(
          { senderName: from, eventName: event.name, eventDate, eventLocation: event.location, eventId: event.id }
        ),
      });
      return data;
    } catch (error) {
      console.error('Error sending email', error);
      throw error;
    }
  }
}

export const mailService = new MailService();

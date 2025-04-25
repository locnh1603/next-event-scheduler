import mongoose, {Document, Types} from 'mongoose';

export interface EventInvite {
  id: string;
  recipientId: string;
  recipientEmail: string;
  eventId: string;
  status: 'Accepted' | 'Rejected' | 'Pending';
}

interface IInvite extends Document {
  _id: string;
  recipientId: string;
  recipientEmail: string;
  eventId: string;
  status: 'Accepted' | 'Rejected' | 'Pending';
}

const inviteSchema = new mongoose.Schema({
  _id: { type: Types.ObjectId, required: true },
  recipientId: { type: Types.ObjectId, ref: 'users' },
  recipientEmail: { type: String },
  eventId: { type: String, required: true, ref: 'events' },
  status: { type: String, required: true, default: 'Pending' }
})

const Invite = mongoose.models?.events || mongoose.model<IInvite>('invites', inviteSchema);
export default Invite;

export interface InviteDTO {
  receiver_email: string;
  event_id: string;
  user_id: string; // Assuming UUIDs are handled as strings in TypeScript
  id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface Invite {
  receiverEmail: string;
  eventId: string;
  userId: string;
  id: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

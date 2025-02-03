import mongoose, {Document, Schema} from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
}

const eventSchema: Schema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const User = mongoose.models?.users || mongoose.model<IUser>('events', eventSchema)

export default User;

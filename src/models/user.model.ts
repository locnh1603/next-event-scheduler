import mongoose, { Schema, Types } from 'mongoose';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: string;
  image: string;
}

interface IUser {
  _id: Types.ObjectId;
  __v: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
}

interface IAccount {
  _id: Types.ObjectId;
  __v: string;
  id: string;
  userId: Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string;
  id_token: string;
  oauth_token_secret: string;
  oauth_token: string;
  session_state: string;
}

interface ISession {
  _id: Types.ObjectId;
  __v: string;
  id: string;
  sessionToken: string;
  userId: Types.ObjectId;
  expires: Date;
}

interface IVerificationToken {
  _id: Types.ObjectId;
  __v: string;
  id: string;
  token: string;
  identifier: string;
  expires: Date;
}

export const userSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, unique: true },
  emailVerified: { type: Boolean },
  image: { type: String },
});

export const accountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  type: { type: String },
  provider: { type: String },
  providerAccountId: { type: String },
  refresh_token: { type: String },
  access_token: { type: String },
  expires_at: { type: Number },
  token_type: { type: String },
  scope: { type: String },
  id_token: { type: String },
  oauth_token_secret: { type: String },
  oauth_token: { type: String },
  session_state: { type: String },
});

export const sessionSchema = new Schema<ISession>({
  sessionToken: { type: String, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  expires: { type: Date },
});

export const verificationTokenSchema = new Schema<IVerificationToken>({
  token: { type: String },
  identifier: { type: String },
  expires: { type: Date },
});

export const User =
  mongoose.models?.users || mongoose.model('users', userSchema);
export const Account =
  mongoose.models?.accounts || mongoose.model('accounts', accountSchema);
export const Session =
  mongoose.models?.sessions || mongoose.model('sessions', sessionSchema);
export const VerificationToken =
  mongoose.models?.tokens || mongoose.model('tokens', verificationTokenSchema);

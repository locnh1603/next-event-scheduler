import mongoose from 'mongoose';
import { env } from '@env';

const connection: {isConnected?: number } = {}

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(env.MONGODB_URI!);

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;

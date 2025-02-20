import { auth } from '@/auth';
import { User } from '@/models/user.model';
import { Types } from 'mongoose';
import {ApiError} from '@/app/api/api-error-handler';

export async function getUserId() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new ApiError(401, 'User not authenticated');
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    throw new ApiError(401, 'User not authenticated');
  }

  return new Types.ObjectId(user._id);
}

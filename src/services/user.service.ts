import {User} from '@/models/user.model';
import {Types} from 'mongoose';

class UserService {
  async getUsers(ids?: string[]) {
    if (!ids?.length) {
      return User.find();
    }
    const query = {
      _id: {
        $in: ids.map(id => new Types.ObjectId(id))
      }
    };
    const result = await User.find(query).lean();
    return result.map(userValue => {
      return {
        ...userValue,
        id: userValue._id
      }
    });
  }

  async inviteUsers(ids?: string[]) {}

  async inviteEmails(emails?: string[]) {}
}

export const userService = new UserService()

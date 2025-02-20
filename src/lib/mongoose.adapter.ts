import type {Adapter} from "@auth/core/adapters";
import {Account, Session, User} from "@/models/user.model";

export function MongooseAdapter(): Adapter {
  return {
    createUser: async (data) => {
      return await User.create(data)
    },
    getUser: async (id) => {
      try {
        const user = await User.findById(id);
        if (!user) return null;
        return user
      } catch {
        return null;
      }
    },
    getUserByEmail: async (email) => {
      const user = await User.findOne({ email });
      if (!user) return null;
      return user
    },
    getUserByAccount: async (provider_providerAccountId) => {
      const account = await Account.findOne(
        provider_providerAccountId
      );
      if (!account) return null;
      const user = await User.findById(account.userId);
      if (!user) return null;
      return user
    },
    updateUser: async (data) => {
      const user = await User.findByIdAndUpdate(data.id, data, {
        new: true,
      });
      return user!;
    },
    deleteUser: async (id) => {
      await Promise.all([
        Account.deleteMany({ userId: id }),
        Session.deleteMany({ userId: id }),
        User.findByIdAndDelete(id),
      ]);
    },
    linkAccount: async (data) => {
      return await Account.create(data);
    },
    unlinkAccount: async (provider_providerAccountId) => {
      await Account.findOneAndDelete(provider_providerAccountId);
    }
  };
}

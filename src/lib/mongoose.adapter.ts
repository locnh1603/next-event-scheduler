import type {Adapter} from "@auth/core/adapters";
import {AccountModel, SessionModel, UserModel} from "@/models/user.model";

export function MongooseAdapter(): Adapter {
  return {
    createUser: async (data) => {
      return await UserModel.create(data)
    },
    getUser: async (id) => {
      try {
        const user = await UserModel.findById(id);
        if (!user) return null;
        return user
      } catch {
        return null;
      }
    },
    getUserByEmail: async (email) => {
      const user = await UserModel.findOne({ email });
      if (!user) return null;
      return user
    },
    getUserByAccount: async (provider_providerAccountId) => {
      const account = await AccountModel.findOne(
        provider_providerAccountId
      );
      if (!account) return null;
      const user = await UserModel.findById(account.userId);
      if (!user) return null;
      return user
    },
    updateUser: async (data) => {
      const user = await UserModel.findByIdAndUpdate(data.id, data, {
        new: true,
      });
      return user!;
    },
    deleteUser: async (id) => {
      await Promise.all([
        AccountModel.deleteMany({ userId: id }),
        SessionModel.deleteMany({ userId: id }),
        UserModel.findByIdAndDelete(id),
      ]);
    },
    linkAccount: async (data) => {
      return await AccountModel.create(data);
    },
    unlinkAccount: async (provider_providerAccountId) => {
      await AccountModel.findOneAndDelete(provider_providerAccountId);
    }
  };
}

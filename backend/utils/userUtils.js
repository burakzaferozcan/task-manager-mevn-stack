import User from "../models/user.js";

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const createUser = async (email, first_name, last_name, password) => {
  const user = new User({ email, first_name, last_name, password });
  return user.save();
};

export const deleteUserByEmail = async (email) => {
  return User.findOneAndDelete({ email });
};

export const updateUserByEmail = async (email, updates) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  Object.keys(updates).forEach((key) => {
    user[key] = updates[key];
  });

  return user.save();
};

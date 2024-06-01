import sendEmail from "../utils/sendEmail.js";
import generateToken from "../utils/generateToken.js";
import decodeToken from "../utils/decodeToken.js";
import sendAccountDeletionConfirmationEmail from "../utils/sendAccountDeletionConfirmationEmail.js";
import { hashPassword, comparePassword } from "../utils/bcryptUtils.js";
import {
  findUserByEmail,
  createUser,
  deleteUserByEmail,
  updateUserByEmail,
} from "../utils/userUtils.js";

const requestAccountDeletion = async (req, res) => {
  try {
    const { email } = req.body;
    await sendAccountDeletionConfirmationEmail(email);
    res.status(200).json({
      message: "Account deletion confirmation email sent successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmAccountDeletion = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = decodeToken(token);
    const { email } = decoded;

    await deleteUserByEmail(email);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUserController = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const confirmationToken = generateToken({
      email,
      first_name,
      last_name,
      password: hashedPassword,
    });

    const htmlContent = `<p>Hello ${first_name}, Please click the following link to confirm your email: <a href="${process.env.BASE_SERVER_URL}/api/auth/confirm/${confirmationToken}">Confirm Email</a></p>`;
    await sendEmail(email, "Confirm Your Email", htmlContent);

    res.status(201).json({ message: "Confirmation email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken({ id: user._id }, "14d");

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {
      first_name: first_name || user.first_name,
      last_name: last_name || user.last_name,
    };

    if (password) {
      updates.password = await hashPassword(password);
    }

    await updateUserByEmail(email, updates);

    const updateToken = generateToken({
      email,
      first_name: updates.first_name,
      last_name: updates.last_name,
      password: updates.password,
    });

    const htmlContent = `<p>Hello ${updates.first_name}, Please click the following link to confirm your profile update: <a href="${process.env.BASE_SERVER_URL}/api/auth/update/confirm/${updateToken}">Confirm Update</a></p>`;
    await sendEmail(email, "Confirm Your Profile Update", htmlContent);

    res
      .status(200)
      .json({ message: "Profile update confirmation email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = decodeToken(token);
    const { email, first_name, last_name, password } = decoded;

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await createUser(email, first_name, last_name, password);

    res
      .status(200)
      .json({ message: "Email confirmed and user created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const confirmUpdate = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = decodeToken(token);
    const { email, first_name, last_name, password } = decoded;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = { first_name, last_name };
    if (password) {
      updates.password = await hashPassword(password);
    }

    await updateUserByEmail(email, updates);

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    user.password = await hashPassword(newPassword);
    await user.save();

    const htmlContent = `<p>Hello ${user.first_name},</p><p>Your password has been reset. Here is your new password: <strong>${newPassword}</strong></p><p>Please log in using this password and change it immediately.</p>`;
    await sendEmail(email, "Password Reset", htmlContent);
    res
      .status(200)
      .json({ message: "New password has been sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createUserController as createUser,
  confirmEmail,
  login,
  updateUser,
  confirmUpdate,
  requestAccountDeletion,
  confirmAccountDeletion,
  resetPassword,
};

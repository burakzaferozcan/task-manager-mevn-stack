import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const sendEmail = async (email, subject, htmlContent) => {
  try {
    // createTransport e posta gönderme aracı
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    // mailOptions içerisinde göndereceğimiz mesajı tanımlıyoruz.
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: htmlContent,
    };
    // mailOptions içerisinde tanımladığımız mesajı gönderiyoruz.
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email: " + error.message);
  }
};

const generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
const sendAccountDeletionConfirmationEmail = async (email) => {
  try {
    const token = generateToken({ email }, "1d");
    const htmlContent = `<p>Account Deletion Confirmation: <a href="${process.env.BASE_SERVER_URL}/api/auth/delete-account/${token}">Confirm Deletion</a></p>`;
    await sendEmail(email, "Confirm Account Deletion", htmlContent);
  } catch (error) {
    throw new Error("Error sending confirmation email: " + error.message);
  }
};

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

    await User.findOneAndDelete({ email });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createUser = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const confirmationToken = generateToken({
      email,
      first_name,
      last_name,
      password,
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updateToken = generateToken({
      email,
      first_name: user.first_name,
      last_name: user.last_name,
      password: user.password,
    });

    const htmlContent = `<p>Hello ${user.first_name}, Please click the following link to confirm your profile update: <a href="${process.env.BASE_SERVER_URL}/api/auth/update/confirm/${updateToken}">Confirm Update</a></p>`;
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

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({ email, first_name, last_name, password });
    await newUser.save();

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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.first_name = first_name;
    user.last_name = last_name;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Yeni şifre oluşturma
    const newPassword = Math.random().toString(36).slice(-8); // Rastgele 8 karakterlik şifre oluştur
    // Kullanıcıya yeni şifreyi ata ve kaydet
    user.password = newPassword;
    await user.save();
    // Yeni şifreyi kullanıcıya e-posta olarak gönder
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
  createUser,
  confirmEmail,
  login,
  updateUser,
  confirmUpdate,
  requestAccountDeletion,
  confirmAccountDeletion,
  resetPassword,
  sendEmail,
  generateToken,
  decodeToken,
};

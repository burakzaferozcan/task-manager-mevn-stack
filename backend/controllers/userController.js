import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
const createUser = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const confirmationToken = jwt.sign(
      { email, first_name, last_name, password },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await sendConfirmationEmail(email, confirmationToken);
    res.status(201).json({ message: "Confirmation email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const sendConfirmationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Confirm Your Email",
      html: `<p>Please click the following link to confirm your email: <a href="${process.env.BASE_SERVER_URL}/auth/confirm/${token}">Confirm Email</a></p>`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw new Error("Error sending confirmation email: " + error.message);
  }
};

const confirmEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
    res
      .status(400)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

export { createUser, confirmEmail };

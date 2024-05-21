import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// export async function authenticate(req, res, next) {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: "Email ve şifre gereklidir." });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: "Geçersiz email veya şifre." });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!passwordMatch) {
//       return res.status(401).json({ error: "Geçersiz email veya şifre." });
//     }

//     const token = jwt.sign({ userId: user._id }, "yourSecretKey", {
//       expiresIn: "1h",
//     });
//     res.json({ token });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function authorize(req, res, next) {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: "Yetki token'ı gereklidir." });
//     }

//     jwt.verify(token, "yourSecretKey", (err, decoded) => {
//       if (err) {
//         return res.status(403).json({ error: "Geçersiz yetki token'ı." });
//       }
//       req.userId = decoded.userId;
//       next();
//     });
//   } catch (error) {
//     next(error);
//   }
// }

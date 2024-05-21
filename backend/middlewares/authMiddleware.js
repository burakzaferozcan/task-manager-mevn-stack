import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token'ı ayırır
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Token'ı doğrula
    req.user = verified;
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

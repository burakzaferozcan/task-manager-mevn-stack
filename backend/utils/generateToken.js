import jwt from "jsonwebtoken";

const generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export default generateToken;

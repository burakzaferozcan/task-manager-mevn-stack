import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
dotenv.config();
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/auth", userRoutes);
try {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(
      `Example app listening at http://localhost:${process.env.PORT}`
    );
  });
} catch (error) {
  process.exit(1);
}

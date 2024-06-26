import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
dotenv.config();

const app = express();
const corsOptions = {
  origin: process.env.REMOOT_CLIENT_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", userRoutes);
app.use("/api/tasks", taskRoutes);

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

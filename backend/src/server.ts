import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./config/database";
import "./workers/emailWorker";

import emailRoutes from "./routes/emailRoutes";
import testEmailRoutes from "./routes/testEmailRoutes";
import queueTestRoutes from "./routes/queueTestRoutes";

import { initDatabase } from "./config/initDB";

dotenv.config();
console.log("worker file loaded");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/emails", emailRoutes);
app.use("/api/test", testEmailRoutes);
app.use("/api/queue", queueTestRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "ReachInbox Email Scheduler API is running",
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDatabase();

    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

startServer();


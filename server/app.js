import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import agentRoutes from "./routes/userRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check

app.use((req, res, next) => {
  console.log("INCOMING REQUEST:", req.method, req.originalUrl);
  next();
});
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

// Agent routes
app.use("/api/agent", agentRoutes);

export default app;

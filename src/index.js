import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { seedDatabaseIfEmpty } from "./utils/seedDatabase.js";
import { router as apiRouter } from "./routes/apiRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { studentRouter } from "./routes/studentRoutes.js";
import { teacherRouter } from "./routes/teacherRoutes.js";
import { employeeRouter } from "./routes/employeeRoutes.js";
import { leaveRouter } from "./routes/leaveRoutes.js";
import { setupSwagger } from "./config/swagger.js";

dotenv.config();

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT || "5000", 10);

// Security & Request Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "https://ilmsaathi-school.vercel.app/",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Connect MongoDB Database & Seed default users if empty
connectDB().then((connected) => {
  if (connected) {
    seedDatabaseIfEmpty();
  }
});

// Setup Swagger UI Documentation
setupSwagger(app);

// Mount Modular Enterprise API Routers
app.use("/api/auth", authRouter);
app.use("/api/students", studentRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/leaves", leaveRouter);
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to IlmSaathi School Management System (SMS) Backend API",
    swagger: `http://localhost:${DEFAULT_PORT}/docs`,
    health: `http://localhost:${DEFAULT_PORT}/api/health`,
    status: "Running",
  });
});

// Global Express Error Handler
app.use((err, req, res, next) => {
  console.error("[Global Error]", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Catch Unhandled Exceptions & Promise Rejections to prevent node exit
process.on("uncaughtException", (err) => {
  console.error("[Uncaught Exception]", err.message);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("[Unhandled Rejection]", reason);
});

// Resilient HTTP Server Starter with Automatic Port Conflict Resolution
const startServer = (port) => {
  const server = http.createServer(app);

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(
        `[Port Conflict] Port ${port} is currently occupied by another process.`,
      );
      console.warn(
        `[Port Fallback] Retrying server start on fallback port ${port + 1}...`,
      );
      setTimeout(() => {
        startServer(port + 1);
      }, 500);
    } else {
      console.error("[Server Error]", err);
    }
  });

  server.listen(port, () => {
    console.log(
      `[Express Server] IlmSaathi School ERP API listening on http://localhost:${port}`,
    );
  });
};

startServer(DEFAULT_PORT);

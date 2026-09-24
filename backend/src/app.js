import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import routes from "./routes/index.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import env from "./config/env.js";

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Compression
app.use(compression());

// Logging
app.use(morgan("dev"));

// Parse JSON
app.use(express.json());

// API Routes
app.use("/api/v1", routes);

// 404 Middleware
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;
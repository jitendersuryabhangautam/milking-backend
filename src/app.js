import express from "express";
import cors from "cors";
import morgan from "morgan";

import sessionRoutes from "./routes/sessionRoutes.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/sessions", sessionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

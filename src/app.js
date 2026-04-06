const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const sessionRoutes = require("./routes/sessionRoutes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorMiddleware");

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

module.exports = app;

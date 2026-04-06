import express from "express";

import { createSession, getSessions } from "../controllers/sessionController.js";
import { validateCreateSession } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.get("/", getSessions);
router.post("/", validateCreateSession, createSession);

export default router;

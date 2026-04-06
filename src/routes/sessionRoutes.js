const express = require("express");

const { createSession, getSessions } = require("../controllers/sessionController");
const { validateCreateSession } = require("../middlewares/validationMiddleware");

const router = express.Router();

router.get("/", getSessions);
router.post("/", validateCreateSession, createSession);

module.exports = router;

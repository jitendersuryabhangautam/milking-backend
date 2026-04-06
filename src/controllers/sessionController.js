const {
  createMilkingSession,
  listMilkingSessions,
} = require("../models/MilkingSession");

const createSession = async (req, res, next) => {
  try {
    const { start_time, end_time, duration, milk_quantity } = req.body;

    const session = await createMilkingSession({
      start_time,
      end_time,
      duration,
      milk_quantity,
    });

    res.status(201).json({
      id: session.id,
      start_time: session.start_time,
      end_time: session.end_time,
      duration: session.duration,
      milk_quantity: Number(session.milk_quantity),
      created_at: session.created_at,
    });
  } catch (error) {
    next(error);
  }
};

const getSessions = async (_req, res, next) => {
  try {
    const sessions = await listMilkingSessions();

    const payload = sessions.map((session) => ({
      id: session.id,
      start_time: session.start_time,
      end_time: session.end_time,
      duration: session.duration,
      milk_quantity: Number(session.milk_quantity),
      created_at: session.created_at,
    }));

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSession,
  getSessions,
};

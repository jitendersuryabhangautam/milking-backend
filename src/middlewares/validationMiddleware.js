const isValidDate = (value) => !Number.isNaN(Date.parse(value));

const validateCreateSession = (req, res, next) => {
  const { start_time, end_time, duration, milk_quantity } = req.body;

  if (!start_time || !end_time || duration === undefined || milk_quantity === undefined) {
    return res.status(400).json({
      message: "start_time, end_time, duration and milk_quantity are required",
    });
  }

  if (!isValidDate(start_time) || !isValidDate(end_time)) {
    return res.status(400).json({
      message: "start_time and end_time must be valid ISO date strings",
    });
  }

  if (!Number.isFinite(duration) || duration < 0) {
    return res.status(400).json({
      message: "duration must be a non-negative number in seconds",
    });
  }

  if (!Number.isFinite(milk_quantity) || milk_quantity < 0) {
    return res.status(400).json({
      message: "milk_quantity must be a non-negative number",
    });
  }

  const startDate = new Date(start_time);
  const endDate = new Date(end_time);

  if (endDate <= startDate) {
    return res.status(400).json({
      message: "end_time must be later than start_time",
    });
  }

  return next();
};

export { validateCreateSession };

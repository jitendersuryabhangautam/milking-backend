const { pool } = require("../config/db");

const createMilkingSession = async ({ start_time, end_time, duration, milk_quantity }) => {
  const query = `
    INSERT INTO milking_sessions (start_time, end_time, duration, milk_quantity)
    VALUES ($1, $2, $3, $4)
    RETURNING id, start_time, end_time, duration, milk_quantity, created_at;
  `;

  const values = [start_time, end_time, duration, milk_quantity];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const listMilkingSessions = async () => {
  const query = `
    SELECT id, start_time, end_time, duration, milk_quantity, created_at
    FROM milking_sessions
    ORDER BY start_time DESC;
  `;

  const { rows } = await pool.query(query);
  return rows;
};

module.exports = {
  createMilkingSession,
  listMilkingSessions,
};

import pg from "pg";

const { Pool } = pg;

const getPoolConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    };
  }

  return {
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE || "milking_tracker",
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
  };
};

const pool = new Pool(getPoolConfig());

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS milking_sessions (
      id SERIAL PRIMARY KEY,
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL,
      duration INTEGER NOT NULL CHECK (duration >= 0),
      milk_quantity NUMERIC(10,2) NOT NULL CHECK (milk_quantity >= 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log("PostgreSQL connected and schema ready");
};

export { pool, initDB };

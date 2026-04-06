import pg from "pg";

const { Pool } = pg;

const shouldUseSSL = () => {
  if (process.env.PGSSL === "true") return true;
  if (process.env.PGSSL === "false") return false;

  if (!process.env.DATABASE_URL) {
    return process.env.NODE_ENV === "production";
  }

  try {
    const hostname = new URL(process.env.DATABASE_URL).hostname;
    // Render internal Postgres URLs usually don't require SSL.
    if (hostname.endsWith(".internal")) return false;
  } catch (_error) {
    // If URL parsing fails, fall back to production default below.
  }

  return process.env.NODE_ENV === "production";
};

const getPoolConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: shouldUseSSL() ? { rejectUnauthorized: false } : false,
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
  try {
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
  } catch (error) {
    console.error("PostgreSQL init failed:", error);
    throw error;
  }
};

export { pool, initDB };

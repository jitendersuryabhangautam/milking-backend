import pg from "pg";

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === "production";

const getConnectionString = () =>
  process.env.DATABASE_URL ||
  process.env.INTERNAL_DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_INTERNAL_URL ||
  "";

const shouldUseSSL = () => {
  if (process.env.PGSSL === "true") return true;
  if (process.env.PGSSL === "false") return false;

  const connectionString = getConnectionString();
  if (!connectionString) {
    return isProduction;
  }

  try {
    const hostname = new URL(connectionString).hostname;
    // Render internal Postgres URLs usually don't require SSL.
    if (hostname.endsWith(".internal")) return false;
  } catch (_error) {
    // If URL parsing fails, fall back to production default below.
  }

  return isProduction;
};

const getPoolConfig = () => {
  const connectionString = getConnectionString();
  if (connectionString) {
    return {
      connectionString,
      ssl: shouldUseSSL() ? { rejectUnauthorized: false } : false,
    };
  }

  const hasDiscreteConfig =
    process.env.PGHOST &&
    process.env.PGDATABASE &&
    process.env.PGUSER &&
    process.env.PGPASSWORD;

  if (!hasDiscreteConfig && isProduction) {
    throw new Error(
      "Database is not configured. Set DATABASE_URL (or INTERNAL_DATABASE_URL) or PGHOST/PGDATABASE/PGUSER/PGPASSWORD in Render env vars."
    );
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

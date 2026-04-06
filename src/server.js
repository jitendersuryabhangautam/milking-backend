import "dotenv/config";

import app from "./app.js";
import { initDB } from "./config/db.js";

const PORT = Number(process.env.PORT) || 5000;

const bootstrap = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

bootstrap();

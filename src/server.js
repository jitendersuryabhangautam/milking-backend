require("dotenv").config();

const app = require("./app");
const { initDB } = require("./config/db");

const PORT = Number(process.env.PORT) || 5000;

const bootstrap = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

bootstrap();

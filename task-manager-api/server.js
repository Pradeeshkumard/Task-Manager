const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const databaseConnection = require("./configuration/database");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("api/tasks", taskRoutes);

app.use(errorHandler);

app.listen(process.env.PORT || 8000, () => {
  console.log(`API server is running on http://localhost:${process.env.PORT}`);
});

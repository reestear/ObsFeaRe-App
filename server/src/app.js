const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Import route files
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const todoRoutes = require("./routes/todoRoutes");

// Mount routes
app.use("/auth", authRoutes);
// app.use("/login", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/todos", todoRoutes);

module.exports = app;

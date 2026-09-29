require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const planRoutes = require("./routes/planRoutes");
const logRoutes = require("./routes/logRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/plans", planRoutes);
app.use("/api/logs", logRoutes);

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const produceEvents = require("./src/infrastructure/kafka/producer");
const consumeEvents = require("./src/infrastructure/kafka/consumer");
const logRoutes = require("./src/api/routes/logRoutes");

const NODE_ENV = process.env.NODE_ENV || "api";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", logRoutes);

const start = async () => {
  await connectDB();

  if (NODE_ENV === "producer") {
    return produceEvents();
  }

  if (NODE_ENV === "consumer") {
    return consumeEvents();
  }

  if (NODE_ENV === "api") {
    app.listen(PORT, () => {
      console.log(`API server running at http://localhost:${PORT}`);
    });
  }
};

start();

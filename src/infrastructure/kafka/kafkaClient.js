const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "activity-logger",
  brokers: ["kafka:9092"],
});

module.exports = kafka;

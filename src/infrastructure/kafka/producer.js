const kafka = require("./kafkaClient");
const UserActivityEvent = require("../../domain/events/UserActivityEvent");
const producer = kafka.producer();

const simulateUserEvent = () => {
  const events = ["login", "logout", "page_view"];
  const randomEvent = events[Math.floor(Math.random() * events.length)];
  const event = new UserActivityEvent({
    userId: `user-${Math.ceil(Math.random() * 10)}`,
    eventType: randomEvent,
    metadata: {
      ip: "127.0.0.1",
      userAgent: "Mozilla/5.0",
    },
  });
  return event;
};

const produceEvents = async () => {
  await producer.connect();

  setInterval(async () => {
    const event = simulateUserEvent();
    console.log(`[Producer] Event: ${JSON.stringify(event)}`);
    await producer.send({
      topic: "user-activity-logs",
      messages: [{ value: JSON.stringify(event) }],
    });
  }, 3000);
};

produceEvents();
module.exports = produceEvents;

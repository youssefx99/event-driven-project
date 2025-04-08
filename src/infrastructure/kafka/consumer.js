const kafka = require("./kafkaClient");
const ActivityEvent = require("../../domain/activityEvent");
const UserActivityEvent = require("../../domain/events/UserActivityEvent");

const consumer = kafka.consumer({ groupId: "activity-group" });

const consumeEvents = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "user-activity-logs",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const rawEvent = JSON.parse(message.value.toString());
        if (!UserActivityEvent.validate(rawEvent)) {
          console.warn("[Consumer] Invalid event received:", rawEvent);
          return;
        }

        console.log(`[Consumer] Received: ${JSON.stringify(rawEvent)}`);
        const activity = new ActivityEvent(rawEvent);
        await activity.save();
      } catch (err) {
        console.error("[Consumer] Failed to process message:", err.message);
      }
    },
  });
};
consumeEvents();
module.exports = consumeEvents;

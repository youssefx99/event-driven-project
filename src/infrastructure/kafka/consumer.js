const kafka = require('./kafkaClient');
const ActivityEvent = require('../../domain/activityEvent');
const UserActivityEvent = require('../../domain/events/UserActivityEvent');

const consumer = kafka.consumer({ groupId: 'activity-group' });

const consumeEvents = async () => {
  try {
    await consumer.connect();
    console.log('[Consumer] Connected to Kafka');

    await consumer.subscribe({
      topic: 'user-activity-logs',
      fromBeginning: true,
    });
    console.log('[Consumer] Subscribed to user-activity-logs topic');

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const rawEvent = JSON.parse(message.value.toString());
          if (!UserActivityEvent.validate(rawEvent)) {
            console.warn('[Consumer] Invalid event received:', rawEvent);
            return;
          }

          console.log(`[Consumer] Received: ${JSON.stringify(rawEvent)}`);
          const activity = new ActivityEvent(rawEvent);
          await activity.save();
          console.log('[Consumer] Event saved to MongoDB');
        } catch (err) {
          console.error('[Consumer] Failed to process message:', err.message);
        }
      },
    });
  } catch (error) {
    console.error('[Consumer] Failed to connect to Kafka:', error.message);
    process.exit(1);
  }
};
consumeEvents();
module.exports = consumeEvents;

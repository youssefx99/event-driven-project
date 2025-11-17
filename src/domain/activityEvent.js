const mongoose = require('mongoose');

const ActivityEventSchema = new mongoose.Schema({
  userId: String,
  eventType: String,
  timestamp: { type: Date, default: Date.now },
  metadata: Object,
});

ActivityEventSchema.index({ userId: 1, timestamp: -1 });
ActivityEventSchema.index({ eventType: 1, timestamp: -1 });
ActivityEventSchema.index({ userId: 1, eventType: 1, timestamp: -1 });
ActivityEventSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ActivityEvent', ActivityEventSchema);

const mongoose = require("mongoose");

const ActivityEventSchema = new mongoose.Schema({
  userId: String,
  eventType: String,
  timestamp: { type: Date, default: Date.now },
  metadata: Object,
});

ActivityEventSchema.index({ userId: 1, eventType: 1 });

module.exports = mongoose.model("ActivityEvent", ActivityEventSchema);

class UserActivityEvent {
  constructor({ userId, eventType, timestamp, metadata }) {
    this.userId = userId;
    this.eventType = eventType;
    this.timestamp = timestamp || new Date().toISOString();
    this.metadata = metadata || {};
  }

  static validate(event) {
    return (
      typeof event.userId === "string" &&
      typeof event.eventType === "string" &&
      typeof event.timestamp === "string"
    );
  }
}

module.exports = UserActivityEvent;

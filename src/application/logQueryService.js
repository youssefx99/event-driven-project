const ActivityEvent = require("../domain/activityEvent");

const getLogs = async (filters, pagination) => {
  const { page, pageSize } = pagination;
  const { userId, activityType, from, to } = filters;

  const query = {};
  if (userId) query.userId = userId;
  if (activityType) query.eventType = activityType;
  if (from || to) {
    query.timestamp = {};
    if (from) query.timestamp.$gte = new Date(from);
    if (to) query.timestamp.$lte = new Date(to);
  }

  const skip = (page - 1) * pageSize;

  const logs = await ActivityEvent.find(query)
    .skip(skip)
    .limit(pageSize)
    .sort({ timestamp: -1 });
  const total = await ActivityEvent.countDocuments(query);

  return { total, data: logs };
};

module.exports = { getLogs };

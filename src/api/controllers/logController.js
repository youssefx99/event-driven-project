const { getLogs } = require('../../application/logQueryService');

const getLogsHandler = async (req, res) => {
  try {
    let { page = 1, pageSize = 10, userId, activityType, from, to } = req.query;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    if (isNaN(page) || page < 1) {
      return res.status(400).json({ message: 'Invalid page number' });
    }

    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
      return res.status(400).json({ message: 'Invalid page size (1-100)' });
    }

    if (from && isNaN(Date.parse(from))) {
      return res.status(400).json({ message: "Invalid 'from' date format" });
    }

    if (to && isNaN(Date.parse(to))) {
      return res.status(400).json({ message: "Invalid 'to' date format" });
    }

    const result = await getLogs(
      { userId, activityType, from, to },
      { page, pageSize }
    );

    res.json({
      total: result.total,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize),
      data: result.data,
    });
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

module.exports = { getLogs: getLogsHandler };

const { getLogs } = require("../../application/logQueryService");

const getLogsHandler = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      userId,
      activityType,
      from,
      to,
    } = req.query;

    const result = await getLogs(
      { userId, activityType, from, to },
      { page: parseInt(page), pageSize: parseInt(pageSize) }
    );

    res.json({
      total: result.total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getLogs: getLogsHandler };

const StudyLog = require("../models/StudyLog");

exports.createLog = async (req, res) => {
  try {
    const { plan, subject, seconds, date } = req.body;
    if (!plan || !subject || !seconds || !date) {
      return res.status(400).json({ message: "plan, subject, seconds and date are required" });
    }
    const log = await StudyLog.create({ plan, subject, seconds: Math.round(seconds), date });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await StudyLog.find({ plan: req.params.planId }).sort({ createdAt: 1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
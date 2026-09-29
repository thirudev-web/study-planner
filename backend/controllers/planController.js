const Plan = require("../models/Plan");
const StudyLog = require("../models/StudyLog");
const { generateSchedule } = require("../utils/scheduler");

exports.createPlan = async (req, res) => {
  try {
    const { title, dailyHours, subjects } = req.body;

    if (!dailyHours || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: "dailyHours and subjects are required" });
    }

    const schedule = generateSchedule({ subjects, dailyHours });
    if (!schedule.length) {
      return res.status(400).json({ message: "Exam dates must be in the future" });
    }

    const plan = await Plan.create({ title, dailyHours, subjects, schedule });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPlans = async (_req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    await StudyLog.deleteMany({ plan: req.params.id }); // remove the plan's timer logs too
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
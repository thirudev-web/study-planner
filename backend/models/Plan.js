const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  difficulty: { type: Number, min: 1, max: 5, default: 3 },
  examDate: { type: Date, required: true },
});

const sessionSchema = new mongoose.Schema(
  { subject: String, hours: Number, type: String },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  { date: String, sessions: [sessionSchema] },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    title: { type: String, default: "My Study Plan" },
    dailyHours: { type: Number, required: true, min: 0.5, max: 16 },
    subjects: [subjectSchema],
    schedule: [daySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
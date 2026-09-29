const mongoose = require("mongoose");

const studyLogSchema = new mongoose.Schema(
  {
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    subject: { type: String, required: true },
    seconds: { type: Number, required: true, min: 1 },
    date: { type: String, required: true }, // YYYY-MM-DD (user's local day)
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudyLog", studyLogSchema);
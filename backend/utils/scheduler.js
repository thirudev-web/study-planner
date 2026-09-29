const DAY = 24 * 60 * 60 * 1000;

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

/**
 * Generates a day-by-day schedule.
 * Weight = difficulty * (1 + 5 / daysLeft)  -> harder + closer exams get more time.
 * Time is allocated in 30-minute slots using the largest-remainder method.
 */
function generateSchedule({ subjects, dailyHours }) {
  const slotsPerDay = Math.round(dailyHours * 2);
  const today = startOfDay(new Date());
  const lastExam = new Date(
    Math.max(...subjects.map((s) => startOfDay(s.examDate).getTime()))
  );

  const schedule = [];

  for (let d = new Date(today); d < lastExam; d = new Date(d.getTime() + DAY)) {
    // Only subjects whose exam is still ahead
    const active = subjects.filter((s) => startOfDay(s.examDate) > d);
    if (!active.length) continue;

    const daysLeft = active.map((s) =>
      Math.max(1, Math.round((startOfDay(s.examDate) - d) / DAY))
    );
    const weights = active.map((s, i) => s.difficulty * (1 + 5 / daysLeft[i]));
    const total = weights.reduce((a, b) => a + b, 0);

    const raw = weights.map((w) => (w / total) * slotsPerDay);
    const alloc = raw.map(Math.floor);
    let remaining = slotsPerDay - alloc.reduce((a, b) => a + b, 0);

    raw
      .map((v, i) => ({ i, frac: v - Math.floor(v) }))
      .sort((a, b) => b.frac - a.frac)
      .forEach(({ i }) => {
        if (remaining > 0) {
          alloc[i] += 1;
          remaining--;
        }
      });

    const sessions = active
      .map((s, i) => ({
        subject: s.name,
        hours: alloc[i] / 2,
        type: daysLeft[i] <= 2 ? "Revision" : "Study",
      }))
      .filter((s) => s.hours > 0);

    schedule.push({ date: d.toISOString().slice(0, 10), sessions });
  }

  return schedule;
}

module.exports = { generateSchedule };
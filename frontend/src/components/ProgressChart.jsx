import { todayStr } from "./StudyTimer";

const hrs = (s) => (s / 3600).toFixed(2);

const lastNDays = (n) => {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`
    );
  }
  return out;
};

export default function ProgressChart({ plan, logs, live }) {
  // Planned hours per subject, from the generated schedule
  const planned = {};
  plan.schedule.forEach((day) =>
    day.sessions.forEach((s) => {
      planned[s.subject] = (planned[s.subject] || 0) + s.hours;
    })
  );

  // Studied seconds per subject (saved logs + the session running right now)
  const studied = {};
  logs.forEach((l) => (studied[l.subject] = (studied[l.subject] || 0) + l.seconds));
  if (live.seconds > 0) studied[live.subject] = (studied[live.subject] || 0) + live.seconds;

  // Studied seconds per day for the last 7 days
  const days = lastNDays(7);
  const perDay = Object.fromEntries(days.map((d) => [d, 0]));
  logs.forEach((l) => {
    if (l.date in perDay) perDay[l.date] += l.seconds;
  });
  if (live.seconds > 0) perDay[todayStr()] += live.seconds;
  const maxDay = Math.max(...Object.values(perDay), 1800); // at least a 30 min scale

  const totalStudied = Object.values(studied).reduce((a, b) => a + b, 0);
  const totalPlanned = Object.values(planned).reduce((a, b) => a + b, 0);
  const overall = totalPlanned ? Math.min(100, (totalStudied / 3600 / totalPlanned) * 100) : 0;

  return (
    <div className="card">
      <h3>📈 Progress {live.seconds > 0 && <span className="live-dot">● LIVE</span>}</h3>

      <p className="muted">
        Overall: {hrs(totalStudied)} / {totalPlanned.toFixed(1)} hrs ({overall.toFixed(0)}%)
      </p>
      <div className="bar overall">
        <div className="bar-fill" style={{ width: `${overall}%` }} />
      </div>

      <h4>By subject</h4>
      {plan.subjects.map((s) => {
        const p = planned[s.name] || 0;
        const done = (studied[s.name] || 0) / 3600;
        const pct = p ? Math.min(100, (done / p) * 100) : 0;
        return (
          <div key={s._id || s.name} className="subj-progress">
            <div className="subj-label">
              <span>{s.name}</span>
              <span className="muted">
                {done.toFixed(2)} / {p.toFixed(1)} hr · {pct.toFixed(0)}%
              </span>
            </div>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}

      <h4>Last 7 days (minutes)</h4>
      <div className="week-chart">
        {days.map((d) => {
          const sec = perDay[d];
          const isToday = d === todayStr();
          return (
            <div key={d} className="week-col">
              <span className="week-val">{Math.round(sec / 60)}</span>
              <div className="week-track">
                <div
                  className={`week-bar ${isToday ? "today" : ""}`}
                  style={{ height: `${(sec / maxDay) * 100}%` }}
                />
              </div>
              <span className="week-day">
                {new Date(d + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
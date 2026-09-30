import { useEffect, useState } from "react";
import StudyTimer from "./StudyTimer";
import ProgressChart from "./ProgressChart";
import { getLogs } from "../api";

const fmt = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export default function ScheduleView({ plan, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [logs, setLogs] = useState([]);
  const [live, setLive] = useState({ subject: "", seconds: 0 });

  useEffect(() => {
    getLogs(plan._id).then(setLogs).catch(() => setLogs([]));
  }, [plan._id]);

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{plan.title}</h2>
          <p className="muted">
            {plan.dailyHours} hrs/day · {plan.subjects.length} subject(s)
          </p>
        </div>

        {!confirming ? (
          <button className="danger" onClick={() => setConfirming(true)}>
             Delete schedule
          </button>
        ) : (
          <div className="confirm-box">
            <span>Delete this schedule?</span>
            <button className="danger solid" onClick={onDelete}>
              Yes, delete
            </button>
            <button className="secondary small" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="tracker-grid">
        <StudyTimer
          plan={plan}
          onTick={(subject, seconds) => setLive({ subject, seconds })}
          onSaved={(log) => setLogs((prev) => [...prev, log])}
        />
        <ProgressChart plan={plan} logs={logs} live={live} />
      </div>

      <div className="exams">
        {plan.subjects.map((s, i) => (
          <span
            key={s._id || s.name}
            className="chip"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {s.name} — {new Date(s.examDate).toLocaleDateString()}
          </span>
        ))}
      </div>

      {plan.schedule.map((day, i) => (
        <div
          key={day.date}
          className="card day"
          style={{ animationDelay: `${Math.min(i, 15) * 60}ms` }}
        >
          <strong>{fmt(day.date)}</strong>
          <ul>
            {day.sessions.map((s, j) => (
              <li key={j}>
                <span className={`tag ${s.type.toLowerCase()}`}>{s.type}</span>
                {s.subject} — {s.hours} hr
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
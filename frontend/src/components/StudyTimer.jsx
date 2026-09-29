import { useEffect, useRef, useState } from "react";
import { saveLog } from "../api";

export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const fmt = (s) => {
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
};

export default function StudyTimer({ plan, onTick, onSaved }) {
  const [subject, setSubject] = useState(plan.subjects[0]?.name || "");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const baseMs = useRef(0);   // time accumulated before the current run
  const startMs = useRef(0);  // when the current run started

  // Ticking uses real timestamps, so it stays accurate even if the tab is throttled
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((baseMs.current + Date.now() - startMs.current) / 1000));
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  // Push live seconds up so the graph updates in parallel
  useEffect(() => {
    onTick(subject, elapsed);
  }, [elapsed, subject]); // eslint-disable-line

  // Warn before closing the tab while a session is active
  useEffect(() => {
    if (!running) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [running]);

  const start = () => {
    startMs.current = Date.now();
    setRunning(true);
  };

  const pause = () => {
    baseMs.current += Date.now() - startMs.current;
    setRunning(false);
  };

  const stop = async () => {
    const total = running
      ? Math.floor((baseMs.current + Date.now() - startMs.current) / 1000)
      : elapsed;
    setRunning(false);
    setError("");

    if (total >= 1) {
      setSaving(true);
      try {
        const log = await saveLog({
          plan: plan._id,
          subject,
          seconds: total,
          date: todayStr(),
        });
        onSaved(log);
      } catch (e) {
        setError(e.message);
        setSaving(false);
        return; // keep the time so the user can retry
      }
      setSaving(false);
    }
    baseMs.current = 0;
    setElapsed(0);
    onTick(subject, 0);
  };

  const idle = !running && elapsed === 0;

  return (
    <div className="card timer-card">
      <h3>⏱ Study Timer</h3>

      <select value={subject} onChange={(e) => setSubject(e.target.value)} disabled={!idle}>
        {plan.subjects.map((s) => (
          <option key={s._id || s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      <div className={`clock ${running ? "live" : ""}`}>{fmt(elapsed)}</div>
      {running && <p className="muted center">Studying {subject}…</p>}
      {error && <p className="error">{error}</p>}

      <div className="timer-buttons">
        {!running ? (
          <button onClick={start} disabled={saving}>
            {elapsed > 0 ? "▶ Resume" : "▶ Start studying"}
          </button>
        ) : (
          <button className="secondary" onClick={pause}>
            ⏸ Pause
          </button>
        )}
        <button className="danger solid" onClick={stop} disabled={idle || saving}>
          {saving ? "Saving…" : "⏹ Stop & save"}
        </button>
      </div>
    </div>
  );
}
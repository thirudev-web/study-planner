import { useState } from "react";

const emptySubject = { name: "", difficulty: 3, examDate: "" };

export default function PlanForm({ onSubmit }) {
  const [title, setTitle] = useState("My Study Plan");
  const [dailyHours, setDailyHours] = useState(4);
  const [subjects, setSubjects] = useState([{ ...emptySubject }]);

  const update = (i, field, value) =>
    setSubjects(subjects.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  const add = () => setSubjects([...subjects, { ...emptySubject }]);
  const remove = (i) => setSubjects(subjects.filter((_, idx) => idx !== i));

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      dailyHours: Number(dailyHours),
      subjects: subjects.map((s) => ({ ...s, difficulty: Number(s.difficulty) })),
    });
  };

  return (
    <form onSubmit={submit} className="card">
      <h3>New Plan</h3>

      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label>Available hours per day</label>
      <input
        type="number"
        min="0.5"
        max="16"
        step="0.5"
        value={dailyHours}
        onChange={(e) => setDailyHours(e.target.value)}
        required
      />

      <h4>Subjects</h4>
      {subjects.map((s, i) => (
        <div key={i} className="subject-row">
          <input
            placeholder="Subject"
            value={s.name}
            onChange={(e) => update(i, "name", e.target.value)}
            required
          />
          <select
            value={s.difficulty}
            onChange={(e) => update(i, "difficulty", e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                Difficulty {n}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={s.examDate}
            onChange={(e) => update(i, "examDate", e.target.value)}
            required
          />
          {subjects.length > 1 && (
            <button type="button" className="link" onClick={() => remove(i)}>
              ✕
            </button>
          )}
        </div>
      ))}

      <button type="button" className="secondary" onClick={add}>
        + Add subject
      </button>
      <button type="submit">Generate Schedule</button>
    </form>
  );
}
import { useEffect, useState } from "react";
import PlanForm from "./components/PlanForm";
import ScheduleView from "./components/ScheduleView";
import { createPlan, getPlans, deletePlan } from "./api";

export default function App() {
  const [plans, setPlans] = useState([]);
  const [active, setActive] = useState(null);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    getPlans()
      .then((data) => {
        setPlans(data);
        if (data.length) setActive(data[0]);
      })
      .catch((e) => setError(e.message));
  }, []);

  const handleCreate = async (payload) => {
    setError("");
    try {
      const plan = await createPlan(payload);
      setPlans([plan, ...plans]);
      setActive(plan);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setRemovingId(id); // triggers fade-out animation
    await new Promise((r) => setTimeout(r, 350)); // wait for animation
    try {
      await deletePlan(id);
      const rest = plans.filter((p) => p._id !== id);
      setPlans(rest);
      if (active?._id === id) setActive(rest[0] || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="container">
      <h1 className="title"> AI Study Planner</h1>
      {error && <p className="error">{error}</p>}

      <div className="layout">
        <aside>
          <PlanForm onSubmit={handleCreate} />
          <h3>Saved Plans</h3>
          {plans.length === 0 && <p className="muted">No plans yet.</p>}
          {plans.map((p) => (
            <div
              key={p._id}
              className={`plan-item ${active?._id === p._id ? "selected" : ""} ${
                removingId === p._id ? "removing" : ""
              }`}
              onClick={() => setActive(p)}
            >
              <span>{p.title}</span>
              <button
                className="link"
                title="Delete plan"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(p._id);
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </aside>

        <main className={removingId === active?._id ? "removing" : ""}>
          {active ? (
            <ScheduleView
              key={active._id}
              plan={active}
              onDelete={() => handleDelete(active._id)}
            />
          ) : (
            <p className="muted">Create a plan to see your schedule.</p>
          )}
        </main>
      </div>
    </div>
  );
}
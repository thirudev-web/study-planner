const BASE = "/api/plans";

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ---------- Plans ----------
export const createPlan = (payload) =>
  fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handle);

export const getPlans = () => fetch(BASE).then(handle);

export const deletePlan = (id) =>
  fetch(`${BASE}/${id}`, { method: "DELETE" }).then(handle);

// ---------- Study logs (timer) ----------
export const saveLog = (payload) =>
  fetch("/api/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handle);

export const getLogs = (planId) => fetch(`/api/logs/${planId}`).then(handle);
const TOKEN_KEY = "attestatsiya_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
const request = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, { ...options, headers: { "Content-Type": "application/json", ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}), ...options.headers } });
  const text = await response.text();
  const data = text ? (() => {
    try { return JSON.parse(text); }
    catch { return { error: text }; }
  })() : {};
  if (!response.ok) throw new Error(data.error || "Server xatosi.");
  return data;
};
const authRequest = async (path, values) => {
  const data = await request(path, { method: "POST", body: JSON.stringify(values) });
  localStorage.setItem(TOKEN_KEY, data.token); return data.user;
};
export const api = {
  me: () => request("/auth/me"), register: values => authRequest("/auth/register", values), login: values => authRequest("/auth/login", values), adminLogin: values => authRequest("/auth/admin-login", values),
  myResults: () => request("/results/me"), result: id => request(`/results/${id}`), leaderboard: (category, fast) => request(`/leaderboard?category=${encodeURIComponent(category)}&fast=${fast}`), users: () => request("/admin/users"),
  adminQuestionSummary: () => request("/admin/questions-summary"),
  createQuestion: values => request("/admin/questions", { method: "POST", body: JSON.stringify(values) }),
  startQuiz: category => request("/quiz/start", { method: "POST", body: JSON.stringify({ category }) }), answerQuiz: (sessionId, selectedAnswer) => request("/quiz/answer", { method: "POST", body: JSON.stringify({ sessionId, selectedAnswer }) }),
  continueQuiz: sessionId => request("/quiz/continue", { method: "POST", body: JSON.stringify({ sessionId }) }),
};

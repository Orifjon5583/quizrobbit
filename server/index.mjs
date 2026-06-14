import "dotenv/config";
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { initDatabase, pool } from "./db.mjs";
import { categoryFileName, categories as questionCategories, publicQuestion, questionMap, questions, refreshQuestions, shuffle } from "./questions.mjs";

const app = express();
const port = Number(process.env.PORT || 3001);
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET .env faylida kiritilishi kerak.");
app.use(express.json());

const levelFor = percentage => percentage >= 90 ? "Expert" : percentage >= 70 ? "Advanced" : percentage >= 50 ? "Intermediate" : "Beginner";
const tokenFor = user => jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: "7d" });
const userJson = user => ({ uid: user.id, name: user.name, displayName: user.name, email: user.email, role: user.role, createdAt: user.created_at });
const resultJson = result => ({ id: result.id, userId: result.user_id, userName: result.user_name, category: result.category, correctCount: result.correct_count, wrongCount: result.wrong_count, percentage: result.percentage, score: result.score, level: result.level, durationSeconds: result.duration_seconds, createdAt: result.created_at });
const auth = (req, res, next) => {
  try { req.auth = jwt.verify(req.headers.authorization?.replace("Bearer ", "") || "", jwtSecret); next(); }
  catch { res.status(401).json({ error: "Tizimga qayta kiring." }); }
};
const admin = (req, res, next) => req.auth.role === "admin" ? next() : res.status(403).json({ error: "Admin ruxsati kerak." });
const questionFilePath = category => resolve("data/questions", categoryFileName(category));
const normalizeQuestionPayload = body => {
  const category = String(body.category || "").trim();
  const question = String(body.question || "").trim();
  const options = [body.option1, body.option2, body.option3, body.option4].map(value => String(value || "").trim());
  const correctAnswer = String(body.correctAnswer || "").trim();
  const difficulty = String(body.difficulty || "easy").trim();
  return { category, question, options, correctAnswer, difficulty };
};

app.get("/api/health", (_req, res) => res.json({ ok: true, questions: questions.length }));
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) return res.status(400).json({ error: "Ma'lumotlarni to'g'ri kiriting." });
    const user = { id: randomUUID(), name: name.trim(), email: email.trim().toLowerCase(), role: "user", created_at: new Date().toISOString() };
    await pool.query("INSERT INTO users(id, name, email, password_hash) VALUES($1,$2,$3,$4)", [user.id, user.name, user.email, await bcrypt.hash(password, 12)]);
    res.json({ token: tokenFor(user), user: userJson(user) });
  } catch (error) { res.status(error.code === "23505" ? 409 : 500).json({ error: error.code === "23505" ? "Bu email bilan avval ro'yxatdan o'tilgan." : "Server xatosi." }); }
});
app.post("/api/auth/login", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [String(req.body.email || "").trim().toLowerCase()]);
  const user = rows[0];
  if (!user || !await bcrypt.compare(req.body.password || "", user.password_hash)) return res.status(401).json({ error: "Email yoki parol noto'g'ri." });
  res.json({ token: tokenFor(user), user: userJson(user) });
});
app.post("/api/auth/admin-login", (req, res) => {
  if (req.body.email !== process.env.ADMIN_LOGIN || req.body.password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: "Admin login yoki paroli noto'g'ri." });
  const user = { id: "admin", name: "Administrator", email: process.env.ADMIN_LOGIN, role: "admin" };
  res.json({ token: tokenFor(user), user: userJson(user) });
});
app.get("/api/auth/me", auth, async (req, res) => {
  if (req.auth.role === "admin") return res.json({ uid: "admin", name: "Administrator", email: process.env.ADMIN_LOGIN, role: "admin" });
  const { rows } = await pool.query("SELECT * FROM users WHERE id=$1", [req.auth.id]);
  rows[0] ? res.json(userJson(rows[0])) : res.status(404).json({ error: "Foydalanuvchi topilmadi." });
});
app.get("/api/results/me", auth, async (req, res) => {
  const { rows } = await pool.query("SELECT r.*, u.name user_name FROM results r JOIN users u ON u.id=r.user_id WHERE r.user_id=$1 ORDER BY r.created_at DESC", [req.auth.id]);
  res.json(rows.map(resultJson));
});
app.get("/api/results/:id", auth, async (req, res) => {
  const { rows } = await pool.query("SELECT r.*, u.name user_name FROM results r JOIN users u ON u.id=r.user_id WHERE r.id=$1 AND r.user_id=$2", [req.params.id, req.auth.id]);
  rows[0] ? res.json(resultJson(rows[0])) : res.status(404).json({ error: "Natija topilmadi." });
});
app.get("/api/leaderboard", auth, async (req, res) => {
  const params = []; let where = "";
  if (req.query.category && req.query.category !== "global") { params.push(req.query.category); where = "WHERE r.category=$1"; }
  const order = req.query.fast === "true" ? "r.duration_seconds ASC" : "r.score DESC, r.duration_seconds ASC";
  const { rows } = await pool.query(`SELECT r.*, u.name user_name FROM results r JOIN users u ON u.id=r.user_id ${where} ORDER BY ${order} LIMIT 10`, params);
  res.json(rows.map(resultJson));
});
app.get("/api/admin/users", auth, admin, async (_req, res) => {
  const { rows } = await pool.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
  res.json(rows.map(userJson));
});
app.get("/api/admin/questions-summary", auth, admin, (_req, res) => {
  const counts = Object.fromEntries(questionCategories.map(category => [category, 0]));
  for (const question of questions) counts[question.category] = (counts[question.category] || 0) + 1;
  res.json({ total: questions.length, categories: counts });
});
app.post("/api/admin/questions", auth, admin, async (req, res) => {
  try {
    const payload = normalizeQuestionPayload(req.body);
    if (!payload.category || !payload.question || payload.options.some(option => !option)) return res.status(400).json({ error: "Ma'lumotlarni to'g'ri kiriting." });
    if (!questionCategories.includes(payload.category)) return res.status(400).json({ error: "Bunday kategoriya mavjud emas." });
    if (!payload.options.includes(payload.correctAnswer)) return res.status(400).json({ error: "To'g'ri javob variantlardan biriga teng bo'lishi kerak." });
    if (!["easy", "medium", "hard"].includes(payload.difficulty)) return res.status(400).json({ error: "Difficulty noto'g'ri." });

    const path = questionFilePath(payload.category);
    const rows = JSON.parse(await readFile(path, "utf8"));
    if (!Array.isArray(rows)) return res.status(500).json({ error: "Savollar fayli noto'g'ri formatda." });
    if (rows.some(row => String(row.question || "").trim().toLowerCase() === payload.question.toLowerCase())) return res.status(409).json({ error: "Bu savol allaqachon mavjud." });

    rows.push({ category: payload.category, question: payload.question, options: payload.options, correctAnswer: payload.correctAnswer, difficulty: payload.difficulty });
    await writeFile(path, `${JSON.stringify(rows, null, 2)}\n`);
    await refreshQuestions();
    res.json({ ok: true, count: rows.length });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server xatosi." });
  }
});
app.post("/api/quiz/start", auth, async (req, res) => {
  const selected = shuffle(questions.filter(question => question.category === req.body.category)).slice(0, 25);
  if (selected.length < 25) return res.status(400).json({ error: "Bu yo'nalishda 25 ta savol mavjud emas." });
  const id = randomUUID();
  await pool.query("INSERT INTO quiz_sessions(id,user_id,category,question_ids) VALUES($1,$2,$3,$4)", [id, req.auth.id, req.body.category, JSON.stringify(selected.map(question => question.id))]);
  res.json({ sessionId: id, category: req.body.category, index: 0, total: 25, question: publicQuestion(selected[0]) });
});
app.post("/api/quiz/answer", auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query("SELECT * FROM quiz_sessions WHERE id=$1 AND user_id=$2 FOR UPDATE", [req.body.sessionId, req.auth.id]);
    const session = rows[0];
    if (!session || session.status !== "active") throw new Error("Quiz sessiyasi yakunlangan.");
    if (session.answers.length > session.current_index) throw new Error("Bu savolga javob allaqachon berilgan.");
    const question = questionMap.get(session.question_ids[session.current_index]);
    const elapsed = Date.now() - new Date(session.question_started_at).getTime();
    const selectedAnswer = elapsed <= 20_000 ? req.body.selectedAnswer ?? null : null;
    const answers = [...session.answers, { questionId: question.id, selectedAnswer, isCorrect: selectedAnswer === question.correctAnswer }];
    await client.query("UPDATE quiz_sessions SET answers=$1 WHERE id=$2", [JSON.stringify(answers), session.id]);
    await client.query("COMMIT");
    res.json({
      sessionId: session.id,
      category: session.category,
      index: session.current_index,
      total: session.question_ids.length,
      question: publicQuestion(question),
      review: {
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: selectedAnswer === question.correctAnswer,
      },
      canContinue: true,
      completed: false,
    });
  } catch (error) { await client.query("ROLLBACK"); res.status(400).json({ error: error.message }); } finally { client.release(); }
});
app.post("/api/quiz/continue", auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query("SELECT * FROM quiz_sessions WHERE id=$1 AND user_id=$2 FOR UPDATE", [req.body.sessionId, req.auth.id]);
    const session = rows[0];
    if (!session || session.status !== "active") throw new Error("Quiz sessiyasi yakunlangan.");
    if (session.answers.length !== session.current_index + 1) throw new Error("Avval javobni tasdiqlang.");

    const nextIndex = session.current_index + 1;
    if (nextIndex < session.question_ids.length) {
      await client.query("UPDATE quiz_sessions SET current_index=$1,question_started_at=NOW() WHERE id=$2", [nextIndex, session.id]);
      await client.query("COMMIT");
      return res.json({ sessionId: session.id, category: session.category, index: nextIndex, total: session.question_ids.length, question: publicQuestion(questionMap.get(session.question_ids[nextIndex])) });
    }

    const answers = session.answers;
    const correctCount = answers.filter(answer => answer.isCorrect).length;
    const total = session.question_ids.length;
    const percentage = Math.round(correctCount / total * 100);
    const resultId = randomUUID();
    await client.query("INSERT INTO results(id,user_id,category,correct_count,wrong_count,percentage,score,level,duration_seconds) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)", [resultId, req.auth.id, session.category, correctCount, total - correctCount, percentage, correctCount * 4, levelFor(percentage), Math.round((Date.now() - new Date(session.started_at).getTime()) / 1000)]);
    await client.query("UPDATE quiz_sessions SET status='completed' WHERE id=$1", [session.id]);
    await client.query("COMMIT");
    res.json({ completed: true, resultId });
  } catch (error) { await client.query("ROLLBACK"); res.status(400).json({ error: error.message }); } finally { client.release(); }
});

app.use("/api", (error, _req, res, _next) => { console.error(error); res.status(500).json({ error: "Server xatosi." }); });
app.use(express.static(resolve("dist")));
app.use((_req, res) => res.sendFile(resolve("dist/index.html")));
await initDatabase();
app.listen(port, "127.0.0.1", () => console.log(`Attestatsiya server 127.0.0.1:${port} portda ishlayapti.`));

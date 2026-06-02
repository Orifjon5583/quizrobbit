import initialQuestions from "../generated/questions.json";
import questionVersion from "../generated/questions-version.json";
import { getLevel } from "./constants";

const KEYS = { users: "quiz_users", questions: "quiz_questions", questionsVersion: "quiz_questions_version", results: "quiz_results", session: "quiz_current_user" };
const id = () => crypto.randomUUID();
const read = (key, fallback = []) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const shuffle = items => [...items].sort(() => Math.random() - 0.5);
const publicUser = ({ password, passwordHash, passwordSalt, ...user }) => user;
const hashPassword = async (password, salt) => {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
};

export const ensureQuestions = () => {
  if (localStorage.getItem(KEYS.questionsVersion) !== String(questionVersion.version)) {
    write(KEYS.questions, initialQuestions.map(question => ({ ...question, id: id() })));
    localStorage.setItem(KEYS.questionsVersion, String(questionVersion.version));
  }
};
export const getCurrentUser = () => read(KEYS.session, null);
export const logout = () => localStorage.removeItem(KEYS.session);
export const register = async ({ name, email, password }) => {
  const users = read(KEYS.users);
  if (users.some(user => user.email === email)) throw new Error("Bu email bilan avval ro'yxatdan o'tilgan.");
  const passwordSalt = id();
  const user = { uid: id(), name, displayName: name, email, passwordSalt, passwordHash: await hashPassword(password, passwordSalt), role: "user", createdAt: new Date().toISOString() };
  const sessionUser = publicUser(user);
  write(KEYS.users, [...users, user]); write(KEYS.session, sessionUser); return sessionUser;
};
export const login = async ({ email, password }) => {
  const users = read(KEYS.users); const userIndex = users.findIndex(item => item.email === email);
  if (userIndex === -1) throw new Error("Email yoki parol noto'g'ri.");
  const user = users[userIndex];
  const matches = user.passwordHash ? await hashPassword(password, user.passwordSalt) === user.passwordHash : user.password === password;
  if (!matches) throw new Error("Email yoki parol noto'g'ri.");
  if (!user.passwordHash) {
    const passwordSalt = id();
    users[userIndex] = { ...user, passwordSalt, passwordHash: await hashPassword(password, passwordSalt) };
    delete users[userIndex].password;
    write(KEYS.users, users);
  }
  const sessionUser = publicUser(users[userIndex]);
  write(KEYS.session, sessionUser); return sessionUser;
};
export const loginAdmin = ({ email, password }) => {
  if (email !== "admin" || password !== "admin123") throw new Error("Admin login yoki paroli noto'g'ri.");
  const user = { uid: "local-admin", name: "Administrator", displayName: "Administrator", email: "admin", role: "admin" };
  write(KEYS.session, user); return user;
};
export const getRows = type => read(KEYS[type]);
export const saveQuestion = question => {
  const questions = read(KEYS.questions); const saved = { ...question, id: question.id || id(), updatedAt: new Date().toISOString() };
  write(KEYS.questions, question.id ? questions.map(item => item.id === question.id ? saved : item) : [...questions, saved]);
};
export const deleteQuestion = questionId => write(KEYS.questions, read(KEYS.questions).filter(item => item.id !== questionId));
export const addQuestions = questions => write(KEYS.questions, [...read(KEYS.questions), ...questions.map(question => ({ ...question, id: id(), createdAt: new Date().toISOString() }))]);
export const startQuiz = category => {
  const questions = shuffle(read(KEYS.questions).filter(question => question.category === category)).slice(0, 25);
  if (questions.length < 25) throw new Error("Bu yo'nalishda kamida 25 ta savol bo'lishi kerak.");
  return { category, questions: questions.map(question => ({ ...question, options: shuffle(question.options) })), index: 0, answers: [], startedAt: Date.now() };
};
export const finishQuiz = (quiz, user) => {
  const correctCount = quiz.answers.filter(answer => answer.isCorrect).length;
  const percentage = Math.round((correctCount / quiz.questions.length) * 100);
  const result = { id: id(), userId: user.uid, userName: user.name, category: quiz.category, correctCount, wrongCount: quiz.questions.length - correctCount, percentage, score: correctCount * 4, level: getLevel(percentage), durationSeconds: Math.round((Date.now() - quiz.startedAt) / 1000), createdAt: new Date().toISOString() };
  write(KEYS.results, [...read(KEYS.results), result]); return result;
};
export const getResult = resultId => read(KEYS.results).find(result => result.id === resultId);

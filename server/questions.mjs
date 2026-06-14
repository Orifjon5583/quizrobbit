import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const questionDir = resolve("data/questions");
const allowedDifficulties = new Set(["easy", "medium", "hard"]);

export let questions = [];
export let questionMap = new Map();
export let categories = [];

const slugify = value => String(value)
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

export const categoryFileName = category => `${slugify(category)}.json`;

const normalizeRow = (row, source, index) => {
  const category = String(row.category || "").trim();
  const question = String(row.question || "").trim();
  const options = [row.options?.[0], row.options?.[1], row.options?.[2], row.options?.[3]].map(value => String(value || "").trim());
  const correctAnswer = String(row.correctAnswer || "").trim();
  const difficulty = String(row.difficulty || "easy").trim();

  if (!category) throw new Error(`${source} qator ${index + 1}: category bo'sh.`);
  if (!question) throw new Error(`${source} qator ${index + 1}: question bo'sh.`);
  if (options.some(option => !option)) throw new Error(`${source} qator ${index + 1}: variantlar bo'sh.`);
  if (!options.includes(correctAnswer)) throw new Error(`${source} qator ${index + 1}: correctAnswer variantlardan biriga teng emas.`);
  if (!allowedDifficulties.has(difficulty)) throw new Error(`${source} qator ${index + 1}: difficulty noto'g'ri.`);

  return {
    id: createHash("sha1").update(`${source}:${index}:${category}:${question}`).digest("hex"),
    category,
    question,
    options,
    correctAnswer,
    difficulty,
  };
};

export async function refreshQuestions() {
  const files = (await readdir(questionDir)).filter(file => file.endsWith(".json")).sort();
  if (!files.length) throw new Error("data/questions papkasida savollar topilmadi.");

  const rawQuestions = [];
  for (const file of files) {
    const rows = JSON.parse(await readFile(resolve(questionDir, file), "utf8"));
    if (!Array.isArray(rows)) throw new Error(`${file} fayli massiv formatida bo'lishi kerak.`);
    rows.forEach((row, index) => rawQuestions.push(normalizeRow(row, file, index)));
  }

  questions = rawQuestions;
  questionMap = new Map(questions.map(question => [question.id, question]));
  categories = [...new Set(questions.map(question => question.category))];
  return { questions, questionMap, categories };
}

export const shuffle = items => [...items].sort(() => Math.random() - 0.5);
export const publicQuestion = question => ({ id: question.id, question: question.question, options: shuffle(question.options), difficulty: question.difficulty });

await refreshQuestions();

import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const questionDir = resolve("data/questions");
const files = (await readdir(questionDir)).filter(file => file.endsWith(".json")).sort();

if (!files.length) throw new Error("data/questions papkasida savollar topilmadi.");

const rawQuestions = [];
for (const file of files) {
  const rows = JSON.parse(await readFile(resolve(questionDir, file), "utf8"));
  if (!Array.isArray(rows)) throw new Error(`${file} fayli massiv formatida bo'lishi kerak.`);
  rows.forEach((row, index) => rawQuestions.push({ ...row, __file: file, __line: index + 2 }));
}

export const questions = rawQuestions.map((row, index) => {
  const fileLabel = row.__file || "questions.json";
  const line = row.__line || index + 2;
  const category = String(row.category || "").trim();
  const question = String(row.question || "").trim();
  const options = [row.options?.[0], row.options?.[1], row.options?.[2], row.options?.[3]].map(value => String(value || "").trim());
  const correctAnswer = String(row.correctAnswer || "").trim();
  const difficulty = String(row.difficulty || "easy").trim();

  if (!category) throw new Error(`${fileLabel}:${line} qatorida category bo'sh.`);
  if (!question) throw new Error(`${fileLabel}:${line} qatorida question bo'sh.`);
  if (options.some(option => !option)) throw new Error(`${fileLabel}:${line} qatorida variantlar bo'sh.`);
  if (!options.includes(correctAnswer)) throw new Error(`${fileLabel}:${line} qatorida correctAnswer variantlardan biriga teng emas.`);
  if (!["easy", "medium", "hard"].includes(difficulty)) throw new Error(`${fileLabel}:${line} qatorida difficulty noto'g'ri.`);

  return {
    id: createHash("sha1").update(`${index}:${category}:${question}`).digest("hex"),
    category,
    question,
    options,
    correctAnswer,
    difficulty,
  };
});

const counts = new Map();
for (const question of questions) counts.set(question.category, (counts.get(question.category) || 0) + 1);
for (const [category, count] of counts) {
  if (count < 25) throw new Error(`${category} bo'limida kamida 25 ta savol bo'lishi kerak.`);
}

export const categories = [...counts.keys()];
export const questionMap = new Map(questions.map(question => [question.id, question]));
export const shuffle = items => [...items].sort(() => Math.random() - 0.5);
export const publicQuestion = question => ({ id: question.id, question: question.question, options: shuffle(question.options), difficulty: question.difficulty });

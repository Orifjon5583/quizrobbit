import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const questionDir = resolve("data/questions");
const categoryCatalog = JSON.parse(await readFile(resolve("data/categories.json"), "utf8"));
const allowedCategories = new Set(categoryCatalog.map(category => category.name));
const files = (await readdir(questionDir)).filter(file => file.endsWith(".json")).sort();
const questions = [];

for (const file of files) {
  const rows = JSON.parse(await readFile(resolve(questionDir, file), "utf8"));
  if (!Array.isArray(rows)) throw new Error(`${file} fayli massiv formatida bo'lishi kerak.`);
  rows.forEach((row, index) => {
    const line = index + 2;
    const category = String(row.category || "").trim();
    const question = String(row.question || "").trim();
    const options = [row.options?.[0], row.options?.[1], row.options?.[2], row.options?.[3]].map(value => String(value || "").trim());
    const correctAnswer = String(row.correctAnswer || "").trim();
    const difficulty = String(row.difficulty || "easy").trim();

    if (!category) throw new Error(`${file}:${line} qatorida category bo'sh.`);
    if (!allowedCategories.has(category)) throw new Error(`${file}:${line} qatorida category noto'g'ri.`);
    if (!question) throw new Error(`${file}:${line} qatorida question bo'sh.`);
    if (options.some(option => !option)) throw new Error(`${file}:${line} qatorida variantlar bo'sh.`);
    if (!options.includes(correctAnswer)) throw new Error(`${file}:${line} qatorida correctAnswer variantlardan biriga teng emas.`);
    if (!["easy", "medium", "hard"].includes(difficulty)) throw new Error(`${file}:${line} qatorida difficulty noto'g'ri.`);

    questions.push({ category, question, options, correctAnswer, difficulty });
  });
}

const json = `${JSON.stringify(questions, null, 2)}\n`;
const version = createHash("sha256").update(json).digest("hex").slice(0, 12);
await mkdir(resolve("src/generated"), { recursive: true });
await writeFile(resolve("src/generated/questions.json"), json);
await writeFile(resolve("src/generated/questions-version.json"), `${JSON.stringify({ version }, null, 2)}\n`);
console.log(`${questions.length} ta savol data/questions dan yangilandi.`);

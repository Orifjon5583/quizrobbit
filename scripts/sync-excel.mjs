import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import XLSX from "xlsx";

const source = resolve("savollar.xlsx");
const workbook = XLSX.readFile(source);
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
const allowedCategories = ["Scratch", "Python", "App Inventor", "Spike Prime", "Onshape", "Arduino", "ESP32", "IoT Blynk"];
const questions = rows.map((row, index) => {
  const line = index + 2;
  const options = [row.option1, row.option2, row.option3, row.option4].map(value => String(value).trim());
  const question = { category: String(row.category).trim(), question: String(row.question).trim(), options, correctAnswer: String(row.correctAnswer).trim(), difficulty: String(row.difficulty || "easy").trim() };
  if (!allowedCategories.includes(question.category)) throw new Error(`${line}-qatorda category noto'g'ri.`);
  if (!question.question || options.some(option => !option)) throw new Error(`${line}-qatorda savol yoki variant bo'sh.`);
  if (!options.includes(question.correctAnswer)) throw new Error(`${line}-qatorda correctAnswer variantlardan biriga teng emas.`);
  if (!["easy", "medium", "hard"].includes(question.difficulty)) throw new Error(`${line}-qatorda difficulty noto'g'ri.`);
  return question;
});
await mkdir(resolve("src/generated"), { recursive: true });
const json = `${JSON.stringify(questions, null, 2)}\n`;
const version = createHash("sha256").update(json).digest("hex").slice(0, 12);
await writeFile(resolve("src/generated/questions.json"), json);
await writeFile(resolve("src/generated/questions-version.json"), `${JSON.stringify({ version }, null, 2)}\n`);
console.log(`${questions.length} ta savol Excel fayldan yangilandi.`);

import { createHash } from "node:crypto";
import { resolve } from "node:path";
import ExcelJS from "exceljs";

const categories = ["Scratch", "Python", "App Inventor", "Spike Prime", "Onshape", "Arduino", "ESP32", "IoT Blynk"];
const workbook = new ExcelJS.Workbook(); await workbook.xlsx.readFile(resolve("savollar.xlsx"));
const sheet = workbook.worksheets[0]; const headers = sheet.getRow(1).values.slice(1).map(String);
const rows = []; sheet.eachRow((row, index) => { if (index > 1) rows.push(Object.fromEntries(headers.map((header, cell) => [header, row.getCell(cell + 1).text]))); });
export const questions = rows.map((row, index) => {
  const options = [row.option1, row.option2, row.option3, row.option4].map(value => String(value).trim());
  const question = { id: createHash("sha1").update(`${index}:${row.category}:${row.question}`).digest("hex"), category: String(row.category).trim(), question: String(row.question).trim(), options, correctAnswer: String(row.correctAnswer).trim(), difficulty: String(row.difficulty || "easy").trim() };
  if (!categories.includes(question.category)) throw new Error(`${index + 2}-qatorda category noto'g'ri.`);
  if (!question.question || options.some(option => !option)) throw new Error(`${index + 2}-qatorda savol yoki variant bo'sh.`);
  if (!options.includes(question.correctAnswer)) throw new Error(`${index + 2}-qatorda correctAnswer noto'g'ri.`);
  return question;
});
export const questionMap = new Map(questions.map(question => [question.id, question]));
export const shuffle = items => [...items].sort(() => Math.random() - 0.5);
export const publicQuestion = question => ({ id: question.id, question: question.question, options: shuffle(question.options), difficulty: question.difficulty });

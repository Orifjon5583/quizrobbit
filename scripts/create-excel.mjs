import ExcelJS from "exceljs";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const questionDir = resolve("data/questions");
const categoryCatalog = JSON.parse(await readFile(resolve("data/categories.json"), "utf8"));
const allowedCategories = new Set(categoryCatalog.map(category => category.name));
const files = (await readdir(questionDir)).filter(file => file.endsWith(".json")).sort();
const questions = [];

for (const file of files) {
  const rows = JSON.parse(await readFile(resolve(questionDir, file), "utf8"));
  if (!Array.isArray(rows)) throw new Error(`${file} fayli massiv formatida bo'lishi kerak.`);
  questions.push(...rows.map(({ category, question, options, correctAnswer, difficulty }) => {
    if (!allowedCategories.has(category)) throw new Error(`${file} faylida category noto'g'ri: ${category}`);
    return {
      category,
      question,
      option1: options[0],
      option2: options[1],
      option3: options[2],
      option4: options[3],
      correctAnswer,
      difficulty,
    };
  }));
}

const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet("Savollar");
sheet.columns = Object.keys(questions[0]).map(key => ({ header: key, key, width: key === "question" ? 60 : 30 }));
sheet.addRows(questions);
await workbook.xlsx.writeFile(resolve("savollar.xlsx"));
console.log(`${questions.length} ta savol savollar.xlsx fayliga yozildi.`);

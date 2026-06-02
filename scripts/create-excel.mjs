import ExcelJS from "exceljs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const files = ["scratch", "python", "app-inventor", "spike-prime", "onshape", "arduino", "esp32", "iot-blynk"];
const questions = [];
for (const file of files) {
  const rows = JSON.parse(await readFile(resolve(`data/questions/${file}.json`), "utf8"));
  questions.push(...rows.map(({ category, question, options, correctAnswer, difficulty }) => ({ category, question, option1: options[0], option2: options[1], option3: options[2], option4: options[3], correctAnswer, difficulty })));
}
const workbook = new ExcelJS.Workbook(); const sheet = workbook.addWorksheet("Savollar");
sheet.columns = Object.keys(questions[0]).map(key => ({ header: key, key, width: key === "question" ? 60 : 30 }));
sheet.addRows(questions);
await workbook.xlsx.writeFile(resolve("savollar.xlsx"));
console.log(`${questions.length} ta savol savollar.xlsx fayliga yozildi.`);

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import * as XLSX from "xlsx";

const files = ["scratch", "python", "app-inventor", "spike-prime", "onshape", "arduino", "esp32", "iot-blynk"];
const questions = [];
for (const file of files) {
  const rows = JSON.parse(await readFile(resolve(`data/questions/${file}.json`), "utf8"));
  questions.push(...rows.map(({ category, question, options, correctAnswer, difficulty }) => ({
    category, question, option1: options[0], option2: options[1], option3: options[2], option4: options[3], correctAnswer, difficulty,
  })));
}
const sheet = XLSX.utils.json_to_sheet(questions);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, sheet, "Savollar");
XLSX.writeFile(workbook, resolve("savollar.xlsx"));
console.log(`${questions.length} ta savol savollar.xlsx fayliga yozildi.`);

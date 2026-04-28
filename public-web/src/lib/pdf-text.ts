import fs from "fs/promises";
import pdfParse from "pdf-parse";

export async function extractTextFromPdf(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  const data = await pdfParse(buffer);

  return data.text.trim();
}
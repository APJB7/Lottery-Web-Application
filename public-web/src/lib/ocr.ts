export async function extractTextFromImage(imagePath: string): Promise<string> {
  const Tesseract = await import("tesseract.js");

  const result = await Tesseract.recognize(imagePath, "eng", {
    logger: (m: { status: string; progress?: number }) => {
      if (m.status === "recognizing text" && typeof m.progress === "number") {
        console.log(`OCR progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  return result.data.text;
}
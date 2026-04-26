export type ReceiptVerificationResult = {
  extractedAmount: number | null;
  extractedReceiver: string | null;
  extractedReference: string | null;
  verificationScore: number;
  verificationNotes: string;
};

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function extractAmount(text: string): number | null {
  const cleaned = text.replace(/,/g, "");
  const match =
    cleaned.match(/(?:rs|mur|amount|paid)\s*[:\-]?\s*(\d+(?:\.\d{1,2})?)/i) ||
    cleaned.match(/\b(\d{2,6}(?:\.\d{1,2})?)\b/);

  return match ? Number(match[1]) : null;
}

function extractReceiver(text: string, expectedReceiver: string): string | null {
  const compact = text.replace(/\s+/g, "");
  const expectedCompact = expectedReceiver.replace(/\s+/g, "");

  if (compact.includes(expectedCompact)) return expectedReceiver;

  const candidates = text.match(/\b\d{4,15}\b/g);
  if (!candidates) return null;

  const found = candidates.find((p) => p.includes(expectedReceiver));
  return found || null;
}

function extractReference(text: string, expectedReference: string): string | null {
  const compactText = text.replace(/\s+/g, "").toLowerCase();
  const compactExpected = expectedReference.replace(/\s+/g, "").toLowerCase();

  if (compactText.includes(compactExpected)) return expectedReference;

  const match = text.match(/LOT-\d{4}-\d+/i);
  return match ? match[0] : null;
}

export function verifyReceiptAgainstExpected(input: {
  extractedText: string;
  expectedAmount: number;
  expectedReceiverPhone: string;
  expectedReferenceCode: string;
}): ReceiptVerificationResult {
  const text = normalize(input.extractedText);

  const extractedAmount = extractAmount(text);
  const extractedReceiver = extractReceiver(text, input.expectedReceiverPhone);
  const extractedReference = extractReference(text, input.expectedReferenceCode);

  let score = 0;
  const notes: string[] = [];

  if (extractedAmount !== null && extractedAmount === input.expectedAmount) {
    score += 30;
    notes.push("Amount matched.");
  } else {
    notes.push("Amount did not match.");
  }

  if (extractedReceiver !== null) {
    score += 40;
    notes.push("Receiver matched.");
  } else {
    notes.push("Receiver did not match.");
  }

  if (
    extractedReference !== null &&
    extractedReference.replace(/\s+/g, "").toLowerCase() ===
      input.expectedReferenceCode.replace(/\s+/g, "").toLowerCase()
  ) {
    score += 30;
    notes.push("Reference matched.");
  } else {
    notes.push("Reference did not match.");
  }

  return {
    extractedAmount,
    extractedReceiver,
    extractedReference,
    verificationScore: score,
    verificationNotes: notes.join(" "),
  };
}
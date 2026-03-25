export type ReceiptVerificationResult = {
  extractedAmount: number | null;
  extractedReceiver: string | null;
  extractedReference: string | null;
  verificationScore: number;
  verificationNotes: string;
};

function extractAmount(text: string): number | null {
  const cleaned = text.replace(/,/g, "");
  const amountMatch =
    cleaned.match(/(?:rs|mur|amount|paid)\s*[:\-]?\s*(\d+(?:\.\d{1,2})?)/i) ||
    cleaned.match(/\b(\d{2,6}(?:\.\d{1,2})?)\b/);

  if (!amountMatch) return null;
  return Number(amountMatch[1]);
}

function extractReceiver(text: string, expectedReceiver: string): string | null {
  const normalized = text.replace(/\s+/g, "");
  if (normalized.includes(expectedReceiver.replace(/\s+/g, ""))) {
    return expectedReceiver;
  }

  const phoneMatch = text.match(/\b\d{4,15}\b/g);
  if (!phoneMatch) return null;

  const found = phoneMatch.find((p) => p.includes(expectedReceiver));
  return found || null;
}

function extractReference(text: string, expectedReference: string): string | null {
  const normalizedText = text.replace(/\s+/g, "").toLowerCase();
  const normalizedRef = expectedReference.replace(/\s+/g, "").toLowerCase();

  if (normalizedText.includes(normalizedRef)) {
    return expectedReference;
  }

  const refMatch = text.match(/LOT-\d{4}-\d+/i);
  return refMatch ? refMatch[0] : null;
}

export function verifyReceiptAgainstExpected(input: {
  extractedText: string;
  expectedAmount: number;
  expectedReceiverPhone: string;
  expectedReferenceCode: string;
}): ReceiptVerificationResult {
  const text = input.extractedText;

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
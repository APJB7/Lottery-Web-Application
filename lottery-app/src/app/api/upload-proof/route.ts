import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { verifyReceiptAgainstExpected } from "@/lib/receipt-verifier";
import { extractTextFromImage } from "@/lib/ocr";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const entryId = formData.get("entryId");
    const file = formData.get("file");

    if (!entryId || typeof entryId !== "string") {
      return NextResponse.json({ error: "Invalid entry id" }, { status: 400 });
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const entry = await prisma.entry.findUnique({
      where: { id: entryId },
      include: {
        lotteryItem: true,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const safeFilename = `${Date.now()}-${entry.referenceCode}.${ext}`;
    const filePath = path.join(uploadsDir, safeFilename);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;

    let extractedText = "";
    let verificationScore = 0;
    let verificationNotes = "OCR not executed.";
    let extractedAmount: number | null = null;
    let extractedReceiver: string | null = null;
    let extractedReference: string | null = null;
    let derivedStatus = "PENDING_REVIEW";

    if (file.type === "image/png" || file.type === "image/jpeg") {
      extractedText = await extractTextFromImage(filePath);

      const verification = verifyReceiptAgainstExpected({
        extractedText,
        expectedAmount: entry.lotteryItem.ticketPrice,
        expectedReceiverPhone: entry.lotteryItem.receiverPhone,
        expectedReferenceCode: entry.referenceCode,
      });

      extractedAmount = verification.extractedAmount;
      extractedReceiver = verification.extractedReceiver;
      extractedReference = verification.extractedReference;
      verificationScore = verification.verificationScore;
      verificationNotes = verification.verificationNotes;

      if (verificationScore >= 90) {
        derivedStatus = "AUTO_VERIFIED";
      } else {
        derivedStatus = "PENDING_REVIEW";
      }
    } else {
      verificationNotes =
        "PDF uploaded. OCR not run in this version. Manual review required.";
    }

    const updated = await prisma.entry.update({
      where: { id: entryId },
      data: {
        proofImageUrl: publicUrl,
        status: derivedStatus,
        extractedAmount,
        extractedReceiver,
        extractedReference,
        verificationScore,
        verificationNotes,
      },
    });

    return NextResponse.json({
      success: true,
      status: updated.status,
      extractedText,
      entry: updated,
    });
  } catch (error) {
    console.error("UPLOAD_PROOF_ERROR:", error);
    return NextResponse.json(
      { error: "Upload failed on server" },
      { status: 500 }
    );
  }
}
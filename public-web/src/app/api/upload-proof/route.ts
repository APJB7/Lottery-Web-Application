import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { uploadProofToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  let filePath: string | null = null;

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
      return NextResponse.json(
        { error: "Unsupported file type. Please upload JPG, PNG, or PDF only." },
        { status: 400 }
      );
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

    const uploadsDir = "/tmp";
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext =
      file.name.includes(".") && file.name.split(".").pop()
        ? file.name.split(".").pop()
        : file.type === "application/pdf"
        ? "pdf"
        : "jpg";

    const safeFilename = `${Date.now()}-${entry.referenceCode}.${ext}`;
    filePath = path.join(uploadsDir, safeFilename);

    await fs.writeFile(filePath, buffer);

    const publicUrl = await uploadProofToCloudinary(
      filePath,
      entry.referenceCode
    );

    await fs.unlink(filePath).catch(() => {});

    const updated = await prisma.entry.update({
      where: { id: entryId },
      data: {
        proofImageUrl: publicUrl,
        status: "PENDING_REVIEW",
        extractedAmount: null,
        extractedReceiver: null,
        extractedReference: null,
        verificationScore: 0,
        verificationNotes:
          "Proof uploaded successfully. OCR is disabled in deployment, so admin manual review is required.",
      },
    });

    return NextResponse.json({
      success: true,
      status: updated.status,
      entry: updated,
    });
  } catch (error) {
    console.error("UPLOAD_PROOF_ERROR:", error);

    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }

    return NextResponse.json(
      { error: "Upload failed on server" },
      { status: 500 }
    );
  }
}
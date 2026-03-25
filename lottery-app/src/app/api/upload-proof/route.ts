import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

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

    const updated = await prisma.entry.update({
      where: { id: entryId },
      data: {
        proofImageUrl: publicUrl,
        status: "PENDING_REVIEW",
      },
    });

    return NextResponse.json({
      success: true,
      status: updated.status,
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
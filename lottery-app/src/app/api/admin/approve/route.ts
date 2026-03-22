import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const approveSchema = z.object({
  entryId: z.string(),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = approveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const { entryId, status } = parsed.data;

    const entry = await prisma.entry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Entry not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.entry.update({
      where: { id: entryId },
      data: {
        status,
      },
    });

    return NextResponse.json({
      success: true,
      entry: updated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Approval failed" },
      { status: 500 }
    );
  }
}
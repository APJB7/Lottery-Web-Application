import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  slug: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(4),
  address: z.string().min(3),
  nationality: z.string().min(2),
});

function generateReferenceCode() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `LOT-${new Date().getFullYear()}-${random}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { slug, fullName, email, phone, address, nationality } = parsed.data;

    const lotteryItem = await prisma.lotteryItem.findUnique({
      where: { slug },
    });

    if (!lotteryItem) {
      return NextResponse.json(
        { error: "Lottery item not found" },
        { status: 404 }
      );
    }

    const participant = await prisma.participant.create({
      data: {
        fullName,
        email,
        phone,
        address,
        nationality,
      },
    });

    const entry = await prisma.entry.create({
      data: {
        referenceCode: generateReferenceCode(),
        participantId: participant.id,
        lotteryItemId: lotteryItem.id,
      },
    });

    await prisma.lotteryItem.update({
      where: { id: lotteryItem.id },
      data: {
        totalParticipants: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      entryId: entry.id,
      referenceCode: entry.referenceCode,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
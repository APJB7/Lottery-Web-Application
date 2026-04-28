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
  consentAccepted: z.literal(true),
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
        {
          error: "Invalid form data",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { slug, fullName, email, phone, address, nationality} = parsed.data;

    const lotteryItem = await prisma.lotteryItem.findUnique({
      where: { slug },
    });

    if (!lotteryItem) {
      return NextResponse.json(
        { error: "Lottery item not found" },
        { status: 404 }
      );
    }

    if (lotteryItem.status === "CLOSED" || lotteryItem.winnerName) {
      return NextResponse.json(
        { error: "This lottery is closed and no longer accepts entries." },
        { status: 400 }
      );
    }

    const existingEntry = await prisma.entry.findFirst({
      where: {
        lotteryItemId: lotteryItem.id,
        applicantEmail: email,
        status: {
          in: ["PENDING_PAYMENT", "PENDING_REVIEW", "AUTO_VERIFIED", "APPROVED"],
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        {
          error:
            "An entry already exists for this email address in the current lottery.",
        },
        { status: 400 }
      );
    }

    const entry = await prisma.entry.create({
      data: {
        referenceCode: generateReferenceCode(),
        lotteryItemId: lotteryItem.id,
        paymentAmount: lotteryItem.ticketPrice,
        applicantFullName: fullName,
        applicantEmail: email,
        applicantPhone: phone,
        applicantAddress: address,
        applicantNationality: nationality,
      },
    });

    return NextResponse.json({
      success: true,
      entryId: entry.id,
      referenceCode: entry.referenceCode,
    });
  } catch (error) {
    console.error("REGISTER_ROUTE_ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
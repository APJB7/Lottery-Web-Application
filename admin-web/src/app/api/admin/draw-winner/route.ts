import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const drawWinnerSchema = z.object({
  lotteryItemId: z.string(),
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("luckyflow_admin");

    if (!adminCookie || adminCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = drawWinnerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { lotteryItemId } = parsed.data;

    const lotteryItem = await prisma.lotteryItem.findUnique({
      where: { id: lotteryItemId },
      include: {
        entries: {
          where: {
            status: "APPROVED",
          },
        },
      },
    });

    if (!lotteryItem) {
      return NextResponse.json(
        { error: "Lottery item not found" },
        { status: 404 }
      );
    }

    if (lotteryItem.winnerEntryId) {
      return NextResponse.json(
        { error: "A winner has already been drawn for this lottery." },
        { status: 400 }
      );
    }

    if (lotteryItem.entries.length === 0) {
      return NextResponse.json(
        { error: "No approved entries available for winner selection." },
        { status: 400 }
      );
    }

    const randomIndex = Math.floor(Math.random() * lotteryItem.entries.length);
    const winningEntry = lotteryItem.entries[randomIndex];

    const updatedLottery = await prisma.lotteryItem.update({
      where: { id: lotteryItemId },
      data: {
        winnerName: winningEntry.applicantFullName,
        winnerEntryId: winningEntry.id,
        status: "CLOSED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Winner drawn successfully.",
      lottery: updatedLottery,
      winner: {
        entryId: winningEntry.id,
        participantName: winningEntry.applicantFullName,
        participantEmail: winningEntry.applicantEmail,
        referenceCode: winningEntry.referenceCode,
      },
    });
  } catch (error) {
    console.error("DRAW_WINNER_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to draw winner" },
      { status: 500 }
    );
  }
}
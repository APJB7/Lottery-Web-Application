import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const resetWinnerSchema = z.object({
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
    const parsed = resetWinnerSchema.safeParse(body);

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
    });

    if (!lotteryItem) {
      return NextResponse.json({ error: "Lottery item not found" }, { status: 404 });
    }

    const updatedLottery = await prisma.lotteryItem.update({
      where: { id: lotteryItemId },
      data: {
        winnerName: null,
        winnerEntryId: null,
        status: "OPEN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Winner has been reset successfully.",
      lottery: updatedLottery,
    });
  } catch (error) {
    console.error("RESET_WINNER_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to reset winner" },
      { status: 500 }
    );
  }
}
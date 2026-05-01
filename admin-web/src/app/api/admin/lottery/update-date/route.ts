import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateDateSchema = z.object({
  lotteryItemId: z.string(),
  drawDate: z.string().optional(),
  closingDate: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("luckyflow_admin");

    if (!adminCookie || adminCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateDateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { lotteryItemId, drawDate, closingDate } = parsed.data;

    const updated = await prisma.lotteryItem.update({
      where: { id: lotteryItemId },
      data: {
        drawDate: drawDate ? new Date(drawDate) : null,
        closingDate: closingDate ? new Date(closingDate) : null,
      },
    });

    return NextResponse.json({
      success: true,
      lotteryItem: updated,
    });
  } catch (error) {
    console.error("UPDATE_LOTTERY_DATE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update lottery date" },
      { status: 500 }
    );
  }
}
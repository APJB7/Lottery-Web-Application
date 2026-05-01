import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const deleteSchema = z.object({
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
    const parsed = deleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { lotteryItemId } = parsed.data;

    await prisma.entry.deleteMany({
      where: {
        lotteryItemId,
      },
    });

    await prisma.lotteryItem.delete({
      where: {
        id: lotteryItemId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lottery item deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE_LOTTERY_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete lottery item" },
      { status: 500 }
    );
  }
}
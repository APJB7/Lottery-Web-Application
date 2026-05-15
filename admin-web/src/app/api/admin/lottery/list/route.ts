import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("luckyflow_admin");

  if (!adminCookie || adminCookie.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lotteries = await prisma.lotteryItem.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      entries: true,
    },
  });

  return NextResponse.json(lotteries);
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const entries = await prisma.entry.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        participant: true,
        lotteryItem: true,
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}
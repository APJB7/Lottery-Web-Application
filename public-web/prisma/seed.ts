import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.lotteryItem.findUnique({
    where: { slug: "iphone-15-pro-max" },
  });

  if (!existing) {
    await prisma.lotteryItem.create({
      data: {
        slug: "iphone-15-pro-max",
        title: "iPhone 15 Pro Max",
        description:
          "Join this premium lottery draw for a chance to win a brand new iPhone 15 Pro Max. Complete registration, pay the participation fee, upload your receipt, and await verification.",
        imageUrl:
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1400&auto=format&fit=crop",
        ticketPrice: 500,
        receiverPhone: "58165253",
        status: "OPEN",
        drawDate: new Date("2026-04-30T18:00:00.000Z"),
        closingDate: new Date("2026-04-29T18:00:00.000Z"),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
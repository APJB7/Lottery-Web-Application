import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.lotteryItem.findUnique({
    where: { slug: "ps4-bundle" },
  });

  if (!existing) {
    await prisma.lotteryItem.create({
      data: {
        slug: "ps4-bundle",
        title: "PS4 Bundle",
        description:
          "Win a PlayStation 4 Pro in excellent condition (9/10), complete with 2 wireless controllers. Enjoy high-performance gaming and endless entertainment.",
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
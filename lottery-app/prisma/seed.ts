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
          "Join this lottery for a chance to win a brand new iPhone 15 Pro Max. Complete your registration, make your payment, and upload your proof of payment.",
        imageUrl:
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop",
        ticketPrice: 500,
        receiverPhone: "1234",
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
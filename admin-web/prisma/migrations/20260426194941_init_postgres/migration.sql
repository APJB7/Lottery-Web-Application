-- CreateTable
CREATE TABLE "LotteryItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "ticketPrice" DOUBLE PRECISION NOT NULL,
    "receiverPhone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "drawDate" TIMESTAMP(3),
    "closingDate" TIMESTAMP(3),
    "winnerName" TEXT,
    "winnerEntryId" TEXT,
    "totalParticipants" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LotteryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    "proofImageUrl" TEXT,
    "paymentAmount" DOUBLE PRECISION,
    "extractedAmount" DOUBLE PRECISION,
    "extractedReceiver" TEXT,
    "extractedReference" TEXT,
    "verificationScore" INTEGER,
    "verificationNotes" TEXT,
    "applicantFullName" TEXT NOT NULL,
    "applicantEmail" TEXT NOT NULL,
    "applicantPhone" TEXT NOT NULL,
    "applicantAddress" TEXT NOT NULL,
    "applicantNationality" TEXT NOT NULL,
    "approvedParticipantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lotteryItemId" TEXT NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LotteryItem_slug_key" ON "LotteryItem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Entry_referenceCode_key" ON "Entry"("referenceCode");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_lotteryItemId_fkey" FOREIGN KEY ("lotteryItemId") REFERENCES "LotteryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

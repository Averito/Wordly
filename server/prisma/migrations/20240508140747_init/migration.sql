-- CreateTable
CREATE TABLE "Level" (
    "id" SERIAL NOT NULL,
    "isUserCreated" BOOLEAN NOT NULL DEFAULT true,
    "word" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 6,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

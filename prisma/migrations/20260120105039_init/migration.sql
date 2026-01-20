-- CreateTable
CREATE TABLE "Spectacle" (
    "id" INTEGER NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "troupe" TEXT NOT NULL,

    CONSTRAINT "Spectacle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListeContact" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "ListeContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContactToListeContact" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ContactToListeContact_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ContactToListeContact_B_index" ON "_ContactToListeContact"("B");

-- AddForeignKey
ALTER TABLE "_ContactToListeContact" ADD CONSTRAINT "_ContactToListeContact_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToListeContact" ADD CONSTRAINT "_ContactToListeContact_B_fkey" FOREIGN KEY ("B") REFERENCES "ListeContact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

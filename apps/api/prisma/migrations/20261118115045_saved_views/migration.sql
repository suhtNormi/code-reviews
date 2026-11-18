-- CreateTable
CREATE TABLE "SavedView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nameKey" TEXT NOT NULL,
    "indicator" TEXT NOT NULL,
    "year" INTEGER,
    "countries" TEXT NOT NULL,
    "order" TEXT NOT NULL,
    "region" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedView_nameKey_key" ON "SavedView"("nameKey");

/*
  Warnings:

  - A unique constraint covering the columns `[postId,identityId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identityId` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "identityId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_postId_identityId_key" ON "Reaction"("postId", "identityId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "AnonymousIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

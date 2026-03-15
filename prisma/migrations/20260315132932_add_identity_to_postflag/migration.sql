/*
  Warnings:

  - A unique constraint covering the columns `[postId,identityId]` on the table `PostFlag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identityId` to the `PostFlag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostFlag" ADD COLUMN     "identityId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PostFlag_postId_identityId_key" ON "PostFlag"("postId", "identityId");

-- AddForeignKey
ALTER TABLE "PostFlag" ADD CONSTRAINT "PostFlag_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "AnonymousIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

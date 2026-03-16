/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identityId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "identityId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_postId_key" ON "ChatRoom"("postId");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "AnonymousIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

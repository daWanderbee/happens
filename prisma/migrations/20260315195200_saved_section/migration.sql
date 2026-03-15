-- CreateTable
CREATE TABLE "SavedPost" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedPost_identityId_postId_key" ON "SavedPost"("identityId", "postId");

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "AnonymousIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "PostFlag" DROP CONSTRAINT "PostFlag_postId_fkey";

-- AddForeignKey
ALTER TABLE "PostFlag" ADD CONSTRAINT "PostFlag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

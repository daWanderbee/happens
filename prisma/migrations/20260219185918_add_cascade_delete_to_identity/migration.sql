-- DropForeignKey
ALTER TABLE "AnonymousIdentity" DROP CONSTRAINT "AnonymousIdentity_userId_fkey";

-- AddForeignKey
ALTER TABLE "AnonymousIdentity" ADD CONSTRAINT "AnonymousIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

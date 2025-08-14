-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'SELLER';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "addressJson" JSONB,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "idx_order_userId" ON "public"."Order"("userId");

-- CreateIndex
CREATE INDEX "idx_user_role_status" ON "public"."User"("role", "status");

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SALES';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountHolder" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "businessAddress" TEXT,
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "licenseDocUrl" TEXT,
ADD COLUMN     "medicalCertUrl" TEXT,
ADD COLUMN     "ownerIdProofUrl" TEXT,
ADD COLUMN     "pharmacyLicense" TEXT,
ADD COLUMN     "proofOfAddressUrl" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "storeLogoUrl" TEXT,
ADD COLUMN     "storeName" TEXT,
ADD COLUMN     "taxId" TEXT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

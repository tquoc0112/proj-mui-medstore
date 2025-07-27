-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER', 'SALES');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "storeName" TEXT,
    "businessType" TEXT,
    "pharmacyLicense" TEXT,
    "licenseDocUrl" TEXT,
    "taxId" TEXT,
    "storeLogoUrl" TEXT,
    "businessAddress" TEXT,
    "ownerIdProofUrl" TEXT,
    "proofOfAddressUrl" TEXT,
    "medicalCertUrl" TEXT,
    "bankName" TEXT,
    "accountHolder" TEXT,
    "accountNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AlterTable
ALTER TABLE "account" ADD COLUMN     "issuer" TEXT,
ALTER COLUMN "providerId" DROP NOT NULL;

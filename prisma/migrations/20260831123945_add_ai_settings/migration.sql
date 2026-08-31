-- AlterTable
ALTER TABLE "user" ADD COLUMN     "aiEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiModel" TEXT NOT NULL DEFAULT 'gemini';

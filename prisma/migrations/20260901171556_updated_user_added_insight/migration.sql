-- CreateEnum
CREATE TYPE "InsightMode" AS ENUM ('RULE_BASED', 'AI');

-- CreateEnum
CREATE TYPE "InsightFeedback" AS ENUM ('HELPFUL', 'NOT_HELPFUL');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "insightFrequencyDays" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "lastInsightAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "WeeklyInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "mode" "InsightMode" NOT NULL,
    "noteCount" INTEGER NOT NULL,
    "summary" TEXT,
    "highlights" JSONB NOT NULL,
    "themes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experiments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "feedback" "InsightFeedback",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeeklyInsight_userId_periodStart_idx" ON "WeeklyInsight"("userId", "periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyInsight_userId_periodStart_key" ON "WeeklyInsight"("userId", "periodStart");

-- AddForeignKey
ALTER TABLE "WeeklyInsight" ADD CONSTRAINT "WeeklyInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

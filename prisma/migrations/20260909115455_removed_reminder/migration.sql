/*
  Warnings:

  - You are about to drop the column `reminderEnabled` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `reminderTime` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "reminderEnabled",
DROP COLUMN "reminderTime";

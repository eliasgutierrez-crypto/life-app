-- CreateEnum
CREATE TYPE "InterestType" AS ENUM ('SIMPLE', 'COMPOUND');

-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "annualRate" DECIMAL(5,2),
ADD COLUMN     "interestType" "InterestType" NOT NULL DEFAULT 'COMPOUND';

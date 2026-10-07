-- AlterTable
ALTER TABLE "event_kesehatan" ADD COLUMN     "closed_at" TIMESTAMP(3),
ADD COLUMN     "is_closed" BOOLEAN NOT NULL DEFAULT false;

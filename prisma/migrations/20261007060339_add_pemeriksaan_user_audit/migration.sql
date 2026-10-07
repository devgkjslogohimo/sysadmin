-- AlterTable
ALTER TABLE "pemeriksaan_kesehatan" ADD COLUMN     "created_by_user_id" INTEGER,
ADD COLUMN     "updated_by_user_id" INTEGER,
ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE INDEX "pemeriksaan_kesehatan_created_by_user_id_idx" ON "pemeriksaan_kesehatan"("created_by_user_id");

-- CreateIndex
CREATE INDEX "pemeriksaan_kesehatan_updated_by_user_id_idx" ON "pemeriksaan_kesehatan"("updated_by_user_id");

-- AddForeignKey
ALTER TABLE "pemeriksaan_kesehatan" ADD CONSTRAINT "pemeriksaan_kesehatan_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_kesehatan" ADD CONSTRAINT "pemeriksaan_kesehatan_updated_by_user_id_fkey" FOREIGN KEY ("updated_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_kesehatan" ADD CONSTRAINT "pemeriksaan_kesehatan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

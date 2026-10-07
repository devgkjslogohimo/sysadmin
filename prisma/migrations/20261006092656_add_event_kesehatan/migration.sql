-- CreateTable
CREATE TABLE "event_kesehatan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggal" DATE NOT NULL,
    "lokasi" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_kesehatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pemeriksaan_kesehatan" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "anggota_id" INTEGER NOT NULL,
    "tensi_sistolik" INTEGER,
    "tensi_diastolik" INTEGER,
    "gula_darah" INTEGER,
    "kolesterol" INTEGER,
    "asam_urat" DOUBLE PRECISION,
    "berat_badan" DOUBLE PRECISION,
    "tinggi_badan" DOUBLE PRECISION,
    "keluhan" TEXT,
    "petugas" TEXT NOT NULL,
    "hasil_ringkas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pemeriksaan_kesehatan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pemeriksaan_kesehatan_anggota_id_idx" ON "pemeriksaan_kesehatan"("anggota_id");

-- CreateIndex
CREATE INDEX "pemeriksaan_kesehatan_event_id_idx" ON "pemeriksaan_kesehatan"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "pemeriksaan_kesehatan_event_id_anggota_id_key" ON "pemeriksaan_kesehatan"("event_id", "anggota_id");

-- AddForeignKey
ALTER TABLE "pemeriksaan_kesehatan" ADD CONSTRAINT "pemeriksaan_kesehatan_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_kesehatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemeriksaan_kesehatan" ADD CONSTRAINT "pemeriksaan_kesehatan_anggota_id_fkey" FOREIGN KEY ("anggota_id") REFERENCES "anggota_keluarga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

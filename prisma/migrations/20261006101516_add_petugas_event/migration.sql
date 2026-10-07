-- CreateTable
CREATE TABLE "petugas_event" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "petugas_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "petugas_event_event_id_idx" ON "petugas_event"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "petugas_event_event_id_nama_key" ON "petugas_event"("event_id", "nama");

-- AddForeignKey
ALTER TABLE "petugas_event" ADD CONSTRAINT "petugas_event_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event_kesehatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

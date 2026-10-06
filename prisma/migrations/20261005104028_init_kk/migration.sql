-- CreateTable
CREATE TABLE "kartu_keluarga" (
    "id" SERIAL NOT NULL,
    "no_kk_hash" VARCHAR(64) NOT NULL,
    "no_kk_ciphertext" TEXT NOT NULL,
    "no_kk_iv" VARCHAR(64) NOT NULL,
    "no_kk_auth_tag" VARCHAR(64) NOT NULL,
    "kepala_keluarga" TEXT,
    "alamat" TEXT,
    "rt" VARCHAR(3),
    "rw" VARCHAR(3),
    "desa_kelurahan" TEXT,
    "kecamatan" TEXT,
    "kabupaten_kota" TEXT,
    "kode_pos" VARCHAR(5),
    "provinsi" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kartu_keluarga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggota_keluarga" (
    "id" SERIAL NOT NULL,
    "kk_id" INTEGER NOT NULL,
    "no_urut" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "nik_hash" VARCHAR(64) NOT NULL,
    "nik_ciphertext" TEXT NOT NULL,
    "nik_iv" VARCHAR(64) NOT NULL,
    "nik_auth_tag" VARCHAR(64) NOT NULL,
    "jenis_kelamin" TEXT,
    "tempat_lahir" TEXT,
    "tanggal_lahir" TEXT,
    "agama" TEXT,
    "pendidikan" TEXT,
    "pekerjaan" TEXT,
    "golongan_darah" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anggota_keluarga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kartu_keluarga_no_kk_hash_key" ON "kartu_keluarga"("no_kk_hash");

-- CreateIndex
CREATE INDEX "anggota_keluarga_kk_id_idx" ON "anggota_keluarga"("kk_id");

-- CreateIndex
CREATE INDEX "anggota_keluarga_nik_hash_idx" ON "anggota_keluarga"("nik_hash");

-- CreateIndex
CREATE UNIQUE INDEX "anggota_keluarga_kk_id_nik_hash_key" ON "anggota_keluarga"("kk_id", "nik_hash");

-- AddForeignKey
ALTER TABLE "anggota_keluarga" ADD CONSTRAINT "anggota_keluarga_kk_id_fkey" FOREIGN KEY ("kk_id") REFERENCES "kartu_keluarga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

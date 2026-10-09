import { Controller, useFieldArray } from 'react-hook-form'

import type { Control, UseFormReturn } from 'react-hook-form'

import { IdCard, Plus, Trash2, UserRound, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { ValidatedKK } from '@/lib/kk-parser/schema'

import { createEmptyMember } from './kk-form-defaults'

type Props = {
  form: UseFormReturn<ValidatedKK>
  disabled?: boolean
}

type RootTextFieldName =
  | 'noKK'
  | 'kepalaKeluarga'
  | 'alamat'
  | 'rt'
  | 'rw'
  | 'desaKelurahan'
  | 'kecamatan'
  | 'kabupatenKota'
  | 'kodePos'
  | 'provinsi'

type MemberTextFieldKey =
  | 'nama'
  | 'nik'
  | 'tempatLahir'
  | 'tanggalLahir'
  | 'agama'
  | 'pendidikan'
  | 'pekerjaan'
  | 'golonganDarah'
  | 'ayah'
  | 'ibu'
  | 'baptisAnak'
  | 'sidiBaptisDewasa'
  | 'menikah'
  | 'domisili'

type MemberTextFieldName = `anggota.${number}.${MemberTextFieldKey}`

type TextFieldName = RootTextFieldName | MemberTextFieldName

type GenderFieldName = `anggota.${number}.jenisKelamin`

export function KKFormFields({ form, disabled = false }: Props) {
  const anggota = useFieldArray({
    control: form.control,
    name: 'anggota',
  })

  function handleAddMember() {
    anggota.append(createEmptyMember(anggota.fields.length + 1))
  }

  function handleRemoveMember(index: number) {
    anggota.remove(index)
  }

  return (
    <div className="min-w-0 space-y-5">
      <KKSection control={form.control} disabled={disabled} />

      <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* HEADER ANGGOTA */}
        <div className="flex min-w-0 flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Users className="size-4" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">
                  Anggota Keluarga
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  {anggota.fields.length.toLocaleString('id-ID')} anggota
                  keluarga
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-9 shrink-0 rounded-lg border-slate-200 bg-white px-3 shadow-none"
            disabled={disabled}
            onClick={handleAddMember}
          >
            <Plus className="size-4" />
            Tambah Anggota
          </Button>
        </div>

        {/* LIST ANGGOTA */}
        <div className="space-y-3 bg-slate-50/40 p-3 sm:p-4">
          {anggota.fields.map((memberField, index) => (
            <MemberCard
              key={memberField.id}
              index={index}
              control={form.control}
              disabled={disabled}
              canRemove={anggota.fields.length > 1}
              onRemove={() => handleRemoveMember(index)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function KKSection({
  control,
  disabled,
}: {
  control: Control<ValidatedKK>
  disabled: boolean
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <IdCard className="size-4" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Informasi Kartu Keluarga
            </h3>

            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              Informasi utama dan alamat Kartu Keluarga.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <FieldGroup className="grid min-w-0 gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
          <TextField
            control={control}
            name="noKK"
            label="Nomor KK"
            nullable={false}
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
          />

          <TextField
            control={control}
            name="kepalaKeluarga"
            label="Nama Kepala Keluarga"
            nullable={false}
            disabled={disabled}
          />

          <TextField
            control={control}
            name="alamat"
            label="Alamat"
            disabled={disabled}
          />

          <TextField
            control={control}
            name="rt"
            label="RT"
            inputMode="numeric"
            disabled={disabled}
          />

          <TextField
            control={control}
            name="rw"
            label="RW"
            inputMode="numeric"
            disabled={disabled}
          />

          <TextField
            control={control}
            name="desaKelurahan"
            label="Desa / Kelurahan"
            disabled={disabled}
          />

          <TextField
            control={control}
            name="kecamatan"
            label="Kecamatan"
            disabled={disabled}
          />

          <TextField
            control={control}
            name="kabupatenKota"
            label="Kabupaten / Kota"
            disabled={disabled}
          />

          <TextField
            control={control}
            name="kodePos"
            label="Kode Pos"
            inputMode="numeric"
            disabled={disabled}
          />

          <TextField
            control={control}
            name="provinsi"
            label="Provinsi"
            disabled={disabled}
          />
        </FieldGroup>
      </div>
    </section>
  )
}

function MemberCard({
  index,
  control,
  disabled,
  canRemove,
  onRemove,
}: {
  index: number

  control: Control<ValidatedKK>

  disabled: boolean
  canRemove: boolean

  onRemove: () => void
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* HEADER MEMBER */}
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <UserRound className="size-4" />
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900">
              Anggota {index + 1}
            </div>

            <div className="truncate text-[11px] text-slate-400">
              Data anggota keluarga
            </div>
          </div>
        </div>

        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
            disabled={disabled}
            onClick={onRemove}
            aria-label={`Hapus anggota ${index + 1}`}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>

      {/* FIELDS */}
      <div className="p-4">
        <div className="grid min-w-0 gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
          <TextField
            control={control}
            name={`anggota.${index}.nama`}
            label="Nama Lengkap"
            nullable={false}
            disabled={disabled}
          />

          <TextField
            control={control}
            name={`anggota.${index}.nik`}
            label="NIK"
            nullable={false}
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
          />

          <GenderField
            control={control}
            name={`anggota.${index}.jenisKelamin`}
            disabled={disabled}
          />

          <TextField
            control={control}
            name={`anggota.${index}.tempatLahir`}
            label="Tempat Lahir"
            disabled={disabled}
          />

          <TextField
            control={control}
            name={`anggota.${index}.tanggalLahir`}
            label="Tanggal Lahir"
            placeholder="DD-MM-YYYY"
            disabled={disabled}
          />

          <TextField
            control={control}
            name={`anggota.${index}.agama`}
            label="Agama"
            disabled={disabled}
          />

          <TextField
            control={control}
            name={`anggota.${index}.pendidikan`}
            label="Pendidikan"
            disabled={disabled}
          />

          <TextField
            control={control}
            name={`anggota.${index}.pekerjaan`}
            label="Pekerjaan"
            disabled={disabled}
          />

          <TextField
            control={control}
            name={`anggota.${index}.golonganDarah`}
            label="Golongan Darah"
            disabled={disabled}
          />
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <div className="mb-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Keluarga & Data Gerejawi
            </div>
          </div>

          <div className="grid min-w-0 gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
            <TextField
              control={control}
              name={`anggota.${index}.ayah`}
              label="Ayah"
              disabled={disabled}
            />

            <TextField
              control={control}
              name={`anggota.${index}.ibu`}
              label="Ibu"
              disabled={disabled}
            />

            <TextField
              control={control}
              name={`anggota.${index}.domisili`}
              label="Domisili"
              disabled={disabled}
            />

            <TextField
              control={control}
              name={`anggota.${index}.baptisAnak`}
              label="Baptis Anak"
              disabled={disabled}
            />

            <TextField
              control={control}
              name={`anggota.${index}.sidiBaptisDewasa`}
              label="Sidi / Baptis Dewasa"
              disabled={disabled}
            />

            <TextField
              control={control}
              name={`anggota.${index}.menikah`}
              label="Menikah"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

type TextFieldProps = {
  control: Control<ValidatedKK>

  name: TextFieldName

  label: string

  placeholder?: string

  nullable?: boolean

  disabled?: boolean

  inputMode?:
    'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url' | 'search'

  autoComplete?: string
}

function TextField({
  control,
  name,
  label,
  placeholder,
  nullable = true,
  disabled = false,
  inputMode,
  autoComplete,
}: TextFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="min-w-0 gap-1.5" data-invalid={fieldState.invalid}>
          <FieldLabel
            htmlFor={field.name}
            className="text-sm font-medium text-slate-700"
          >
            {label}
          </FieldLabel>

          <Input
            id={field.name}
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            placeholder={placeholder}
            inputMode={inputMode}
            autoComplete={autoComplete}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            className="h-10 w-full min-w-0 rounded-lg border-slate-200 bg-white shadow-none"
            value={field.value == null ? '' : field.value}
            onChange={(event) => {
              const value = event.target.value

              field.onChange(nullable ? value || null : value)
            }}
          />

          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

function GenderField({
  control,
  name,
  disabled,
}: {
  control: Control<ValidatedKK>

  name: GenderFieldName

  disabled: boolean
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className="min-w-0 gap-1.5" data-invalid={fieldState.invalid}>
          <FieldLabel className="text-sm font-medium text-slate-700">
            Jenis Kelamin
          </FieldLabel>

          <Select
            value={field.value ?? ''}
            disabled={disabled}
            onValueChange={(value) => {
              if (value === 'LAKI-LAKI' || value === 'PEREMPUAN') {
                field.onChange(value)
              }
            }}
          >
            <SelectTrigger
              className="w-full min-w-0 rounded-lg border-slate-200 bg-white shadow-none data-[size=default]:h-10"
              aria-invalid={fieldState.invalid}
            >
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="LAKI-LAKI">LAKI-LAKI</SelectItem>

              <SelectItem value="PEREMPUAN">PEREMPUAN</SelectItem>
            </SelectContent>
          </Select>

          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

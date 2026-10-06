import { Controller, useFieldArray } from 'react-hook-form'
import type { Control, UseFormReturn } from 'react-hook-form'

import { Plus, Trash2, UserRound, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import { Input } from '@/components/ui/input'

import { Separator } from '@/components/ui/separator'

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
    <div className="min-w-0 space-y-7">
      <KKSection control={form.control} disabled={disabled} />

      <Separator />

      <section className="min-w-0 space-y-4">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Users className="size-4 shrink-0 text-muted-foreground" />

              <h3 className="font-semibold">Anggota Keluarga</h3>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {anggota.fields.length} anggota keluarga
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="shrink-0"
            disabled={disabled}
            onClick={handleAddMember}
          >
            <Plus className="size-4" />
            Tambah Anggota
          </Button>
        </div>

        <div className="min-w-0 space-y-4">
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
    <section className="min-w-0 space-y-4">
      <div>
        <h3 className="font-semibold">Informasi Kartu Keluarga</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Informasi utama dan alamat Kartu Keluarga.
        </p>
      </div>

      <FieldGroup className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    <div className="min-w-0 overflow-hidden rounded-xl border bg-slate-50/40 p-4 sm:p-5">
      <div className="mb-5 flex min-w-0 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background shadow-sm">
            <UserRound className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <div className="truncate font-semibold">Anggota {index + 1}</div>

            <div className="truncate text-xs text-muted-foreground">
              Data anggota keluarga
            </div>
          </div>
        </div>

        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            disabled={disabled}
            onClick={onRemove}
            aria-label={`Hapus anggota ${index + 1}`}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <Field className="min-w-0" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

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
            className="w-full min-w-0"
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
        <Field className="min-w-0" data-invalid={fieldState.invalid}>
          <FieldLabel>Jenis Kelamin</FieldLabel>

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
              className="w-full min-w-0"
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

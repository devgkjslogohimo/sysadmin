import { zodResolver } from '@hookform/resolvers/zod'
import {
  Activity,
  ClipboardCheck,
  FlaskConical,
  Ruler,
  UsersRound,
} from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'sonner'

import { FormField } from '@/components/kesehatan/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import {
  savePemeriksaanKesehatan,
  updatePemeriksaanKesehatan,
} from '@/server/kesehatan'

import { pemeriksaanKesehatanFieldsSchema } from '@/server/kesehatan/schemas'
import type { PemeriksaanKesehatanFormValues } from '@/server/kesehatan/schemas'

type PetugasEventItem = {
  id: number
  nama: string
}

type PemeriksaanAwal = Omit<
  PemeriksaanKesehatanFormValues,
  'keluhan' | 'hasilRingkas'
> & {
  id: number
  keluhan: string | null
  hasilRingkas: string | null
}

type Props = {
  eventId: number
  anggotaId: number

  petugas: PetugasEventItem[]

  initialValues?: PemeriksaanAwal

  onSaved: () => void | Promise<void>
  onCancel?: () => void
}

const emptyValues: PemeriksaanKesehatanFormValues = {
  tensiSistolik: null,
  tensiDiastolik: null,

  gulaDarah: null,
  kolesterol: null,
  asamUrat: null,

  beratBadan: null,
  tinggiBadan: null,

  keluhan: '',
  hasilRingkas: '',
}

function getFormValues(
  initialValues?: PemeriksaanAwal,
): PemeriksaanKesehatanFormValues {
  if (!initialValues) {
    return emptyValues
  }

  return {
    tensiSistolik: initialValues.tensiSistolik,
    tensiDiastolik: initialValues.tensiDiastolik,

    gulaDarah: initialValues.gulaDarah,
    kolesterol: initialValues.kolesterol,
    asamUrat: initialValues.asamUrat,

    beratBadan: initialValues.beratBadan,
    tinggiBadan: initialValues.tinggiBadan,

    keluhan: initialValues.keluhan ?? '',
    hasilRingkas: initialValues.hasilRingkas ?? '',
  }
}

const numberInputOptions = {
  setValueAs: (value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return null
    }

    const number = Number(value)

    return Number.isNaN(number) ? value : number
  },
}

export function PemeriksaanForm({
  eventId,
  anggotaId,
  petugas,
  initialValues,
  onSaved,
  onCancel,
}: Props) {
  const form = useForm<PemeriksaanKesehatanFormValues>({
    resolver: zodResolver(pemeriksaanKesehatanFieldsSchema),

    defaultValues: getFormValues(initialValues),
  })

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = form

  useEffect(() => {
    reset(getFormValues(initialValues))
  }, [initialValues, reset])

  async function onSubmit(values: PemeriksaanKesehatanFormValues) {
    try {
      if (initialValues) {
        await updatePemeriksaanKesehatan({
          data: {
            id: initialValues.id,

            ...values,
          },
        })

        toast.success('Hasil pemeriksaan berhasil diperbarui.')
      } else {
        await savePemeriksaanKesehatan({
          data: {
            eventId,
            anggotaId,

            ...values,
          },
        })

        toast.success('Hasil pemeriksaan berhasil disimpan.')
      }

      await onSaved()
    } catch (error) {
      toast.error('Gagal menyimpan pemeriksaan', {
        description:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan pada server.',
      })
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* TANDA VITAL */}
      <section>
        <SectionTitle
          icon={<Activity className="size-4" />}
          title="Tanda Vital"
        />

        <div className="mt-3">
          <FormField
            label="Tekanan Darah"
            error={
              errors.tensiSistolik?.message ?? errors.tensiDiastolik?.message
            }
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-center gap-2">
              <Input
                type="number"
                inputMode="numeric"
                placeholder="120"
                disabled={isSubmitting}
                className="h-10 rounded-lg border-slate-200 bg-white text-center shadow-none"
                {...register('tensiSistolik', numberInputOptions)}
              />

              <span className="text-sm text-slate-400">/</span>

              <Input
                type="number"
                inputMode="numeric"
                placeholder="80"
                disabled={isSubmitting}
                className="h-10 rounded-lg border-slate-200 bg-white text-center shadow-none"
                {...register('tensiDiastolik', numberInputOptions)}
              />

              <span className="whitespace-nowrap text-xs text-slate-400">
                mmHg
              </span>
            </div>
          </FormField>
        </div>
      </section>

      {/* PEMERIKSAAN */}
      <section className="border-t border-slate-100 pt-5">
        <SectionTitle
          icon={<FlaskConical className="size-4" />}
          title="Pemeriksaan"
        />

        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Gula Darah"
            suffix="mg/dL"
            disabled={isSubmitting}
            error={errors.gulaDarah?.message}
            registration={register('gulaDarah', numberInputOptions)}
          />

          <NumberField
            label="Kolesterol"
            suffix="mg/dL"
            disabled={isSubmitting}
            error={errors.kolesterol?.message}
            registration={register('kolesterol', numberInputOptions)}
          />

          <NumberField
            label="Asam Urat"
            suffix="mg/dL"
            step="0.1"
            disabled={isSubmitting}
            error={errors.asamUrat?.message}
            registration={register('asamUrat', numberInputOptions)}
          />
        </div>
      </section>

      {/* ANTROPOMETRI */}
      <section className="border-t border-slate-100 pt-5">
        <SectionTitle
          icon={<Ruler className="size-4" />}
          title="Berat & Tinggi Badan"
        />

        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Berat Badan"
            suffix="kg"
            step="0.1"
            disabled={isSubmitting}
            error={errors.beratBadan?.message}
            registration={register('beratBadan', numberInputOptions)}
          />

          <NumberField
            label="Tinggi Badan"
            suffix="cm"
            step="0.1"
            disabled={isSubmitting}
            error={errors.tinggiBadan?.message}
            registration={register('tinggiBadan', numberInputOptions)}
          />
        </div>
      </section>

      {/* CATATAN */}
      <section className="border-t border-slate-100 pt-5">
        <SectionTitle
          icon={<ClipboardCheck className="size-4" />}
          title="Catatan Pemeriksaan"
        />

        <div className="mt-3 grid gap-4 xl:grid-cols-2">
          <FormField label="Keluhan" error={errors.keluhan?.message}>
            <Textarea
              {...register('keluhan')}
              disabled={isSubmitting}
              placeholder="Keluhan warga..."
              className="min-h-24 resize-y rounded-lg border-slate-200 bg-white shadow-none"
            />
          </FormField>

          <FormField label="Hasil Ringkas" error={errors.hasilRingkas?.message}>
            <Textarea
              {...register('hasilRingkas')}
              disabled={isSubmitting}
              placeholder="Catatan atau hasil pemeriksaan..."
              className="min-h-24 resize-y rounded-lg border-slate-200 bg-white shadow-none"
            />
          </FormField>
        </div>
      </section>

      {/* PETUGAS */}
      <section className="border-t border-slate-100 pt-5">
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
            <UsersRound className="size-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-700">
              Petugas Event
            </div>

            {petugas.length > 0 ? (
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {petugas.map((item) => item.nama).join(', ')}
              </p>
            ) : (
              <p className="mt-1 text-xs leading-5 text-red-600">
                Belum ada petugas yang didaftarkan.
              </p>
            )}
          </div>

          {petugas.length > 0 && (
            <span className="shrink-0 rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
              {petugas.length}
            </span>
          )}
        </div>
      </section>

      {/* ACTION */}
      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-lg border-slate-200 bg-white sm:min-w-24"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Batal
          </Button>
        )}

        <Button
          type="submit"
          className="h-10 rounded-lg sm:min-w-44"
          disabled={isSubmitting || petugas.length === 0}
        >
          {isSubmitting
            ? 'Menyimpan...'
            : initialValues
              ? 'Simpan Perubahan'
              : 'Simpan Pemeriksaan'}
        </Button>
      </div>
    </form>
  )
}

type SectionTitleProps = {
  icon: React.ReactNode
  title: string
}

function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
      <span className="text-slate-400">{icon}</span>

      {title}
    </div>
  )
}

type NumberFieldProps = {
  label: string
  suffix: string
  step?: string
  disabled?: boolean
  error?: string

  registration: UseFormRegisterReturn
}

function NumberField({
  label,
  suffix,
  step,
  disabled,
  error,
  registration,
}: NumberFieldProps) {
  return (
    <FormField label={label} error={error}>
      <div className="flex h-10 overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <Input
          type="number"
          step={step}
          inputMode="decimal"
          disabled={disabled}
          {...registration}
          className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
        />

        <div className="flex shrink-0 items-center border-l border-slate-100 bg-slate-50 px-3 text-xs text-slate-500">
          {suffix}
        </div>
      </div>
    </FormField>
  )
}

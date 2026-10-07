import { zodResolver } from '@hookform/resolvers/zod'
import { IdCard, Loader2, Save, UsersRound } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { kkSchema } from '@/lib/kk-parser/schema'
import type { ValidatedKK } from '@/lib/kk-parser/schema'

import { saveKK } from '@/server/kk.functions'

import { createEmptyKK, normalizeKKFormValues } from '../form/kk-form-defaults'

import { KKFormFields } from '../form/kk-form-fields'

type Props = {
  open: boolean

  onOpenChange: (open: boolean) => void

  onCreated?: () => void | Promise<void>

  initialValues?: ValidatedKK | null
}

export function CreateKKDialog({
  open,
  onOpenChange,
  onCreated,
  initialValues,
}: Props) {
  const form = useForm<ValidatedKK>({
    resolver: zodResolver(kkSchema),

    defaultValues: createEmptyKK(),
  })

  const {
    reset,
    handleSubmit,

    formState: { isSubmitting },
  } = form

  useEffect(() => {
    if (!open) {
      return
    }

    reset(initialValues ?? createEmptyKK())
  }, [open, initialValues, reset])

  function resetForm() {
    reset(createEmptyKK())
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isSubmitting) {
      return
    }

    onOpenChange(nextOpen)
  }

  async function onSubmit(values: ValidatedKK) {
    const normalizedValues = normalizeKKFormValues(values)

    try {
      const response = await saveKK({
        data: normalizedValues,
      })

      toast.success('Data berhasil disimpan', {
        description: `${response.memberCount.toLocaleString(
          'id-ID',
        )} anggota keluarga berhasil disimpan.`,
      })

      resetForm()

      onOpenChange(false)

      await onCreated?.()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan pada server.'

      toast.error('Gagal menyimpan data', {
        description: message,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="
          flex
          max-h-[92dvh]
          w-[calc(100vw-1.5rem)]
          max-w-[calc(100vw-1.5rem)]
          flex-col
          gap-0
          overflow-hidden
          rounded-2xl
          border-slate-200
          bg-white
          p-0
          shadow-xl
          sm:w-[calc(100vw-3rem)]
          sm:max-w-5xl
        "
      >
        {/* HEADER */}
        <DialogHeader className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 pr-12 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <IdCard className="size-4" />
            </div>

            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold text-slate-900 sm:text-lg">
                Tambah Kartu Keluarga
              </DialogTitle>

              <DialogDescription className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Masukkan data Kartu Keluarga beserta anggota keluarga yang
                terdaftar di dalamnya.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* FORM AREA */}
        <form
          id="create-kk-form"
          onSubmit={handleSubmit(onSubmit)}
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/40"
        >
          <div className="p-4 sm:p-6">
            <KKFormFields form={form} disabled={isSubmitting} />
          </div>
        </form>

        {/* FOOTER */}
        <DialogFooter className="shrink-0 border-t border-slate-200 bg-white px-4 pt-4 pb-5 sm:px-6 sm:pt-4 sm:pb-6">
          <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg border-slate-200 bg-white px-5 shadow-none"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Batal
            </Button>

            <Button
              type="submit"
              form="create-kk-form"
              className="h-10 rounded-lg px-5 sm:min-w-40"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Simpan Data
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

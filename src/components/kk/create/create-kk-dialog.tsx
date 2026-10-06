import { zodResolver } from '@hookform/resolvers/zod'
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
import { useEffect } from 'react'

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

  function resetForm() {
    form.reset(createEmptyKK())
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && form.formState.isSubmitting) {
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
        description: `${response.memberCount} anggota keluarga berhasil disimpan.`,
      })

      resetForm()

      onOpenChange(false)

      await onCreated?.()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Terjadi kesalahan pada server.'

      toast.error('Gagal menyimpan data', {
        description: message,
      })
    }
  }

  useEffect(() => {
    if (!open) {
      return
    }

    form.reset(initialValues ?? createEmptyKK())
  }, [open, initialValues])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="
    flex
    max-h-[92vh]
    w-[calc(100vw-2rem)]
    max-w-[calc(100vw-2rem)]
    flex-col
    gap-0
    overflow-hidden
    p-0
    sm:max-w-5xl
  "
      >
        <DialogHeader className="shrink-0 border-b px-6 py-5">
          <DialogTitle>Tambah Kartu Keluarga</DialogTitle>

          <DialogDescription>
            Masukkan data Kartu Keluarga dan anggota keluarga.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-kk-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-6 py-5"
        >
          <KKFormFields form={form} disabled={form.formState.isSubmitting} />
        </form>

        <DialogFooter className="shrink-0 border-t bg-background px-6 py-4">
          <Button
            type="button"
            variant="outline"
            disabled={form.formState.isSubmitting}
            onClick={() => {
              onOpenChange(false)
            }}
          >
            Batal
          </Button>

          <Button
            type="submit"
            form="create-kk-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

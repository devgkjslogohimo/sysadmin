import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { updateEventKesehatan } from '@/server/kesehatan'
import { updateEventKesehatanSchema } from '@/server/kesehatan/schemas'
import type { UpdateEventKesehatanInput } from '@/server/kesehatan/schemas'
import { FormField } from './form-field'

type Props = {
  open: boolean

  onOpenChange: (open: boolean) => void

  event: {
    id: number
    nama: string
    tanggal: string
    lokasi: string | null
  }

  onSaved: () => void | Promise<void>
}

export function EditEventDialog({ open, onOpenChange, event, onSaved }: Props) {
  const form = useForm<UpdateEventKesehatanInput>({
    resolver: zodResolver(updateEventKesehatanSchema),

    defaultValues: {
      id: event.id,
      nama: event.nama,
      tanggal: event.tanggal,
      lokasi: event.lokasi ?? '',
    },
  })

  useEffect(() => {
    if (!open) {
      return
    }

    form.reset({
      id: event.id,
      nama: event.nama,
      tanggal: event.tanggal,
      lokasi: event.lokasi ?? '',
    })
  }, [open, event.id, event.nama, event.tanggal, event.lokasi, form])

  async function onSubmit(values: UpdateEventKesehatanInput) {
    try {
      await updateEventKesehatan({
        data: values,
      })

      toast.success('Event berhasil diperbarui.')

      onOpenChange(false)

      await onSaved()
    } catch (error) {
      toast.error('Gagal memperbarui event', {
        description:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan pada server.',
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (form.formState.isSubmitting) {
          return
        }

        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Event Kesehatan</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-5">
            <FormField
              label="Nama Event"
              error={form.formState.errors.nama?.message}
            >
              <Input
                {...form.register('nama')}
                disabled={form.formState.isSubmitting}
                placeholder="Nama event"
              />
            </FormField>

            <FormField
              label="Tanggal"
              error={form.formState.errors.tanggal?.message}
            >
              <Input
                type="date"
                {...form.register('tanggal')}
                disabled={form.formState.isSubmitting}
              />
            </FormField>

            <FormField
              label="Lokasi"
              error={form.formState.errors.lokasi?.message}
            >
              <Input
                {...form.register('lokasi')}
                disabled={form.formState.isSubmitting}
                placeholder="Lokasi kegiatan"
              />
            </FormField>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={form.formState.isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? 'Menyimpan...'
                : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

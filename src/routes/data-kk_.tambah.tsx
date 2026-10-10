import { createFileRoute } from '@tanstack/react-router'
import { KKPageForm } from '@/components/kk/form/kk-page-form'

export const Route = createFileRoute('/data-kk_/tambah')({
  component: TambahKKPage,
})

function TambahKKPage() {
  return <KKPageForm mode="create" />
}

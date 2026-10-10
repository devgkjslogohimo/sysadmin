import { createFileRoute } from '@tanstack/react-router'
import { KKPageForm } from '@/components/kk/form/kk-page-form'

export const Route = createFileRoute('/data-kk_/$id_/edit')({
  component: EditKKPage,
})

function EditKKPage() {
  const { id } = Route.useParams()

  return <KKPageForm key={id} mode="edit" id={Number(id)} />
}

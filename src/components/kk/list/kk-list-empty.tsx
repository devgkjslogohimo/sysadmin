import { Link } from '@tanstack/react-router'
import { FilePlus2, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function KKListEmpty() {
  return (
    <Card className="border-dashed shadow-none">
      <CardContent className="flex min-h-90 flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100">
          <Users className="size-6 text-slate-500" />
        </div>

        <h2 className="text-lg font-semibold">Belum ada data Kartu Keluarga</h2>

        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Parse dan simpan data Kartu Keluarga terlebih dahulu untuk
          menampilkannya pada halaman ini.
        </p>

        <Button className="mt-5" asChild>
          <Link to="/">
            <FilePlus2 className="size-4" />
            Tambah Data
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

import { Link } from '@tanstack/react-router'
import { Database, FileJson2, HeartPulse, Home, UsersRound } from 'lucide-react'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-blue-100 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Logo Gereja Kristen Jawa"
                className="h-16 w-16 shrink-0 object-contain"
              />

              <div>
                <div className="text-lg font-bold tracking-tight text-slate-900">
                  GKJ Slogohimo
                </div>

                <div className="mt-0.5 text-sm text-blue-600">
                  Sistem Data Jemaat
                </div>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              Sistem pengelolaan data jemaat untuk membantu pencatatan dan
              pelayanan jemaat GKJ Slogohimo.
            </p>
          </div>

          {/* Data */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Data Jemaat
            </h3>

            <nav className="mt-4 space-y-3">
              <FooterLink to="/data-kk">
                <Database className="size-4" />
                Data Kartu Keluarga
              </FooterLink>

              <FooterLink to="/data-anggota">
                <UsersRound className="size-4" />
                Data Anggota
              </FooterLink>
            </nav>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Menu</h3>

            <nav className="mt-4 space-y-3">
              <FooterLink to="/">
                <Home className="size-4" />
                Beranda
              </FooterLink>

              <FooterLink to="/event-kesehatan">
                <HeartPulse className="size-4" />
                Kesehatan
              </FooterLink>

              <FooterLink to="/fitur/parser-kk">
                <FileJson2 className="size-4" />
                Parser KK
              </FooterLink>
            </nav>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-blue-100 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} GKJ Slogohimo. Seluruh hak dilindungi.</p>

          <p>Sistem Data Jemaat GKJ Slogohimo</p>
        </div>
      </div>
    </footer>
  )
}

type FooterLinkProps = {
  to:
    '/' | '/data-kk' | '/data-anggota' | '/event-kesehatan' | '/fitur/parser-kk'

  children: React.ReactNode
}

function FooterLink({ to, children }: FooterLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-blue-600"
    >
      {children}
    </Link>
  )
}

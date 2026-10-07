import {
  Database,
  FileJson2,
  HeartPulse,
  Home,
  KeyRound,
  UsersRound,
} from 'lucide-react'
import { getRouteApi, Link } from '@tanstack/react-router'

import type { ReactNode } from 'react'

const rootRoute = getRouteApi('__root__')

export function SiteFooter() {
  const { user } = rootRoute.useRouteContext()

  const year = new Date().getFullYear()

  const homeTarget = user?.role === 'PETUGAS' ? '/event-kesehatan' : '/'

  return (
    <footer className="mt-auto border-t border-blue-100 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={
            user?.role === 'ADMIN'
              ? 'grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]'
              : user
                ? 'grid gap-8 md:grid-cols-[1.5fr_1fr]'
                : 'grid gap-8'
          }
        >
          {/* BRAND */}
          <div className="max-w-md">
            <Link to={homeTarget} className="inline-flex items-center gap-4">
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

          {/* ADMIN: DATA JEMAAT */}
          {user?.role === 'ADMIN' ? (
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
          ) : null}

          {/* MENU USER */}
          {user ? (
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Menu</h3>

              <nav className="mt-4 space-y-3">
                {user.role === 'ADMIN' ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <FooterLink to="/event-kesehatan">
                      <HeartPulse className="size-4" />
                      Kesehatan
                    </FooterLink>

                    <FooterLink to="/akun">
                      <KeyRound className="size-4" />
                      Ganti Password
                    </FooterLink>
                  </>
                )}
              </nav>
            </div>
          ) : null}
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
    | '/'
    | '/data-kk'
    | '/data-anggota'
    | '/event-kesehatan'
    | '/fitur/parser-kk'
    | '/akun'

  children: ReactNode
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

import {
  ChevronDown,
  Database,
  FileJson2,
  HeartPulse,
  Menu,
  UsersRound,
  X,
} from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'

import type { ReactNode } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SiteNavbar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const [mobileOpen, setMobileOpen] = useState(false)

  const dataActive =
    pathname.startsWith('/data-kk') || pathname.startsWith('/data-anggota')

  const kesehatanActive = pathname.startsWith('/event-kesehatan')

  const fiturActive = pathname.startsWith('/fitur/')

  function closeMobileMenu() {
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100/70 bg-white/85 shadow-[0_1px_12px_rgba(15,23,42,0.025)] backdrop-blur-xl supports-backdrop-filter:bg-white/80">
      <div className="relative mx-auto flex h-21.5 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* BRAND */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3"
          onClick={closeMobileMenu}
        >
          <div className="flex h-14 w-14 items-center justify-center">
            <img
              src="/logo.png"
              alt="Logo Gereja Kristen Jawa"
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
            />
          </div>

          <div className="hidden shrink-0 sm:block">
            <div className="whitespace-nowrap text-[17px] font-bold tracking-tight text-slate-900">
              GKJ Slogohimo
            </div>

            <div className="mt-0.5 whitespace-nowrap text-xs font-medium text-slate-400">
              Sistem Data Jemaat
            </div>
          </div>
        </Link>

        {/* MOBILE CENTER BRAND */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center sm:hidden">
          <div className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900">
            GKJ Slogohimo
          </div>

          <div className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-slate-400">
            Sistem Data Jemaat
          </div>
        </div>

        {/* DESKTOP MENU */}
        <nav className="ml-auto hidden items-center gap-1.5 lg:flex">
          <DesktopLink to="/" active={pathname === '/'}>
            Beranda
          </DesktopLink>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={navClass(dataActive)}>
                Data
                <ChevronDown className="size-3.5 opacity-60" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="center"
              sideOffset={10}
              className="w-64 rounded-xl border-blue-100/80 p-2 shadow-xl shadow-slate-900/5"
            >
              <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Database Jemaat
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="rounded-lg p-0">
                <Link
                  to="/data-kk"
                  className="flex w-full items-start gap-3 px-3 py-2.5"
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Database className="size-4" />
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      Data Kartu Keluarga
                    </div>

                    <div className="mt-0.5 text-xs text-slate-400">
                      Kelola database keluarga
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="mt-1 rounded-lg p-0">
                <Link
                  to="/data-anggota"
                  className="flex w-full items-start gap-3 px-3 py-2.5"
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <UsersRound className="size-4" />
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      Data Anggota
                    </div>

                    <div className="mt-0.5 text-xs text-slate-400">
                      Lihat seluruh anggota jemaat
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DesktopLink to="/event-kesehatan" active={kesehatanActive}>
            Kesehatan
          </DesktopLink>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={navClass(fiturActive)}>
                Fitur
                <ChevronDown className="size-3.5 opacity-60" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-64 rounded-xl border-blue-100/80 p-2 shadow-xl shadow-slate-900/5"
            >
              <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Fitur
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="rounded-lg p-0">
                <Link
                  to="/fitur/parser-kk"
                  className="flex w-full items-start gap-3 px-3 py-2.5"
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileJson2 className="size-4" />
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      Parser KK
                    </div>

                    <div className="mt-0.5 text-xs text-slate-400">
                      Konversi data KK menjadi terstruktur
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* MOBILE BUTTON */}
        <div className="ml-auto lg:hidden">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {mobileOpen && (
        <div className="border-t border-blue-100/70 bg-white/95 shadow-lg backdrop-blur-xl lg:hidden">
          <nav className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
            <div className="space-y-1">
              <MobileLink
                to="/"
                active={pathname === '/'}
                onClick={closeMobileMenu}
              >
                Beranda
              </MobileLink>

              <MobileSection title="Data Jemaat" />

              <MobileLink
                to="/data-kk"
                active={pathname.startsWith('/data-kk')}
                onClick={closeMobileMenu}
                icon={<Database className="size-4" />}
              >
                Data Kartu Keluarga
              </MobileLink>

              <MobileLink
                to="/data-anggota"
                active={pathname.startsWith('/data-anggota')}
                onClick={closeMobileMenu}
                icon={<UsersRound className="size-4" />}
              >
                Data Anggota
              </MobileLink>

              <MobileSection title="Pelayanan" />

              <MobileLink
                to="/event-kesehatan"
                active={kesehatanActive}
                onClick={closeMobileMenu}
                icon={<HeartPulse className="size-4" />}
              >
                Kesehatan
              </MobileLink>

              <MobileSection title="Fitur" />

              <MobileLink
                to="/fitur/parser-kk"
                active={fiturActive}
                onClick={closeMobileMenu}
                icon={<FileJson2 className="size-4" />}
              >
                Parser KK
              </MobileLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

type DesktopLinkProps = {
  to: '/' | '/event-kesehatan'

  active: boolean
  children: ReactNode
}

function DesktopLink({ to, active, children }: DesktopLinkProps) {
  return (
    <Link to={to} className={navClass(active)}>
      {children}
    </Link>
  )
}

function navClass(active: boolean) {
  return [
    'relative flex h-10 items-center gap-1.5 rounded-full px-4',
    'text-sm font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30',
    active
      ? 'bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.08)]'
      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600',
  ].join(' ')
}

type MobileLinkProps = {
  to:
    '/' | '/data-kk' | '/data-anggota' | '/event-kesehatan' | '/fitur/parser-kk'

  active: boolean

  onClick: () => void

  icon?: ReactNode

  children: ReactNode
}

function MobileLink({ to, active, onClick, icon, children }: MobileLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={
        active
          ? 'flex items-center gap-3 rounded-xl bg-blue-50 px-3.5 py-3 text-sm font-medium text-blue-700'
          : 'flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600'
      }
    >
      {icon && (
        <div
          className={
            active
              ? 'flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600'
              : 'flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500'
          }
        >
          {icon}
        </div>
      )}

      {children}
    </Link>
  )
}

function MobileSection({ title }: { title: string }) {
  return (
    <div className="px-3 pb-1 pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
      {title}
    </div>
  )
}

import {
  HeadContent,
  Scripts,
  createRootRoute,
  redirect,
} from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteNavbar } from '@/components/layout/site-navbar'
import { Toaster } from '@/components/ui/sonner'

import appCss from '../styles.css?url'
import { getCurrentUser } from '#/server/auth/actions.functions'

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUser()

    const isPublicRoute =
      location.pathname === '/login' || location.pathname === '/setup-admin'

    if (isPublicRoute) {
      return {
        user,
      }
    }

    if (!user) {
      throw redirect({
        to: '/login',
      })
    }

    if (user.role === 'PETUGAS') {
      const isHealthRoute =
        location.pathname === '/event-kesehatan' ||
        location.pathname.startsWith('/event-kesehatan/')

      const isAccountRoute = location.pathname === '/akun'

      if (!isHealthRoute && !isAccountRoute) {
        throw redirect({
          to: '/event-kesehatan',
        })
      }
    }

    return {
      user,
    }
  },

  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title: 'Sistem Data Jemaat | GKJ Slogohimo',
      },
      {
        name: 'description',
        content:
          'Sistem pengelolaan data jemaat GKJ Slogohimo untuk data keluarga, anggota, dan pelayanan kesehatan.',
      },
      {
        name: 'application-name',
        content: 'GKJ Slogohimo',
      },
      {
        name: 'theme-color',
        content: '#2563eb',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'GKJ Slogohimo',
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes',
      },
      {
        property: 'og:title',
        content: 'Sistem Data Jemaat | GKJ Slogohimo',
      },
      {
        property: 'og:description',
        content:
          'Sistem pengelolaan data jemaat GKJ Slogohimo untuk data keluarga, anggota, dan pelayanan kesehatan.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: 'GKJ Slogohimo',
      },
      {
        property: 'og:image',
        content: '/icons/pwa-512x512.png',
      },
    ],

    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'manifest',
        href: '/manifest.webmanifest',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/icons/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/icons/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: '/icons/favicon-48x48.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/icons/apple-touch-icon.png',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>

      <body>
        <div className="flex min-h-dvh flex-col bg-blue-50/30">
          <SiteNavbar />

          <div className="flex-1">{children}</div>

          <SiteFooter />
        </div>

        <Toaster richColors position="top-right" />

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />

        <Scripts />
      </body>
    </html>
  )
}

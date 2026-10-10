import { createFileRoute } from '@tanstack/react-router'

import { HomeHero } from '@/components/home/home-hero'
import { HomeLatestEvent } from '@/components/home/home-latest-event'
import { HomeMenu } from '@/components/home/home-menu'
import { HomeStats } from '@/components/home/home-stats'
import { HomeWorkflow } from '@/components/home/home-workflow'

import { getHomeStats } from '#/server/home/get-home-stats'

export const Route = createFileRoute('/')({
  loader: () => getHomeStats(),
  component: HomePage,
})

function HomePage() {
  const stats = Route.useLoaderData()

  return (
    <main className="bg-slate-50/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <HomeHero />

        <HomeStats stats={stats} />

        <HomeLatestEvent event={stats.latestEvent} />

        <HomeMenu />

        <HomeWorkflow />
      </div>
    </main>
  )
}

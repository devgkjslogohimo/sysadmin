import { createMiddleware } from '@tanstack/react-start'

import { getCurrentSession } from './session.server'

export const authMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  const session = await getCurrentSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  return next({
    context: {
      session,
    },
  })
})

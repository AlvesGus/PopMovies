'use client'

import { SessionProvider } from 'next-auth/react'

export default function SessionProviders({
  children,
  session
}: {
  children: React.ReactNode
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  session: any
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}

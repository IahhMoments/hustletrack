import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="p-8">
      <h1 className="text-2xl font-medium">Welcome to HustleTrack</h1>
      <p className="text-muted-foreground mt-2">Signed in as {user.email}</p>
      <p className="text-sm text-muted-foreground mt-6">
        Real dashboard coming in Week 3.
      </p>
    </main>
  )
}
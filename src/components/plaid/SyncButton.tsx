'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function SyncButton({ accountId }: { accountId: string }) {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)

  const sync = async () => {
    setSyncing(true)
    await fetch('/api/plaid/sync-transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bank_account_id: accountId }),
    })
    setSyncing(false)
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={sync} disabled={syncing}>
      {syncing ? 'Syncing...' : 'Sync'}
    </Button>
  )
}
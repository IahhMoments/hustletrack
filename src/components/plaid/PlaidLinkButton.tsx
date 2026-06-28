'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePlaidLink, PlaidLinkOnSuccess } from 'react-plaid-link'
import { Button } from '@/components/ui/button'

export function PlaidLinkButton() {
  const router = useRouter()
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [linking, setLinking] = useState(false)

  const generateToken = async () => {
    setLoading(true)
    const res = await fetch('/api/plaid/create-link-token', { method: 'POST' })
    const { link_token } = await res.json()
    setLinkToken(link_token)
    setLoading(false)
  }

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken, metadata) => {
      setLinking(true)
      await fetch('/api/plaid/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_token: publicToken,
          institution: metadata.institution,
        }),
      })
      setLinking(false)
      router.refresh()
    },
    [router]
  )

  const { open, ready } = usePlaidLink({ token: linkToken ?? '', onSuccess })

  if (linkToken && ready) {
    return (
      <Button onClick={() => open()} disabled={linking}>
        {linking ? 'Linking...' : 'Connect your bank'}
      </Button>
    )
  }

  return (
    <Button onClick={generateToken} disabled={loading} variant="outline">
      {loading ? 'Loading...' : 'Connect your bank'}
    </Button>
  )
}
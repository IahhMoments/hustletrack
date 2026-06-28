import { createClient } from '@/lib/supabase/server'
import { plaidClient } from '@/lib/plaid/client'
import { NextResponse } from 'next/server'
import { CountryCode, Products } from 'plaid'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: 'HustleTrack',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    })
    return NextResponse.json({ link_token: response.data.link_token })
  } catch (err) {
    console.error('create-link-token error:', err)
    return NextResponse.json({ error: 'Failed to create link token' }, { status: 500 })
  }
}
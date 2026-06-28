import { createClient } from '@/lib/supabase/server'
import { plaidClient } from '@/lib/plaid/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { public_token, institution } = await request.json()

  try {
    const exchangeRes = await plaidClient.itemPublicTokenExchange({ public_token })
    const accessToken = exchangeRes.data.access_token
    const itemId = exchangeRes.data.item_id

    const accountsRes = await plaidClient.accountsGet({ access_token: accessToken })
    const accounts = accountsRes.data.accounts

    const { error } = await supabase.from('bank_accounts').upsert(
      accounts.map((acct) => ({
        user_id: user.id,
        plaid_account_id: acct.account_id,
        plaid_item_id: itemId,
        plaid_access_token: accessToken,
        institution_name: institution?.name ?? 'Unknown',
        account_name: acct.name,
        account_type: acct.type,
        current_balance: acct.balances.current,
        available_balance: acct.balances.available,
        last_synced_at: new Date().toISOString(),
      })),
      { onConflict: 'plaid_account_id' }
    )

    if (error) {
      console.error('Supabase upsert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, accounts_linked: accounts.length })
  } catch (err: any) {
    console.error('Exchange token error:', err?.response?.data ?? err.message ?? err)
    return NextResponse.json({ error: 'Exchange failed' }, { status: 500 })
  }
}
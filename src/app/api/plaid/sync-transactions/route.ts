import { createClient } from '@/lib/supabase/server'
import { plaidClient } from '@/lib/plaid/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bank_account_id } = await request.json()

  const { data: acct } = await supabase
    .from('bank_accounts')
    .select('plaid_access_token, plaid_account_id')
    .eq('id', bank_account_id)
    .eq('user_id', user.id)
    .single()

  if (!acct) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const start = new Date()
  start.setDate(start.getDate() - 30)

  const { data: plaidData } = await plaidClient.transactionsGet({
    access_token: acct.plaid_access_token,
    start_date: start.toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    options: { account_ids: [acct.plaid_account_id], count: 500 },
  })

  const txns = plaidData.transactions

  if (txns.length > 0) {
    await supabase.from('transactions').upsert(
      txns.map((t) => ({
        user_id: user.id,
        bank_account_id,
        plaid_transaction_id: t.transaction_id,
        amount: t.amount,
        description: t.name,
        merchant_name: t.merchant_name,
        category:
          t.personal_finance_category?.primary ?? t.category?.[0] ?? 'Uncategorized',
        subcategory:
          t.personal_finance_category?.detailed ?? t.category?.[1],
        transaction_date: t.date,
      })),
      { onConflict: 'plaid_transaction_id' }
    )
  }

  await supabase
    .from('bank_accounts')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('id', bank_account_id)

  return NextResponse.json({ success: true, synced: txns.length })
}
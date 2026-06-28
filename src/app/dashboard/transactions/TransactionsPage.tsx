import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })
    .limit(50)

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-medium mb-6">Transactions</h1>

      {transactions && transactions.length > 0 ? (
        <div className="divide-y">
          {transactions.map((txn) => (
            <div key={txn.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-sm">
                  {txn.merchant_name ?? txn.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {txn.category} · {txn.transaction_date}
                </p>
              </div>
              <p className={
                txn.amount > 0
                  ? 'text-sm font-medium text-red-500'
                  : 'text-sm font-medium text-green-600'
              }>
                {txn.amount > 0 ? '-$' : '+$'}
                {Math.abs(Number(txn.amount)).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-16">
          No transactions yet — connect a bank and click Sync.
        </p>
      )}
    </main>
  )
}
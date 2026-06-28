import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CategoryFilter } from './CategoryFilter'
import type { Transaction } from './columns'

export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('transactions')
    .select('id, description, merchant_name, category, transaction_date, amount, is_hustle_income')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })
    .limit(500)

  const transactions = (data ?? []) as Transaction[]

  const income = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const expenses = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {transactions.length} transactions · last 30 days
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Income</p>
          <p className="text-xl font-semibold text-green-600 mt-1 tabular-nums">{fmt(income)}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Expenses</p>
          <p className="text-xl font-semibold text-red-500 mt-1 tabular-nums">{fmt(expenses)}</p>
        </div>
        <div className="rounded-lg border p-4 hidden sm:block">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Net</p>
          <p className={'text-xl font-semibold mt-1 tabular-nums ' + (income - expenses >= 0 ? 'text-green-600' : 'text-red-500')}>
            {fmt(Math.abs(income - expenses))}
          </p>
        </div>
      </div>

      <CategoryFilter transactions={transactions} />
    </div>
  )
}
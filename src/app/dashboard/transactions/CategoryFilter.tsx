'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { DataTable } from '@/components/data-table/Data-table'
import { columns, Transaction } from './columns'

export function CategoryFilter({ transactions }: { transactions: Transaction[] }) {
  const [active, setActive] = useState('All')

  const categories = ['All', ...Array.from(
    new Set(transactions.map((t) => t.category ?? 'Uncategorized'))
  ).sort()]

  const count = (cat: string) =>
    cat === 'All'
      ? transactions.length
      : transactions.filter((t) => (t.category ?? 'Uncategorized') === cat).length

  const filtered =
    active === 'All'
      ? transactions
      : transactions.filter((t) => (t.category ?? 'Uncategorized') === active)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 12).map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              active === cat
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground'
            )}
          >
            {cat.replace(/_/g, ' ')}
            <span className="opacity-60 tabular-nums">{count(cat)}</span>
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchKey="merchant_name"
        searchPlaceholder="Search by merchant..."
        defaultSortKey="transaction_date"
      />
    </div>
  )
}
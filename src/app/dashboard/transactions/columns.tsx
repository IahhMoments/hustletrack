'use client'

import { ColumnDef, Column } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

export type Transaction = {
  id: string
  description: string
  merchant_name: string | null
  category: string | null
  transaction_date: string
  amount: number
  is_hustle_income: boolean
}

function SortHeader({ label, column }: { label: string; column: Column<Transaction, unknown> }) {
  return (
    <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {label} <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
    </Button>
  )
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'transaction_date',
    header: ({ column }) => <SortHeader label="Date" column={column} />,
    cell: ({ row }) => {
      const d = new Date(row.getValue<string>('transaction_date') + 'T12:00:00')
      return (
        <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
          {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      )
    },
  },
  {
    accessorKey: 'merchant_name',
    header: 'Merchant',
    cell: ({ row }) => {
      const merchant = row.getValue<string | null>('merchant_name')
      const desc = row.original.description
      return (
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{merchant ?? desc}</p>
          {merchant && desc !== merchant && (
            <p className="text-xs text-muted-foreground truncate max-w-[220px]">{desc}</p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const raw = row.getValue<string | null>('category') ?? 'Uncategorized'
      const label = raw.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
      return <Badge variant="secondary" className="text-xs font-normal whitespace-nowrap">{label}</Badge>
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <SortHeader label="Amount" column={column} />,
    cell: ({ row }) => {
      const amt = Number(row.getValue<number>('amount'))
      const cls = amt > 0 ? 'text-red-500' : 'text-green-600'
      return (
        <span className={'text-sm font-medium tabular-nums ' + cls}>
          {amt > 0 ? '-$' : '+$'}{Math.abs(amt).toFixed(2)}
        </span>
      )
    },
  },
]
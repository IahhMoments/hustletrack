'use client'

import {
  ColumnDef, ColumnFiltersState, SortingState,
  flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  defaultSortKey?: string
}

export function DataTable<TData, TValue>({
  columns, data, searchKey, searchPlaceholder = 'Search...', defaultSortKey,
}: Props<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(
    defaultSortKey ? [{ id: defaultSortKey, desc: true }] : []
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data, columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  })

  return (
    <div className="space-y-3">
      {searchKey && (
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
          onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
          className="h-9 max-w-xs"
        />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{table.getFilteredRowModel().rows.length} row{table.getFilteredRowModel().rows.length !== 1 ? 's' : ''}</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</Button>
          <span className="tabular-nums">{table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}</span>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
        </div>
      </div>
    </div>
  )
}
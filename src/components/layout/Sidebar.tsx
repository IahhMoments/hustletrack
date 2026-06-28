'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NAV } from '@/config/navigation'
export function Sidebar() {
  const path = usePathname()

  return (
    <aside className="hidden md:flex w-56 border-r bg-background flex-col h-full shrink-0">
      <div className="p-5 border-b">
        <p className="font-semibold text-base">HustleTrack</p>
        <p className="text-xs text-muted-foreground mt-0.5">AI Finance Advisor</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
              path === item.href
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <i className={'ti ' + item.icon + ' text-base'} aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
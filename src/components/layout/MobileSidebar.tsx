'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NAV } from '@/config/navigation'

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const path = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <i className="ti ti-menu-2 text-xl" aria-hidden="true" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-56 p-0">
        <div className="p-5 border-b">
          <p className="font-semibold">HustleTrack</p>
          <p className="text-xs text-muted-foreground mt-0.5">AI Finance Advisor</p>
        </div>
        <nav className="p-3 space-y-0.5">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                path === item.href
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}>
              <i className={'ti ' + item.icon + ' text-base'} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
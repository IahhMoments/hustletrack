import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PlaidLinkButton } from '@/components/plaid/PlaidLinkButton'
import { SyncButton } from '@/components/plaid/SyncButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: accounts } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium">HustleTrack</h1>
        <PlaidLinkButton />
      </div>

      {accounts && accounts.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Connected accounts
          </p>
          {accounts.map((acct) => (
            <div key={acct.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">{acct.account_name}</p>
                <p className="text-xs text-muted-foreground">{acct.institution_name}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-medium text-sm">
                  {acct.current_balance != null
                    ? '$' + Number(acct.current_balance).toLocaleString()
                    : '—'}
                </p>
                <SyncButton accountId={acct.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="font-medium">No accounts connected yet</p>
          <p className="text-sm mt-2">Click Connect your bank above to get started.</p>
        </div>
      )}
    </main>
  )
}
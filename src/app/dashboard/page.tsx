import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/StatCard'
import { CommentCard } from '@/components/CommentCard'
import { AlertTriangle, MessageSquare, Shield } from 'lucide-react'
import { redirect } from 'next/navigation'
import { ConnectFacebookButton } from '@/components/ConnectFacebookButton'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch stats (mocked for now or simple count)
    const { count: totalComments } = await supabase.from('comments').select('*', { count: 'exact', head: true })
    const { count: toxicComments } = await supabase.from('toxicity_scores').select('*', { count: 'exact', head: true }).gt('score', 0.7)

    // Fetch connected accounts
    const { data: socialAccounts } = await supabase.from('social_accounts').select('*')
    const hasConnectedAccounts = socialAccounts && socialAccounts.length > 0
    const metaAppId = process.env.META_APP_ID as string

    // Fetch recent comments
    const { data: comments } = await supabase
        .from('comments')
        .select(`
      *,
      toxicity_scores (
        score,
        label
      )
    `)
        .order('created_at', { ascending: false })
        .limit(20)

    // Transform data to match CommentCard interface
    const formattedComments = comments?.map(c => ({
        ...c,
        toxicity_score: c.toxicity_scores?.[0] // Assuming one score per comment for simplicity
    })) || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                {!hasConnectedAccounts && metaAppId && (
                    <ConnectFacebookButton appId={metaAppId} />
                )}
                {hasConnectedAccounts && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Monitoring {socialAccounts.length} Page(s)
                    </div>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Total Comments"
                    value={totalComments || 0}
                    icon={MessageSquare}
                />
                <StatCard
                    title="Toxic Comments"
                    value={toxicComments || 0}
                    description="Detected with >70% confidence"
                    icon={AlertTriangle}
                />
                <StatCard
                    title="Protected Posts"
                    value={0} // Placeholder
                    icon={Shield}
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Recent Comments</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {formattedComments.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} />
                    ))}
                    {formattedComments.length === 0 && (
                        <div className="col-span-full text-center text-muted-foreground py-10">
                            No comments found. Connect your accounts and wait for ingestion.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/StatCard'
import { CommentCard } from '@/components/CommentCard'
import { AlertTriangle, MessageSquare, Shield } from 'lucide-react'
import { redirect } from 'next/navigation'
import { ConnectFacebookButton } from '@/components/ConnectFacebookButton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BlurFade } from '@/components/ui/blur-fade'

const PAGE_SIZE = 12

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const params = await searchParams
    const currentPage = Math.max(1, parseInt(params.page || '1', 10))
    const from = (currentPage - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    // Fetch user profile for threshold
    const { data: profile } = await supabase
        .from('profiles')
        .select('threshold')
        .eq('id', user.id)
        .single()

    const threshold = profile?.threshold ?? 0.7

    // Fetch stats
    const { count: totalComments } = await supabase.from('comments').select('*', { count: 'exact', head: true })
    const { count: toxicComments } = await supabase.from('toxicity_scores').select('*', { count: 'exact', head: true }).gt('score', threshold)

    // Fetch connected accounts
    const { data: socialAccounts } = await supabase.from('social_accounts').select('*')
    const hasConnectedAccounts = socialAccounts && socialAccounts.length > 0
    const metaAppId = process.env.META_APP_ID as string

    // Fetch recent comments with pagination
    const { data: comments, count: commentCount } = await supabase
        .from('comments')
        .select(`
      *,
      posts (
        content
      ),
      toxicity_scores (
        score,
        label
      )
    `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    const totalPages = Math.ceil((commentCount || 0) / PAGE_SIZE)

    // Transform data to match CommentCard interface
    const formattedComments = comments?.map(c => ({
        ...c,
        toxicity_score: c.toxicity_scores?.[0]
    })) || []

    return (
        <div className="space-y-10 py-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Operational Dashboard
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Real-time monitoring and protection status.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {!hasConnectedAccounts && metaAppId && (
                        <ConnectFacebookButton appId={metaAppId} />
                    )}
                    {hasConnectedAccounts && (
                        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm font-bold uppercase tracking-wider">Active Monitoring: {socialAccounts.length} Page(s)</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <BlurFade delay={0.1}>
                    <StatCard
                        title="Total Ingested"
                        value={totalComments || 0}
                        icon={MessageSquare}
                        description="Total comments processed"
                    />
                </BlurFade>
                <BlurFade delay={0.2}>
                    <StatCard
                        title="Threats Neutralized"
                        value={toxicComments || 0}
                        description={`Detected with >${((profile?.threshold ?? 0.7) * 100).toFixed(0)}% confidence`}
                        icon={AlertTriangle}
                        showBeam
                    />
                </BlurFade>
                <BlurFade delay={0.3}>
                    <StatCard
                        title="Community Health"
                        value={totalComments ? `${(((totalComments - (toxicComments || 0)) / totalComments) * 100).toFixed(1)}%` : "100%"}
                        description="Safe comment ratio"
                        icon={Shield}
                    />
                </BlurFade>
            </div>

            <div className="space-y-6 pt-4">
                <BlurFade delay={0.4}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold tracking-tight">Recent Activity Stream</h3>
                        <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border">
                            {commentCount || 0} total comments
                        </div>
                    </div>
                </BlurFade>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {formattedComments.map((comment, i) => (
                        <BlurFade key={comment.id} delay={0.4 + i * 0.05}>
                            <CommentCard comment={comment} />
                        </BlurFade>
                    ))}
                    {formattedComments.length === 0 && (
                        <BlurFade delay={0.5} className="col-span-full border-2 border-dashed rounded-3xl py-24 flex flex-col items-center justify-center text-center space-y-4 bg-muted/5">
                            <div className="p-4 bg-muted rounded-full">
                                <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-semibold">No activity detected yet</p>
                                <p className="text-muted-foreground max-w-sm">
                                    Connect your Facebook/Instagram accounts and wait for comments to arrive.
                                    New comments will appear here instantly.
                                </p>
                            </div>
                        </BlurFade>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                        {currentPage > 1 ? (
                            <Link href={`/dashboard?page=${currentPage - 1}`}>
                                <Button variant="outline" size="sm">← Previous</Button>
                            </Link>
                        ) : (
                            <Button variant="outline" size="sm" disabled>← Previous</Button>
                        )}
                        <span className="text-sm text-muted-foreground px-4">
                            Page {currentPage} of {totalPages}
                        </span>
                        {currentPage < totalPages ? (
                            <Link href={`/dashboard?page=${currentPage + 1}`}>
                                <Button variant="outline" size="sm">Next →</Button>
                            </Link>
                        ) : (
                            <Button variant="outline" size="sm" disabled>Next →</Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

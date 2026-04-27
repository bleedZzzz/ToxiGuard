import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldAlert, CheckCircle } from "lucide-react"
import { ReportActions } from "@/components/ReportActions"
import Link from "next/link"

const PAGE_SIZE = 15

export default async function ReportsPage({
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

    // Fetch reports with pagination
    const { data: reports, count } = await supabase
        .from('reports')
        .select(`
      *,
      comments (
        content,
        commenter_name,
        toxicity_scores (
            score,
            label
        )
      )
    `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

    return (
        <div className="space-y-8 py-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">Vigilance Reports</h2>
                    <p className="text-muted-foreground">
                        Manage flagged comments and maintain community standards.
                    </p>
                </div>
                {count !== null && count > 0 && (
                    <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border">
                        {count} total report{count !== 1 ? 's' : ''}
                    </div>
                )}
            </div>

            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[150px]">Date</TableHead>
                            <TableHead>Commenter</TableHead>
                            <TableHead className="max-w-[300px]">Content</TableHead>
                            <TableHead>Toxicity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports?.map((report) => {
                            const score = report.comments?.toxicity_scores?.[0]?.score || 0
                            const isToxic = score > 0.7

                            return (
                                <TableRow key={report.id} className="group transition-colors h-16">
                                    <TableCell className="font-medium text-muted-foreground">
                                        {new Date(report.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {report.comments?.commenter_name}
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate italic text-foreground/80">
                                        &quot;{report.comments?.content}&quot;
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={isToxic ? "destructive" : "secondary"} className="h-6">
                                            {(score * 100).toFixed(0)}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {report.status === 'pending' ? (
                                                <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ring-amber-500/20">
                                                    <ShieldAlert className="h-3 w-3" />
                                                    Pending
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ring-emerald-500/20">
                                                    <CheckCircle className="h-3 w-3" />
                                                    {report.status === 'dismissed' ? 'Dismissed' : 'Resolved'}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ReportActions reportId={report.id} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {(!reports || reports.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                    No reports found. Your community is currently safe.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    {currentPage > 1 ? (
                        <Link href={`/reports?page=${currentPage - 1}`}>
                            <Button variant="outline" size="sm">← Previous</Button>
                        </Link>
                    ) : (
                        <Button variant="outline" size="sm" disabled>← Previous</Button>
                    )}
                    <span className="text-sm text-muted-foreground px-4">
                        Page {currentPage} of {totalPages}
                    </span>
                    {currentPage < totalPages ? (
                        <Link href={`/reports?page=${currentPage + 1}`}>
                            <Button variant="outline" size="sm">Next →</Button>
                        </Link>
                    ) : (
                        <Button variant="outline" size="sm" disabled>Next →</Button>
                    )}
                </div>
            )}
        </div>
    )
}

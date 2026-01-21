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
import { CheckCircle, Trash2, ShieldAlert } from "lucide-react"

export default async function ReportsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch reports
    const { data: reports } = await supabase
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
    `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8 py-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">Vigilance Reports</h2>
                    <p className="text-muted-foreground">
                        Manage flagged comments and maintain community standards.
                    </p>
                </div>
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
                                        "{report.comments?.content}"
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
                                                    Resolved
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" className="h-8 gap-1 hidden group-hover:flex">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                Dismiss
                                            </Button>
                                            <Button variant="destructive" size="sm" className="h-8 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </Button>
                                        </div>
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
        </div>
    )
}

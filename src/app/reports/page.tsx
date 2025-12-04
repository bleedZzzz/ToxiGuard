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
        commenter_name
      )
    `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Reports</h3>
                <p className="text-sm text-muted-foreground">
                    User submitted reports for toxic comments.
                </p>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Commenter</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports?.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>{report.comments?.commenter_name}</TableCell>
                                <TableCell>{report.reason}</TableCell>
                                <TableCell>{report.status}</TableCell>
                            </TableRow>
                        ))}
                        {(!reports || reports.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">No reports found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

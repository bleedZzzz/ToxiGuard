'use client'

import { Button } from "@/components/ui/button"
import { CheckCircle, Trash2 } from "lucide-react"
import { updateReportStatus, deleteReport } from "@/app/actions/reports"
import { toast } from "sonner"
import { useState } from "react"

export function ReportActions({ reportId }: { reportId: string }) {
    const [loading, setLoading] = useState(false)

    const handleDismiss = async () => {
        setLoading(true)
        try {
            const result = await updateReportStatus(reportId, 'resolved')
            if (result.success) {
                toast.success('Report dismissed successfully')
            } else {
                toast.error(result.error || 'Failed to dismiss report')
            }
        } catch {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            const result = await deleteReport(reportId)
            if (result.success) {
                toast.success('Report deleted')
            } else {
                toast.error(result.error || 'Failed to delete report')
            }
        } catch {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 hidden group-hover:flex"
                onClick={handleDismiss}
                disabled={loading}
            >
                <CheckCircle className="h-3.5 w-3.5" />
                Dismiss
            </Button>
            <Button
                variant="destructive"
                size="sm"
                className="h-8 gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleDelete}
                disabled={loading}
            >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
            </Button>
        </div>
    )
}

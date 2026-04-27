'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ReportsError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
            <div className="p-4 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold">Failed to load reports</h2>
                <p className="text-muted-foreground">
                    We couldn&apos;t fetch your reports. Please try again.
                </p>
            </div>
            <Button onClick={reset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
            </Button>
        </div>
    )
}

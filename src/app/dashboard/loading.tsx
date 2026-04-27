import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
    return (
        <div className="space-y-10 py-4 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-80" />
                    <Skeleton className="h-5 w-60" />
                </div>
                <Skeleton className="h-10 w-48 rounded-2xl" />
            </div>

            {/* Stat Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border bg-card p-6 space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                ))}
            </div>

            {/* Comment Cards */}
            <div className="space-y-6 pt-4">
                <div className="flex justify-between">
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-7 w-32 rounded-full" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded-xl border bg-card p-5 space-y-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-6 w-32 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

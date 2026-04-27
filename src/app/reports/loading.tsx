import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsLoading() {
    return (
        <div className="space-y-8 py-4 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-56" />
                    <Skeleton className="h-5 w-72" />
                </div>
                <Skeleton className="h-7 w-28 rounded-full" />
            </div>

            <div className="rounded-2xl border bg-card overflow-hidden">
                {/* Table Header */}
                <div className="bg-muted/50 px-4 py-3 flex gap-4">
                    {[120, 100, 250, 70, 80, 120].map((w, i) => (
                        <Skeleton key={i} className="h-4" style={{ width: w }} />
                    ))}
                </div>
                {/* Table Rows */}
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="px-4 py-4 border-t flex items-center gap-4">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-6 w-[50px] rounded-full" />
                        <Skeleton className="h-5 w-[70px] rounded-full" />
                        <Skeleton className="h-8 w-[100px] ml-auto" />
                    </div>
                ))}
            </div>
        </div>
    )
}

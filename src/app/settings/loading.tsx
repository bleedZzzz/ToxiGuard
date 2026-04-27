import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 py-4 animate-in fade-in duration-500">
            <div className="space-y-2">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-5 w-56" />
            </div>

            <div className="grid gap-8">
                {/* Account Card */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="bg-muted/30 p-6 space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-52" />
                    </div>
                    <div className="p-6">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-80" />
                    </div>
                </div>

                {/* Threshold Card */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="p-6 space-y-2">
                        <Skeleton className="h-6 w-44" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    <div className="p-6 pt-2 flex justify-center">
                        <div className="w-full max-w-md space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-7 w-12" />
                            </div>
                            <Skeleton className="h-5 w-full rounded-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-xl border border-destructive/30 p-6 space-y-3">
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-10 w-48" />
                </div>
            </div>
        </div>
    )
}

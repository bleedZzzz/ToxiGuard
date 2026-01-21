import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
    return (
        <Card className="relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/20 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                    {title}
                </CardTitle>
                <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold tracking-tighter">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-primary/40 inline-block" />
                        {description}
                    </p>
                )}
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>
    )
}

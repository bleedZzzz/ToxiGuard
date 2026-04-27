import { ReactNode } from 'react'
import { MagicCard } from './ui/magic-card'
import { BorderBeam } from './ui/border-beam'

interface StatCardProps {
    title: string
    value: string | number
    description: string
    icon: React.ElementType
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
    showBeam?: boolean
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    trendValue,
    showBeam = false
}: StatCardProps) {
    return (
        <MagicCard className="p-6 relative overflow-hidden" gradientColor="rgba(255,255,255,0.05)">
            {showBeam && <BorderBeam duration={8} size={150} colorFrom="#06ffa5" colorTo="#00d9ff" />}
            <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                    {title}
                </h3>
                <div className="p-2 bg-primary/10 rounded-xl">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
                <div className="text-3xl font-bold tracking-tighter">{value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                    {trend && (
                        <span
                            className={`mr-1 font-medium ${trend === 'up'
                                ? 'text-emerald-500'
                                : trend === 'down'
                                    ? 'text-rose-500'
                                    : 'text-amber-500'
                                }`}
                        >
                            {trendValue}
                        </span>
                    )}
                    {description}
                </div>
            </div>
        </MagicCard>
    )
}

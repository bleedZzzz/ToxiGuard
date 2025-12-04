'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Flag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Comment {
    id: string
    content: string
    commenter_name: string
    commented_at: string
    toxicity_score?: {
        score: number
        label: string
    }
}

export function CommentCard({ comment }: { comment: Comment }) {
    const isToxic = (comment.toxicity_score?.score || 0) > 0.7 // Default threshold

    return (
        <Card className={isToxic ? "border-red-200 bg-red-50/10" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="font-semibold text-sm">{comment.commenter_name}</div>
                <div className="text-xs text-muted-foreground">
                    {comment.commented_at ? formatDistanceToNow(new Date(comment.commented_at), { addSuffix: true }) : 'Unknown date'}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm">{comment.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center gap-2">
                    {comment.toxicity_score && (
                        <Badge variant={isToxic ? "destructive" : "secondary"}>
                            {comment.toxicity_score.label} ({(comment.toxicity_score.score * 100).toFixed(0)}%)
                        </Badge>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Flag className="h-4 w-4" />
                        <span className="sr-only">Report</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

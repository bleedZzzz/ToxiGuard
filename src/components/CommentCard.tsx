'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ExternalLink, Flag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Comment {
    id: string
    content: string
    commenter_name: string
    commented_at: string
    post_id: string
    posts?: {
        content: string
    }
    toxicity_score?: {
        score: number
        label: string
    }
}

import { MagicCard } from "./ui/magic-card"

export function CommentCard({ comment }: { comment: Comment }) {
    const isToxic = (comment.toxicity_score?.score || 0) > 0.7

    // Build a Facebook post URL from the post_id if it looks like a valid FB ID
    const postUrl = comment.post_id && comment.post_id.includes('_')
        ? `https://www.facebook.com/${comment.post_id}`
        : null

    return (
        <MagicCard 
            className={`flex flex-col overflow-hidden transition-all duration-300 ${isToxic ? "border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "hover:shadow-md border-border/50 bg-card/50 backdrop-blur-sm"}`}
            gradientColor={isToxic ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)"}
        >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                        <AvatarFallback className="bg-primary/5">
                            {comment.commenter_name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold leading-none">{comment.commenter_name}</span>
                        <span className="text-xs text-muted-foreground mt-1">
                            {comment.commented_at ? formatDistanceToNow(new Date(comment.commented_at), { addSuffix: true }) : 'Recently'}
                        </span>
                    </div>
                </div>
                {postUrl && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a href={postUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View Post: {comment.posts?.content?.substring(0, 30)}...</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </CardHeader>
            <CardContent className="pb-3">
                <p className="text-sm leading-relaxed text-foreground/90">{comment.content}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-0 pb-4">
                <div className="flex items-center gap-2">
                    {comment.toxicity_score && (
                        <Badge
                            variant={isToxic ? "destructive" : "secondary"}
                            className={isToxic ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"}
                        >
                            {isToxic ? 'Flagged' : 'Safe'}: {comment.toxicity_score.label} ({(comment.toxicity_score.score * 100).toFixed(0)}%)
                        </Badge>
                    )}
                </div>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 gap-1.5 text-xs font-medium ${isToxic ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-muted-foreground"}`}
                    >
                        <Flag className="h-3.5 w-3.5" />
                        Report
                    </Button>
                </div>
            </CardFooter>
        </MagicCard>
    )
}

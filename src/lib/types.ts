// ──────────────────────────────────────────
// ToxiGuard Database Types
// ──────────────────────────────────────────

export interface Profile {
    id: string
    email: string | null
    threshold: number
    created_at: string
}

export interface SocialAccount {
    id: string
    user_id: string
    platform: 'facebook' | 'instagram'
    access_token: string
    page_id: string
    page_name: string | null
    created_at: string
}

export interface Post {
    id: string
    user_id: string
    content: string | null
    created_at: string
}

export interface Comment {
    id: string
    post_id: string
    user_id: string
    content: string | null
    commenter_name: string | null
    commented_at: string | null
    created_at: string
}

export interface ToxicityScore {
    id: string
    comment_id: string
    score: number
    label: ToxicityLabel
    model: string | null
    created_at: string
}

export type ToxicityLabel =
    | 'safe'
    | 'hate_speech'
    | 'harassment'
    | 'sexual'
    | 'violence'
    | 'spam'

export interface Report {
    id: string
    comment_id: string
    user_id: string
    reason: string | null
    status: ReportStatus
    created_at: string
}

export type ReportStatus = 'pending' | 'resolved' | 'dismissed'

// ──────────────────────────────────────────
// Joined / Enriched Types (for queries)
// ──────────────────────────────────────────

export interface CommentWithDetails extends Comment {
    posts?: Pick<Post, 'content'> | null
    toxicity_scores?: Pick<ToxicityScore, 'score' | 'label'>[]
}

export interface CommentForCard extends Comment {
    posts?: Pick<Post, 'content'> | null
    toxicity_score?: Pick<ToxicityScore, 'score' | 'label'> | null
}

export interface ReportWithComment extends Report {
    comments?: {
        content: string | null
        commenter_name: string | null
        toxicity_scores?: Pick<ToxicityScore, 'score' | 'label'>[]
    } | null
}

// ──────────────────────────────────────────
// Utility
// ──────────────────────────────────────────

export function formatLabel(label: string): string {
    return label
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
}

export function getToxicityColor(score: number): string {
    if (score >= 0.8) return 'text-red-500'
    if (score >= 0.5) return 'text-amber-500'
    return 'text-emerald-500'
}

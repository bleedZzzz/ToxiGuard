'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export async function deleteAccount() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const adminClient = createAdminClient()

    try {
        // Delete in dependency order (child tables first)
        // 1. Delete toxicity_scores (via comments)
        const { data: userComments } = await adminClient
            .from('comments')
            .select('id')
            .eq('user_id', user.id)

        if (userComments && userComments.length > 0) {
            const commentIds = userComments.map(c => c.id)
            await adminClient.from('toxicity_scores').delete().in('comment_id', commentIds)
        }

        // 2. Delete reports
        await adminClient.from('reports').delete().eq('user_id', user.id)

        // 3. Delete comments
        await adminClient.from('comments').delete().eq('user_id', user.id)

        // 4. Delete posts
        await adminClient.from('posts').delete().eq('user_id', user.id)

        // 5. Delete social accounts
        await adminClient.from('social_accounts').delete().eq('user_id', user.id)

        // 6. Delete profile
        await adminClient.from('profiles').delete().eq('id', user.id)

        // 7. Delete the auth user
        const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

        if (deleteError) {
            console.error('Error deleting auth user:', deleteError)
            return { success: false, error: 'Failed to delete account. Please try again.' }
        }

        // Sign out
        await supabase.auth.signOut()

    } catch (error: any) {
        console.error('Error deleting account:', error)
        return { success: false, error: error.message || 'An unexpected error occurred' }
    }

    redirect('/login')
}

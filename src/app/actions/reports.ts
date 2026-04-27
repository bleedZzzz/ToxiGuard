'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateReportStatus(reportId: string, status: 'resolved' | 'dismissed') {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating report:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/reports')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteReport(reportId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting report:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/reports')
    revalidatePath('/dashboard')
    return { success: true }
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateToxicityThreshold(threshold: number) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('profiles')
        .update({ threshold })
        .eq('id', user.id)

    if (error) {
        console.error('Error updating threshold:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/settings')
    return { success: true }
}

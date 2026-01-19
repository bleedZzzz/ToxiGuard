'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface FacebookPage {
    access_token: string
    category: string
    name: string
    id: string
    tasks: string[]
}

interface FacebookAccountsResponse {
    data: FacebookPage[]
    paging: any
}

export async function connectFacebook(userAccessToken: string) {
    const supabase = await createClient()

    try {
        // 1. Get User
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        // 2. Fetch Pages from Facebook
        const response = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${userAccessToken}`)

        if (!response.ok) {
            const errorData = await response.json()
            console.error('Facebook API Error:', errorData)
            return { success: false, error: 'Failed to fetch Facebook pages' }
        }

        const data: FacebookAccountsResponse = await response.json()
        const pages = data.data

        if (!pages || pages.length === 0) {
            return { success: false, error: 'No Facebook pages found for this user.' }
        }

        // 3. Insert Pages into Supabase
        const inserts = pages.map(page => ({
            user_id: user.id,
            platform: 'facebook',
            access_token: page.access_token, // Page Access Token
            page_id: page.id,
            page_name: page.name
        }))

        const { error: dbError } = await supabase
            .from('social_accounts')
            .upsert(inserts, { onConflict: 'page_id' })

        if (dbError) {
            console.error('Supabase Error:', dbError)
            return { success: false, error: 'Failed to save account details' }
        }

        revalidatePath('/dashboard')
        return { success: true, count: pages.length }

    } catch (error: any) {
        console.error('Server Action Error:', error)
        return { success: false, error: error.message || 'Internal Server Error' }
    }
}

'use client'

import { Button } from '@/components/ui/button'
import { Facebook } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { connectFacebook } from '@/app/actions/social'

interface ConnectFacebookProps {
    appId: string
}

declare global {
    interface Window {
        FB: any
        fbAsyncInit: () => void
    }
}

export function ConnectFacebookButton({ appId }: ConnectFacebookProps) {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Load Facebook SDK
        if (typeof window !== 'undefined') {
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: appId,
                    cookie: true,
                    xfbml: true,
                    version: 'v19.0'
                });
            };

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement(s) as HTMLScriptElement; js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                if (fjs && fjs.parentNode) {
                    fjs.parentNode.insertBefore(js, fjs);
                }
            }(document, 'script', 'facebook-jssdk'));
        }
    }, [appId])

    const handleLogin = () => {
        if (!window.FB) {
            toast.error('Facebook SDK not loaded yet. Please try again.')
            return
        }

        setLoading(true)

        // Request permissions for Pages
        window.FB.login(async function (response: any) {
            if (response.authResponse) {
                toast.info('Authenticating with backend...')
                const res = await connectFacebook(response.authResponse.accessToken)

                if (res.success) {
                    toast.success(`Connected ${res.count} Facebook Page(s)!`)
                } else {
                    toast.error(res.error || 'Failed to connect accounts.')
                }
            } else {
                toast.error('User cancelled login or did not fully authorize.')
            }
            setLoading(false)
        }, { scope: 'public_profile,pages_show_list,pages_read_engagement,pages_manage_metadata' })
    }

    return (
        <Button
            onClick={handleLogin}
            disabled={loading}
            className="bg-[#1877F2] hover:bg-[#166fe5] text-white"
        >
            <Facebook className="mr-2 h-4 w-4" />
            {loading ? 'Connecting...' : 'Connect Facebook'}
        </Button>
    )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ThresholdSlider } from '@/components/ThresholdSlider'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile for threshold
    const { data: profile } = await supabase
        .from('profiles')
        .select('threshold')
        .eq('id', user.id)
        .single()

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your preferences and security.
                </p>
            </div>

            <div className="grid gap-8">
                <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/30">
                        <CardTitle>Account Security</CardTitle>
                        <CardDescription>
                            Your logged-in session details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4 max-w-md">
                            <div className="space-y-1">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email Address</Label>
                                <Input value={user.email} disabled className="bg-muted/50 font-mono text-sm" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-primary/20 bg-primary/[0.02]">
                    <CardHeader className="bg-primary/5 border-b border-primary/10">
                        <CardTitle className="text-primary flex items-center gap-2">
                            AI Toxicity Detection
                        </CardTitle>
                        <CardDescription>
                            Adjust how strictly ToxiGuard flags comments. Higher values will only flag obvious toxicity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 flex justify-center pb-10">
                        <ThresholdSlider initialValue={profile?.threshold ?? 0.7} />
                    </CardContent>
                </Card>

                <Card className="border-destructive/30 bg-destructive/[0.02]">
                    <CardHeader>
                        <CardTitle className="text-destructive font-bold">Danger Zone</CardTitle>
                        <CardDescription>
                            Deleting your account is permanent and cannot be undone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" size="lg" className="w-full sm:w-auto">
                            Delete Account & All Data
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

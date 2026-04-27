import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Zap, BarChart3, Eye, ArrowRight, ChevronRight, Shield, Bell } from 'lucide-react'
import type { Metadata } from 'next'
import { GridPattern } from '@/components/ui/grid-pattern'
import { BlurFade } from '@/components/ui/blur-fade'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { ShinyButton } from '@/components/ui/shiny-button'
import { MagicCard } from '@/components/ui/magic-card'

export const metadata: Metadata = {
    title: 'ToxiGuard — AI-Powered Toxicity Protection for Social Media',
    description: 'Automatically detect and flag toxic comments on your Instagram and Facebook posts using advanced AI classification. Real-time monitoring, smart filtering, and insightful analytics.',
}

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Lightweight animated grid background */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
                <GridPattern
                    width={40}
                    height={40}
                    x={-1}
                    y={-1}
                    className="opacity-40"
                    strokeDasharray="4 2"
                />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[100px]" />
            </div>

            {/* Hero */}
            <section className="flex-1 flex flex-col items-center justify-center space-y-12 py-24 text-center md:py-32 relative">
                <BlurFade delay={0.1}>
                    <AnimatedGradientText className="mb-4">
                        <span className="flex items-center gap-2 px-2 text-xs md:text-sm font-medium tracking-tight">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Protecting communities in real-time
                        </span>
                    </AnimatedGradientText>
                </BlurFade>

                <div className="space-y-6 max-w-4xl">
                    <BlurFade delay={0.2}>
                        <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/40">
                            Automated Toxicity
                            <br />
                            <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                                Protection
                            </span>
                        </h1>
                    </BlurFade>
                    <BlurFade delay={0.3}>
                        <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                            ToxiGuard uses advanced AI to detect hate speech, harassment, and spam
                            on your social media pages — <span className="text-foreground font-medium">before it damages your community.</span>
                        </p>
                    </BlurFade>
                </div>

                <BlurFade delay={0.4}>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <Link href="/login">
                            <ShinyButton className="flex items-center gap-2">
                                Get Started Free
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </ShinyButton>
                        </Link>
                        <Link href="#how-it-works">
                            <Button variant="ghost" size="lg" className="px-8 text-base">
                                How It Works
                            </Button>
                        </Link>
                    </div>
                </BlurFade>

                {/* Trust indicators */}
                <BlurFade delay={0.5}>
                    <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            AI-Powered
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Zap className="h-4 w-4 text-amber-500" />
                            Real-time
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4 text-blue-500" />
                            Always Watching
                        </div>
                    </div>
                </BlurFade>
            </section>

            {/* Features Grid */}
            <section id="features" className="container py-16 md:py-28">
                <BlurFade delay={0.2} inView>
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Everything you need to protect your community
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            ToxiGuard combines AI classification with real-time monitoring to keep your social media safe.
                        </p>
                    </div>
                </BlurFade>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <BlurFade delay={0.25} inView>
                        <FeatureCard
                            icon={<Zap className="h-6 w-6" />}
                            title="Real-time Detection"
                            description="Comments are analyzed the instant they're posted. No delays, no batch processing — immediate protection."
                            gradient="from-amber-500/20 to-orange-500/20"
                            iconColor="text-amber-500"
                        />
                    </BlurFade>
                    <BlurFade delay={0.3} inView>
                        <FeatureCard
                            icon={<ShieldCheck className="h-6 w-6" />}
                            title="Smart Classification"
                            description="Powered by Groq AI, ToxiGuard categorizes threats as hate speech, harassment, violence, spam, or safe — with confidence scores."
                            gradient="from-blue-500/20 to-cyan-500/20"
                            iconColor="text-blue-500"
                        />
                    </BlurFade>
                    <BlurFade delay={0.35} inView>
                        <FeatureCard
                            icon={<BarChart3 className="h-6 w-6" />}
                            title="Insightful Analytics"
                            description="Track toxicity trends, community health metrics, and protection effectiveness over time."
                            gradient="from-violet-500/20 to-purple-500/20"
                            iconColor="text-violet-500"
                        />
                    </BlurFade>
                    <BlurFade delay={0.4} inView>
                        <FeatureCard
                            icon={<Bell className="h-6 w-6" />}
                            title="Auto-Flagging"
                            description="Toxic comments above your custom threshold are automatically flagged for review — you set the sensitivity."
                            gradient="from-rose-500/20 to-pink-500/20"
                            iconColor="text-rose-500"
                        />
                    </BlurFade>
                    <BlurFade delay={0.45} inView>
                        <FeatureCard
                            icon={<Eye className="h-6 w-6" />}
                            title="Multi-Page Monitoring"
                            description="Connect multiple Facebook pages and monitor them all from a single, unified dashboard."
                            gradient="from-emerald-500/20 to-teal-500/20"
                            iconColor="text-emerald-500"
                        />
                    </BlurFade>
                    <BlurFade delay={0.5} inView>
                        <FeatureCard
                            icon={<Shield className="h-6 w-6" />}
                            title="Vigilance Reports"
                            description="Detailed reports on every flagged comment with one-click dismiss or escalation actions."
                            gradient="from-indigo-500/20 to-blue-500/20"
                            iconColor="text-indigo-500"
                        />
                    </BlurFade>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="container py-16 md:py-28 border-t border-border/50">
                <BlurFade delay={0.2} inView>
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Three steps to a safer community
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Set up ToxiGuard in minutes and let AI handle the rest.
                        </p>
                    </div>
                </BlurFade>

                <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
                    <BlurFade delay={0.3} inView>
                        <StepCard
                            step="01"
                            title="Connect Your Pages"
                            description="Link your Facebook/Instagram pages with a single click. We only need read access to comments."
                        />
                    </BlurFade>
                    <BlurFade delay={0.4} inView>
                        <StepCard
                            step="02"
                            title="AI Analyzes Comments"
                            description="Every new comment is instantly classified by our AI — hate speech, harassment, spam, and more."
                        />
                    </BlurFade>
                    <BlurFade delay={0.5} inView>
                        <StepCard
                            step="03"
                            title="Review & Act"
                            description="Toxic comments are flagged in your dashboard. Dismiss, escalate, or adjust your sensitivity threshold."
                        />
                    </BlurFade>
                </div>
            </section>

            {/* CTA */}
            <section className="container py-16 md:py-24">
                <BlurFade delay={0.2} inView>
                    <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-card p-12 md:p-20 text-center space-y-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5" />
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                Ready to protect your community?
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                                Start monitoring your social media for toxic content today. Setup takes less than 2 minutes.
                            </p>
                            <div className="flex justify-center mt-8">
                                <Link href="/login">
                                    <ShinyButton className="flex items-center gap-2">
                                        Get Started
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </ShinyButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                </BlurFade>
            </section>

            {/* Footer */}
            <footer className="border-t py-8 mt-auto">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">ToxiGuard</span>
                        <span>© {new Date().getFullYear()}</span>
                    </div>
                    <p>AI-Powered Toxicity Protection for Social Media</p>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({
    icon,
    title,
    description,
    gradient,
    iconColor,
}: {
    icon: React.ReactNode
    title: string
    description: string
    gradient: string
    iconColor: string
}) {
    return (
        <MagicCard className="p-8 hover:-translate-y-1 transition-transform duration-300">
            <div className="space-y-4">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
                    <div className={iconColor}>{icon}</div>
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </MagicCard>
    )
}

function StepCard({
    step,
    title,
    description,
}: {
    step: string
    title: string
    description: string
}) {
    return (
        <div className="text-center space-y-4 relative">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary text-xl font-bold mx-auto border border-primary/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                {step}
            </div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
    )
}

import Link from 'next/link'
import { TubesCursorAnimation } from '@/components/TubesCursorAnimation'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Zap, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <TubesCursorAnimation />
      <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 text-center md:py-32">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Automated Toxicity Protection for Social Media
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            ToxiGuard automatically detects and flags toxic comments on your Instagram and Facebook posts using advanced AI.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">Learn More</Button>
          </Link>
        </div>
      </section>

      <section id="features" className="container py-12 md:py-24 lg:py-32 bg-muted/50 rounded-3xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Real-time Detection</h3>
            <p className="text-muted-foreground">
              Comments are analyzed instantly as they are posted using powerful AI models.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Smart Filtering</h3>
            <p className="text-muted-foreground">
              Automatically flag hate speech, harassment, and spam with high accuracy.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Insightful Analytics</h3>
            <p className="text-muted-foreground">
              Track toxicity trends over time and manage your community health.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

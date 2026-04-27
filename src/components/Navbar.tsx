'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Menu, X } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShinyButton } from './ui/shiny-button'
import { cn } from '@/lib/utils'

const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/reports', label: 'Reports' },
    { href: '/settings', label: 'Settings' },
]

export function Navbar({ user }: { user: User | null }) {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <header className="sticky top-0 z-50 w-full pt-4 px-4 flex justify-center">
            <nav className={cn(
                "w-full max-w-5xl rounded-full border transition-all duration-300 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
                scrolled ? "bg-background/80 shadow-lg shadow-primary/5 py-2 px-6" : "bg-transparent py-4 px-2 md:px-6 border-transparent"
            )}>
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
                        <div className="p-1.5 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full group-hover:from-primary/30 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">
                            ToxiGuard
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    {user && (
                        <div className="hidden md:flex items-center bg-muted/30 p-1 rounded-full border shadow-sm">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${pathname === link.href
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-0">
                                            <Avatar className="h-9 w-9 border-2 border-primary/20 shadow-sm transition-transform hover:scale-105">
                                                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                                                    {user.email?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">Account</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                            <Link href="/dashboard">Dashboard</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                            <Link href="/settings">Settings</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive rounded-lg cursor-pointer">
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Mobile hamburger */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden h-9 w-9 rounded-full"
                                    onClick={() => setMobileOpen(!mobileOpen)}
                                >
                                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                                </Button>
                            </>
                        ) : (
                            <Link href="/login">
                                <ShinyButton>
                                    Login
                                </ShinyButton>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Nav */}
                {user && mobileOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === link.href
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}

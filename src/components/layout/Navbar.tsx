'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, Shirt, BarChart3, Lightbulb, Settings, LogOut, Heart, CalendarDays, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/dashboard', label: 'Wardrobe', icon: LayoutDashboard },
    { href: '/outfits', label: 'Outfits', icon: Shirt },
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/capsules', label: 'Capsules', icon: Sparkles },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/suggestions', label: 'Suggestions', icon: Lightbulb },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose" fill="currentColor" />
                        <span className="font-display text-lg font-semibold tracking-tight hidden sm:inline">
                            My Virtual Wardrobe
                        </span>
                        <span className="font-display text-lg font-semibold tracking-tight sm:hidden">
                            MVW
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                        isActive
                                            ? 'text-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    )}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                    {isActive && (
                                        <motion.div
                                            className="absolute bottom-0 left-2 right-2 h-0.5 bg-foreground rounded-full"
                                            layoutId="navbar-indicator"
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/settings"
                            className={cn(
                                'hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                pathname === '/settings'
                                    ? 'text-foreground bg-secondary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            )}
                        >
                            <Settings className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={signOut}
                            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
                        <motion.div
                            className="absolute top-16 left-0 right-0 bg-card border-b border-border p-4 space-y-1"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                                            isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary'
                                        )}
                                    >
                                        <link.icon className="w-4 h-4" />
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <Link
                                href="/settings"
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                                    pathname === '/settings' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary'
                                )}
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </Link>
                            <button
                                onClick={() => { setMobileOpen(false); signOut(); }}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary w-full transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

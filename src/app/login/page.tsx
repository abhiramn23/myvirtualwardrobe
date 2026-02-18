'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel — decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-cream via-blush/40 to-lavender/40 items-center justify-center p-12">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-champagne/40 rounded-full blur-3xl" />
                </div>
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Heart className="w-16 h-16 text-rose mx-auto mb-6" fill="currentColor" />
                        <h2 className="font-display text-4xl font-bold mb-4">Welcome Back</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            Your curated wardrobe is waiting. Sign in to explore your collection.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                            <Heart className="w-4 h-4 text-rose" fill="currentColor" />
                            <span className="font-display text-lg font-semibold">My Virtual Wardrobe</span>
                        </Link>
                        <h1 className="text-2xl font-bold mt-6">Sign in to your account</h1>
                        <p className="text-muted-foreground mt-2">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-foreground font-medium underline underline-offset-4 hover:text-accent-foreground">
                                Create one
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

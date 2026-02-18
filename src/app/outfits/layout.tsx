'use client';

import { AuthProvider } from '@/components/auth/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';

export default function OutfitsLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-16">
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
}

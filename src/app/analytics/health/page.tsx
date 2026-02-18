'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity } from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { HealthDashboard } from '@/components/analytics/HealthDashboard';

export default function AnalyticsHealthPage() {
    const { items, loading } = useItems();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link
                        href="/analytics"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Analytics
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">Wardrobe Health</h1>
                            <p className="text-muted-foreground text-sm">Actionable insights to optimize your collection.</p>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="w-full h-[400px] bg-secondary/20 rounded-3xl animate-pulse flex items-center justify-center">
                    <p className="text-muted-foreground">Analyzing your collection...</p>
                </div>
            ) : (
                <Suspense fallback={<div>Loading health report...</div>}>
                    <HealthDashboard items={items} />
                </Suspense>
            )}
        </div>
    );
}

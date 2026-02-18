'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    TrendingUp,
    Trash2,
    ArrowRight,
    ShoppingBag,
    History,
    Sparkles
} from 'lucide-react';
import { Item, CATEGORY_ICONS } from '@/lib/types';
import { calculateCostPerWear, formatCurrency, cn } from '@/lib/utils';

interface HealthDashboardProps {
    items: Item[];
}

export function HealthDashboard({ items }: HealthDashboardProps) {
    const ownedItems = useMemo(() => items.filter(i => i.status === 'owned'), [items]);

    // 1. High CPW Items (Price / WearCount > 20% of Price is a lot, or just top 5)
    const highCPWItems = useMemo(() => {
        return [...ownedItems]
            .filter(i => i.wear_count > 0)
            .sort((a, b) => {
                const cpwA = calculateCostPerWear(Number(a.price), a.wear_count);
                const cpwB = calculateCostPerWear(Number(b.price), b.wear_count);
                return cpwB - cpwA;
            })
            .slice(0, 5);
    }, [ownedItems]);

    // 2. Underutilized (Neglected) - Worn < 3 times
    const neglectedItems = useMemo(() => {
        return ownedItems
            .filter(i => i.wear_count < 3)
            .sort((a, b) => a.wear_count - b.wear_count)
            .slice(0, 5);
    }, [ownedItems]);

    // 3. Cleanup Candidates (Regretted OR (Neglected and old))
    const cleanupCandidates = useMemo(() => {
        return ownedItems.filter(i => i.regret || i.wear_count === 0).slice(0, 5);
    }, [ownedItems]);

    // Wardrobe Health Score (0-100)
    // Based on average CPW vs Price and % of items worn > 5 times
    const healthScore = useMemo(() => {
        if (ownedItems.length === 0) return 0;
        const wornOftenCount = ownedItems.filter(i => i.wear_count > 5).length;
        const wearRate = (wornOftenCount / ownedItems.length) * 100;
        const regretRate = (ownedItems.filter(i => i.regret).length / ownedItems.length) * 100;
        return Math.max(0, Math.min(100, Math.round(wearRate * 0.8 + (100 - regretRate) * 0.2)));
    }, [ownedItems]);

    return (
        <div className="space-y-10">
            {/* Health Score Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary border border-border"
            >
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                className="stroke-secondary fill-none"
                                strokeWidth="12"
                            />
                            <motion.circle
                                cx="80"
                                cy="80"
                                r="70"
                                className="stroke-primary fill-none"
                                strokeWidth="12"
                                strokeLinecap="round"
                                initial={{ strokeDasharray: "0 440" }}
                                animate={{ strokeDasharray: `${(healthScore / 100) * 440} 440` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold font-display">{healthScore}%</span>
                            <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">Health</span>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold font-display mb-2 flex items-center justify-center md:justify-start gap-2">
                            <Activity className="w-6 h-6 text-primary" />
                            Wardrobe Health Report
                        </h2>
                        <p className="text-muted-foreground text-sm max-w-lg mb-4">
                            Your health score is based on item utilization and satisfaction.
                            {healthScore > 80 ? " Excellent job! Your wardrobe is working hard for you." :
                                healthScore > 50 ? " Good progress. Consider wearing your underutilized items more." :
                                    " Room for improvement. A cleanup might help you focus on what you love."}
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <div className="px-3 py-1.5 rounded-full bg-background border border-border text-xs font-medium flex items-center gap-1.5">
                                <ShoppingBag className="w-3.5 h-3.5 text-sage" />
                                {ownedItems.length} Owned Items
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-background border border-border text-xs font-medium flex items-center gap-1.5">
                                <History className="w-3.5 h-3.5 text-lavender" />
                                {ownedItems.filter(i => i.wear_count > 10).length} Power Pieces
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* High CPW Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-amber-500" />
                            Efficiency Sinkholes (High CPW)
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {highCPWItems.map(item => (
                            <div key={item.id} className="p-4 rounded-2xl bg-card border border-border flex items-center gap-4 transition-all hover:border-primary/30">
                                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl overflow-hidden shrink-0 border border-border">
                                    {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : CATEGORY_ICONS[item.category]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">{item.wear_count} wears • {formatCurrency(calculateCostPerWear(item.price, item.wear_count))} / wear</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-amber-600 uppercase tracking-tighter">Needs Wears</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Neglected Items */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                >
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-lavender" />
                        Neglected Pieces
                    </h3>
                    <div className="space-y-3">
                        {neglectedItems.map(item => (
                            <div key={item.id} className="p-4 rounded-2xl bg-card border border-border flex items-center gap-4 transition-all hover:border-primary/30">
                                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl overflow-hidden shrink-0 border border-border">
                                    {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : CATEGORY_ICONS[item.category]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">{item.wear_count} wears • {item.brand || 'No Brand'}</p>
                                </div>
                                <button className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors group">
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Cleanup Candidates */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl bg-secondary/30 border border-border"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Trash2 className="w-5 h-5 text-rose" />
                            Cleanup Candidates
                        </h3>
                        <p className="text-xs text-muted-foreground">Items you might want to resell or donate to make space.</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-rose/10 text-rose text-[10px] font-bold uppercase tracking-wider">
                        Suggested for Resale
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cleanupCandidates.map(item => (
                        <div key={item.id} className="p-4 rounded-2xl bg-background border border-border group relative">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg overflow-hidden shrink-0 border border-border">
                                    {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : CATEGORY_ICONS[item.category]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-xs truncate">{item.title}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[10px] text-rose font-bold uppercase">{item.regret ? 'Regretted' : 'Never Worn'}</span>
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                        <span className="text-[10px] text-muted-foreground">{formatCurrency(item.price)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {cleanupCandidates.length === 0 && (
                        <div className="col-span-full py-12 text-center">
                            <Sparkles className="w-8 h-8 text-primary/40 mx-auto mb-3" />
                            <p className="text-sm font-medium text-muted-foreground">Your wardrobe is perfectly curated!</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

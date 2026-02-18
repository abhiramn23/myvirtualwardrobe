'use client';

import { motion } from 'framer-motion';
import {
    DollarSign,
    Heart,
    ShoppingBag,
    TrendingDown,
    Crown,
    BarChart3,
    Shirt,
    Package,
} from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { calculateStats, formatCurrency } from '@/lib/utils';
import { CATEGORY_ICONS } from '@/lib/types';

export default function AnalyticsPage() {
    const { items, loading } = useItems();
    const stats = calculateStats(items);

    const statCards = [
        {
            label: 'Total Wardrobe Value',
            value: formatCurrency(stats.totalValue),
            icon: <DollarSign className="w-5 h-5" />,
            color: 'bg-champagne/40 text-amber-700',
        },
        {
            label: 'Owned Value',
            value: formatCurrency(stats.ownedValue),
            icon: <ShoppingBag className="w-5 h-5" />,
            color: 'bg-sage/40 text-green-700',
        },
        {
            label: 'Wishlist Value',
            value: formatCurrency(stats.wishlistValue),
            icon: <Heart className="w-5 h-5" />,
            color: 'bg-rose/40 text-red-700',
        },
        {
            label: 'Avg. Cost Per Wear',
            value: stats.averageCostPerWear > 0 ? formatCurrency(stats.averageCostPerWear) : '—',
            icon: <TrendingDown className="w-5 h-5" />,
            color: 'bg-lavender/40 text-purple-700',
        },
        {
            label: 'Total Items',
            value: stats.totalItems.toString(),
            icon: <Package className="w-5 h-5" />,
            color: 'bg-blush/40 text-pink-700',
        },
        {
            label: 'Owned Items',
            value: stats.ownedItems.toString(),
            icon: <Shirt className="w-5 h-5" />,
            color: 'bg-cream text-amber-800',
        },
    ];

    // Category breakdown
    const categoryBreakdown = ['shirts', 'pants', 'shoes', 'accessories'].map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        const value = catItems.reduce((sum, i) => sum + Number(i.price), 0);
        return {
            category: cat,
            count: catItems.length,
            value,
            icon: CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS],
        };
    });

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-48 bg-secondary rounded-lg" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-32 bg-secondary rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold font-display">Analytics</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Insights into your wardrobe spending and usage
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="p-5 rounded-2xl bg-card border border-border"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-muted-foreground">{stat.label}</span>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Most Worn Item */}
            {stats.mostWornItem && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-champagne/30 via-cream to-blush/20 border border-border mb-10"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Crown className="w-5 h-5 text-amber-600" />
                        <h2 className="font-semibold">Most Worn Item</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-card border border-border flex-shrink-0">
                            {stats.mostWornItem.image_url ? (
                                <img
                                    src={stats.mostWornItem.image_url}
                                    alt={stats.mostWornItem.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                    {CATEGORY_ICONS[stats.mostWornItem.category]}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium">{stats.mostWornItem.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                Worn {stats.mostWornItem.wear_count} times •{' '}
                                {formatCurrency(
                                    Number(stats.mostWornItem.price) / stats.mostWornItem.wear_count
                                )}{' '}
                                per wear
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Category Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 rounded-2xl bg-card border border-border"
            >
                <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5" />
                    <h2 className="font-semibold">Category Breakdown</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    {categoryBreakdown.map((cat) => {
                        const maxCount = Math.max(...categoryBreakdown.map((c) => c.count), 1);
                        return (
                            <div key={cat.category} className="p-4 rounded-xl bg-secondary/50">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{cat.icon}</span>
                                        <span className="text-sm font-medium capitalize">{cat.category}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{cat.count} items</span>
                                </div>
                                {/* Bar */}
                                <div className="h-2 bg-border rounded-full overflow-hidden mb-2">
                                    <motion.div
                                        className={`h-full rounded-full badge-${cat.category}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(cat.count / maxCount) * 100}%` }}
                                        transition={{ delay: 0.8, duration: 0.5 }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Value: {formatCurrency(cat.value)}</p>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}

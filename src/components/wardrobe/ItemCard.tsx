'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Trash2, ShoppingBag, Heart, TrendingDown, Pencil, GitCompareArrows } from 'lucide-react';
import { Item, CATEGORY_ICONS } from '@/lib/types';
import { formatCurrency, calculateCostPerWear, cn } from '@/lib/utils';
import { StarRating } from './StarRating';

interface ItemCardProps {
    item: Item;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, status: 'wishlist' | 'owned') => void;
    onEdit?: (item: Item) => void;
    onCompareToggle?: (item: Item) => void;
    isCompareSelected?: boolean;
}

export function ItemCard({ item, onDelete, onToggleStatus, onEdit, onCompareToggle, isCompareSelected }: ItemCardProps) {
    const costPerWear =
        item.status === 'owned' ? calculateCostPerWear(Number(item.price), item.wear_count) : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                'group relative bg-card rounded-2xl border overflow-hidden card-hover',
                isCompareSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border'
            )}
        >
            {/* Compare checkbox */}
            {onCompareToggle && (
                <button
                    onClick={() => onCompareToggle(item)}
                    className={cn(
                        'absolute top-3 right-12 z-20 p-1.5 rounded-lg transition-all',
                        isCompareSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card/80 text-muted-foreground backdrop-blur-sm opacity-0 group-hover:opacity-100'
                    )}
                    title="Select for compare"
                >
                    <GitCompareArrows className="w-3.5 h-3.5" />
                </button>
            )}

            {/* Image */}
            <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                        {CATEGORY_ICONS[item.category]}
                    </div>
                )}

                {/* Status badge */}
                <div className="absolute top-3 left-3">
                    <span
                        className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                            item.status === 'owned'
                                ? 'bg-card/90 text-foreground backdrop-blur-sm'
                                : 'bg-rose/90 text-white backdrop-blur-sm'
                        )}
                    >
                        {item.status === 'owned' ? (
                            <ShoppingBag className="w-3 h-3" />
                        ) : (
                            <Heart className="w-3 h-3" fill="currentColor" />
                        )}
                        {item.status === 'owned' ? 'Owned' : 'Wishlist'}
                    </span>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 right-3">
                    <span className={`badge-${item.category} px-2.5 py-1 rounded-full text-xs font-medium`}>
                        {CATEGORY_ICONS[item.category]} {item.category}
                    </span>
                </div>

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(item)}
                                className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                                title="Edit item"
                            >
                                <Pencil className="w-4 h-4 text-foreground" />
                            </button>
                        )}
                        {item.product_link && (
                            <a
                                href={item.product_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                                title="View product"
                            >
                                <ExternalLink className="w-4 h-4 text-foreground" />
                            </a>
                        )}
                        <button
                            onClick={() =>
                                onToggleStatus(item.id, item.status === 'owned' ? 'wishlist' : 'owned')
                            }
                            className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                            title={item.status === 'owned' ? 'Move to wishlist' : 'Mark as owned'}
                        >
                            {item.status === 'owned' ? (
                                <Heart className="w-4 h-4 text-foreground" />
                            ) : (
                                <ShoppingBag className="w-4 h-4 text-foreground" />
                            )}
                        </button>
                    </div>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 bg-white/90 rounded-lg hover:bg-destructive hover:text-white transition-colors"
                        title="Delete item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium text-sm leading-tight line-clamp-1">{item.title}</h3>
                    <span className="text-sm font-semibold whitespace-nowrap">
                        {formatCurrency(Number(item.price))}
                    </span>
                </div>

                {item.brand && (
                    <p className="text-xs text-muted-foreground mb-2">{item.brand}</p>
                )}

                {/* Star rating for rated items */}
                {item.status === 'owned' && item.rating !== null && item.rating !== undefined && (
                    <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={item.rating} size="sm" />
                        {item.regret && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-rose/20 text-rose">Regret</span>
                        )}
                    </div>
                )}

                {/* Cost per wear for owned items */}
                {item.status === 'owned' && (
                    <div className="mt-2 pt-2 border-t border-border space-y-2">
                        {item.target_cp_wear && (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                                    <span className="text-muted-foreground">CPW Goal</span>
                                    <span className={cn(
                                        item.status_goal === 'achieved' ? "text-green-500" : "text-primary"
                                    )}>
                                        {item.status_goal === 'achieved' ? 'Goal Reached!' : `${Math.round((item.wear_count / (item.target_wear_count || 1)) * 100)}%`}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (item.wear_count / (item.target_wear_count || 1)) * 100)}%` }}
                                        className={cn(
                                            "h-full rounded-full",
                                            item.status_goal === 'achieved' ? "bg-green-500" : "bg-primary"
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <TrendingDown className="w-3 h-3" />
                                <span>Cost/wear</span>
                            </div>
                            <span className="text-xs font-medium">
                                {formatCurrency(costPerWear || Number(item.price))}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Worn</span>
                            <span className="text-xs font-medium">{item.wear_count}×</span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}


'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Trash2, ShoppingBag, Heart, TrendingDown } from 'lucide-react';
import { Item, CATEGORY_ICONS } from '@/lib/types';
import { formatCurrency, calculateCostPerWear, cn } from '@/lib/utils';

interface ItemCardProps {
    item: Item;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, status: 'wishlist' | 'owned') => void;
}

export function ItemCard({ item, onDelete, onToggleStatus }: ItemCardProps) {
    const costPerWear =
        item.status === 'owned' ? calculateCostPerWear(Number(item.price), item.wear_count) : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative bg-card rounded-2xl border border-border overflow-hidden card-hover"
        >
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

                {/* Cost per wear for owned items */}
                {item.status === 'owned' && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <TrendingDown className="w-3 h-3" />
                            <span>Cost/wear</span>
                        </div>
                        <span className="text-xs font-medium">
                            {item.wear_count > 0
                                ? formatCurrency(costPerWear!)
                                : 'Not worn yet'}
                        </span>
                    </div>
                )}

                {item.status === 'owned' && (
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Worn</span>
                        <span className="text-xs font-medium">{item.wear_count}×</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

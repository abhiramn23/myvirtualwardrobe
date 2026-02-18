'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, MessageCircle } from 'lucide-react';
import { Item, CATEGORY_ICONS } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { StarRating } from './StarRating';

interface CompareModalProps {
    isOpen: boolean;
    items: Item[];
    onClose: () => void;
    onLogComparison: () => void;
}

export function CompareModal({ isOpen, items, onClose, onLogComparison }: CompareModalProps) {
    if (items.length !== 2) return null;
    const [item1, item2] = items;

    const handleOpen = () => {
        onLogComparison();
    };

    const rows: { label: string; render: (item: Item) => React.ReactNode }[] = [
        {
            label: 'Image',
            render: (item) =>
                item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full aspect-square object-cover rounded-xl" />
                ) : (
                    <div className="w-full aspect-square bg-secondary rounded-xl flex items-center justify-center text-5xl">
                        {CATEGORY_ICONS[item.category]}
                    </div>
                ),
        },
        { label: 'Title', render: (item) => <span className="font-medium text-sm">{item.title}</span> },
        { label: 'Price', render: (item) => <span className="font-semibold">{formatCurrency(Number(item.price))}</span> },
        { label: 'Brand', render: (item) => <span className="text-sm text-muted-foreground">{item.brand || '—'}</span> },
        { label: 'Category', render: (item) => <span className="text-sm">{CATEGORY_ICONS[item.category]} {item.category}</span> },
        {
            label: 'Status',
            render: (item) => (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.status === 'owned' ? 'bg-sage/30 text-green-700' : 'bg-rose/30 text-red-700'}`}>
                    {item.status}
                </span>
            ),
        },
        {
            label: 'Rating',
            render: (item) => item.rating ? <StarRating rating={item.rating} size="sm" /> : <span className="text-xs text-muted-foreground">Not rated</span>,
        },
        { label: 'Wear Count', render: (item) => <span className="text-sm">{item.wear_count}×</span> },
        {
            label: 'Product Link',
            render: (item) =>
                item.product_link ? (
                    <a href={item.product_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-foreground hover:underline">
                        <ExternalLink className="w-3 h-3" /> View
                    </a>
                ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                ),
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-xl"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onAnimationStart={() => handleOpen()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 flex items-center justify-between p-5 border-b border-border bg-card rounded-t-2xl z-10">
                            <h2 className="text-lg font-semibold">Compare Items</h2>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Compare Table */}
                        <div className="p-5">
                            <div className="space-y-4">
                                {rows.map((row) => (
                                    <div key={row.label} className="grid grid-cols-[100px_1fr_1fr] gap-4 items-center">
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{row.label}</span>
                                        <div className="flex justify-center">{row.render(item1)}</div>
                                        <div className="flex justify-center">{row.render(item2)}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Community placeholder */}
                            <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border text-center">
                                <MessageCircle className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm font-medium mb-1">Ask Community</p>
                                <p className="text-xs text-muted-foreground">Coming soon — get opinions from other users</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

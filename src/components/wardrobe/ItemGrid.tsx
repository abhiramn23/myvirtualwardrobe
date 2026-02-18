'use client';

import { AnimatePresence } from 'framer-motion';
import { Item } from '@/lib/types';
import { ItemCard } from './ItemCard';

interface ItemGridProps {
    items: Item[];
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, status: 'wishlist' | 'owned') => void;
    onEdit?: (item: Item) => void;
    onCompareToggle?: (item: Item) => void;
    isCompareSelected?: (itemId: string) => boolean;
}

export function ItemGrid({ items, onDelete, onToggleStatus, onEdit, onCompareToggle, isCompareSelected }: ItemGridProps) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">👗</div>
                <h3 className="text-lg font-medium mb-2">No items yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Start building your wardrobe by adding your first fashion piece.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
                {items.map((item) => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        onDelete={onDelete}
                        onToggleStatus={onToggleStatus}
                        onEdit={onEdit}
                        onCompareToggle={onCompareToggle}
                        isCompareSelected={isCompareSelected?.(item.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}


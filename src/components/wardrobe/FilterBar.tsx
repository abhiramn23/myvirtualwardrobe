'use client';

import { ItemCategory, ItemStatus, CATEGORIES } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FilterBarProps {
    selectedCategory: ItemCategory | 'all';
    selectedStatus: ItemStatus | 'all';
    onCategoryChange: (category: ItemCategory | 'all') => void;
    onStatusChange: (status: ItemStatus | 'all') => void;
    itemCount: number;
}

export function FilterBar({
    selectedCategory,
    selectedStatus,
    onCategoryChange,
    onStatusChange,
    itemCount,
}: FilterBarProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => onCategoryChange('all')}
                    className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium transition-all',
                        selectedCategory === 'all'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-border'
                    )}
                >
                    All
                </button>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => onCategoryChange(cat.value)}
                        className={cn(
                            'px-4 py-2 rounded-full text-sm font-medium transition-all',
                            selectedCategory === cat.value
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-border'
                        )}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Status filter + count */}
            <div className="flex items-center gap-3">
                <div className="flex items-center bg-secondary rounded-full p-1">
                    {(['all', 'owned', 'wishlist'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => onStatusChange(status)}
                            className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize',
                                selectedStatus === status
                                    ? 'bg-card text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
            </div>
        </div>
    );
}

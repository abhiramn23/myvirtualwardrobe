'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number | null;
    onChange?: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
}

const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
};

export function StarRating({ rating, onChange, size = 'md', interactive = false }: StarRatingProps) {
    const iconSize = sizeMap[size];

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = rating !== null && star <= (rating ?? 0);
                return (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onChange?.(star)}
                        className={`transition-colors ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                    >
                        <Star
                            className={`${iconSize} ${filled ? 'text-amber-400 fill-amber-400' : 'text-border'}`}
                        />
                    </button>
                );
            })}
        </div>
    );
}

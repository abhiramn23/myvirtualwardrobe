'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Item } from '@/lib/types';

export function useCompare() {
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const supabase = createClient();

    const toggleItemSelection = (item: Item) => {
        setSelectedItems((prev) => {
            const isSelected = prev.some((i) => i.id === item.id);
            if (isSelected) {
                return prev.filter((i) => i.id !== item.id);
            }
            if (prev.length >= 2) {
                // Replace the first selected item
                return [prev[1], item];
            }
            return [...prev, item];
        });
    };

    const clearSelection = () => setSelectedItems([]);

    const isSelected = (itemId: string) => selectedItems.some((i) => i.id === itemId);

    const canCompare = selectedItems.length === 2;

    const logComparison = async () => {
        if (selectedItems.length !== 2) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('compare_logs').insert({
            user_id: user.id,
            item_1_id: selectedItems[0].id,
            item_2_id: selectedItems[1].id,
        });
    };

    return {
        selectedItems,
        toggleItemSelection,
        clearSelection,
        isSelected,
        canCompare,
        logComparison,
    };
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Outfit, Item } from '@/lib/types';

export function useOutfits() {
    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchOutfits = useCallback(async () => {
        setLoading(true);
        const { data: outfitsData, error } = await supabase
            .from('outfits')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !outfitsData) {
            setLoading(false);
            return;
        }

        // Fetch items for each outfit
        const outfitsWithItems: Outfit[] = await Promise.all(
            outfitsData.map(async (outfit) => {
                const { data: outfitItems } = await supabase
                    .from('outfit_items')
                    .select('item_id')
                    .eq('outfit_id', outfit.id);

                if (outfitItems && outfitItems.length > 0) {
                    const itemIds = outfitItems.map((oi) => oi.item_id);
                    const { data: items } = await supabase
                        .from('items')
                        .select('*')
                        .in('id', itemIds);

                    return { ...outfit, items: (items as Item[]) || [] };
                }
                return { ...outfit, items: [] };
            })
        );

        setOutfits(outfitsWithItems);
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchOutfits();
    }, [fetchOutfits]);

    const saveOutfit = async (name: string, itemIds: string[]) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: outfit, error } = await supabase
            .from('outfits')
            .insert({ name, user_id: user.id })
            .select()
            .single();

        if (error || !outfit) return null;

        const outfitItemsToInsert = itemIds.map((itemId) => ({
            outfit_id: outfit.id,
            item_id: itemId,
        }));

        await supabase.from('outfit_items').insert(outfitItemsToInsert);

        // Increment wear count for all items
        for (const itemId of itemIds) {
            const { data: item } = await supabase
                .from('items')
                .select('wear_count')
                .eq('id', itemId)
                .single();

            if (item) {
                await supabase
                    .from('items')
                    .update({ wear_count: (item.wear_count || 0) + 1 })
                    .eq('id', itemId);
            }
        }

        await fetchOutfits();
        return outfit;
    };

    const deleteOutfit = async (id: string) => {
        const { error } = await supabase.from('outfits').delete().eq('id', id);
        if (!error) {
            setOutfits((prev) => prev.filter((o) => o.id !== id));
            return true;
        }
        return false;
    };

    return {
        outfits,
        loading,
        saveOutfit,
        deleteOutfit,
        refetch: fetchOutfits,
    };
}

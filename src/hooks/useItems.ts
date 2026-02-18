'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Item, ItemCategory, ItemStatus } from '@/lib/types';

export function useItems() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchItems = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setItems(data as Item[]);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const addItem = async (item: Omit<Item, 'id' | 'user_id' | 'created_at' | 'wear_count'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('items')
            .insert({ ...item, user_id: user.id })
            .select()
            .single();

        if (!error && data) {
            setItems((prev) => [data as Item, ...prev]);
            return data as Item;
        }
        return null;
    };

    const updateItem = async (id: string, updates: Partial<Item>) => {
        const { data, error } = await supabase
            .from('items')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (!error && data) {
            setItems((prev) => prev.map((item) => (item.id === id ? (data as Item) : item)));
            return data as Item;
        }
        return null;
    };

    const deleteItem = async (id: string) => {
        const { error } = await supabase.from('items').delete().eq('id', id);
        if (!error) {
            setItems((prev) => prev.filter((item) => item.id !== id));
            return true;
        }
        return false;
    };

    const incrementWearCount = async (id: string) => {
        const item = items.find((i) => i.id === id);
        if (!item) return null;
        return updateItem(id, { wear_count: item.wear_count + 1 });
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
            .from('item-images')
            .upload(fileName, file);

        if (error) return null;

        const { data } = supabase.storage
            .from('item-images')
            .getPublicUrl(fileName);

        return data.publicUrl;
    };

    const filterItems = (category?: ItemCategory | 'all', status?: ItemStatus | 'all') => {
        return items.filter((item) => {
            const matchCategory = !category || category === 'all' || item.category === category;
            const matchStatus = !status || status === 'all' || item.status === status;
            return matchCategory && matchStatus;
        });
    };

    return {
        items,
        loading,
        addItem,
        updateItem,
        deleteItem,
        incrementWearCount,
        uploadImage,
        filterItems,
        refetch: fetchItems,
    };
}

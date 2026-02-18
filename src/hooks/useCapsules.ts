'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Capsule, Item } from '@/lib/types';

export function useCapsules() {
    const [capsules, setCapsules] = useState<Capsule[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = useMemo(() => createClient(), []);

    const fetchCapsules = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('capsules')
            .select(`
                *,
                items:items (*)
            `)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setCapsules(data as unknown as Capsule[]);
        }
        setLoading(false);
    }, [supabase]);

    const addCapsule = async (name: string, season: string, startDate?: string, endDate?: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('capsules')
            .insert({
                user_id: user.id,
                name,
                season,
                start_date: startDate || null,
                end_date: endDate || null
            })
            .select()
            .single();

        if (!error && data) {
            await fetchCapsules();
            return data;
        }
        return null;
    };

    const deleteCapsule = async (id: string) => {
        const { error } = await supabase.from('capsules').delete().eq('id', id);
        if (!error) {
            setCapsules(prev => prev.filter(c => c.id !== id));
            return true;
        }
        return false;
    };

    const addItemToCapsule = async (capsuleId: string, itemId: string) => {
        const { error } = await supabase
            .from('capsule_items')
            .insert({ capsule_id: capsuleId, item_id: itemId });

        if (!error) {
            await fetchCapsules();
            return true;
        }
        return false;
    };

    const removeItemFromCapsule = async (capsuleId: string, itemId: string) => {
        const { error } = await supabase
            .from('capsule_items')
            .delete()
            .eq('capsule_id', capsuleId)
            .eq('item_id', itemId);

        if (!error) {
            await fetchCapsules();
            return true;
        }
        return false;
    };

    useEffect(() => {
        fetchCapsules();
    }, [fetchCapsules]);

    return {
        capsules,
        loading,
        addCapsule,
        deleteCapsule,
        addItemToCapsule,
        removeItemFromCapsule,
        refetch: fetchCapsules
    };
}

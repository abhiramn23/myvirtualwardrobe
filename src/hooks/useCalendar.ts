'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { OutfitCalendarEntry, CalendarEventType } from '@/lib/types';

export function useCalendar() {
    const [entries, setEntries] = useState<OutfitCalendarEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = useMemo(() => createClient(), []);

    const fetchEntries = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('outfit_calendar')
            .select(`
                *,
                outfit:outfits (
                    *,
                    items:items (*)
                )
            `)
            .order('event_date', { ascending: true });

        if (!error && data) {
            setEntries(data as unknown as OutfitCalendarEntry[]);
        }
        setLoading(false);
    }, [supabase]);

    const addEntry = async (outfitId: string, date: string, eventType: CalendarEventType, notes?: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('outfit_calendar')
            .insert({
                user_id: user.id,
                outfit_id: outfitId,
                event_date: date,
                event_type: eventType,
                notes: notes || null,
            })
            .select()
            .single();

        if (!error && data) {
            await fetchEntries();
            return data;
        }
        return null;
    };

    const deleteEntry = async (id: string) => {
        const { error } = await supabase.from('outfit_calendar').delete().eq('id', id);
        if (!error) {
            setEntries((prev) => prev.filter((e) => e.id !== id));
            return true;
        }
        return false;
    };

    const syncWearCounts = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];

        const { data: pendingEvents, error } = await supabase
            .from('outfit_calendar')
            .select(`
                id,
                outfit:outfits (
                   items:items (id, wear_count)
                )
            `)
            .eq('is_processed', false)
            .lt('event_date', today);

        if (error || !pendingEvents || pendingEvents.length === 0) return;

        for (const event of pendingEvents) {
            const outfitItems = (event as any).outfit?.items || [];

            for (const item of outfitItems) {
                await supabase
                    .from('items')
                    .update({ wear_count: (item.wear_count || 0) + 1 })
                    .eq('id', item.id);
            }

            await supabase
                .from('outfit_calendar')
                .update({ is_processed: true })
                .eq('id', event.id);
        }

        await fetchEntries();
    }, [supabase, fetchEntries]);

    useEffect(() => {
        fetchEntries();
        syncWearCounts();
    }, [fetchEntries, syncWearCounts]);

    return {
        entries,
        loading,
        addEntry,
        deleteEntry,
        refresh: fetchEntries,
    };
}

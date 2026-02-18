'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserMeasurements } from '@/lib/types';
import { convertShoeSizeFromIndia } from '@/lib/utils';

export function useMeasurements() {
    const [measurements, setMeasurements] = useState<UserMeasurements | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchMeasurements = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data, error } = await supabase
            .from('user_measurements')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (!error && data) {
            setMeasurements(data as UserMeasurements);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchMeasurements();
    }, [fetchMeasurements]);

    const saveMeasurements = async (data: Partial<UserMeasurements>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // Auto-convert Indian shoe size
        let updates = { ...data };
        if (data.shoe_size_india !== null && data.shoe_size_india !== undefined) {
            const converted = convertShoeSizeFromIndia(data.shoe_size_india);
            updates = {
                ...updates,
                shoe_size_us: data.shoe_size_us ?? converted.us,
                shoe_size_uk: data.shoe_size_uk ?? converted.uk,
            };
        }

        if (measurements) {
            // Update existing
            const { data: updated, error } = await supabase
                .from('user_measurements')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', measurements.id)
                .select()
                .single();

            if (!error && updated) {
                setMeasurements(updated as UserMeasurements);
                return updated as UserMeasurements;
            }
        } else {
            // Insert new
            const { data: created, error } = await supabase
                .from('user_measurements')
                .insert({ ...updates, user_id: user.id })
                .select()
                .single();

            if (!error && created) {
                setMeasurements(created as UserMeasurements);
                return created as UserMeasurements;
            }
        }
        return null;
    };

    return {
        measurements,
        loading,
        saveMeasurements,
        refetch: fetchMeasurements,
    };
}

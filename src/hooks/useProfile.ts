'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserProfile, AccessRequest } from '@/lib/types';

export function useProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
    const supabase = createClient();

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (!error && data) {
            setProfile(data as UserProfile);
        } else if (error?.code === 'PGRST116') {
            // No profile yet, create one
            const { data: newProfile } = await supabase
                .from('user_profiles')
                .insert({ user_id: user.id })
                .select()
                .single();
            if (newProfile) setProfile(newProfile as UserProfile);
        }
        setLoading(false);
    }, [supabase]);

    const fetchAccessRequests = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('wardrobe_access_requests')
            .select('*')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false });

        if (data) setAccessRequests(data as AccessRequest[]);
    }, [supabase]);

    useEffect(() => {
        fetchProfile();
        fetchAccessRequests();
    }, [fetchProfile, fetchAccessRequests]);

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!profile) return null;

        const { data, error } = await supabase
            .from('user_profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', profile.id)
            .select()
            .single();

        if (!error && data) {
            setProfile(data as UserProfile);
            return data as UserProfile;
        }
        return null;
    };

    const handleAccessRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
        const { error } = await supabase
            .from('wardrobe_access_requests')
            .update({ status })
            .eq('id', requestId);

        if (!error) {
            setAccessRequests((prev) =>
                prev.map((r) => (r.id === requestId ? { ...r, status } : r))
            );
        }
    };

    const sendAccessRequest = async (ownerId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('wardrobe_access_requests')
            .insert({ requester_id: user.id, owner_id: ownerId })
            .select()
            .single();

        if (!error && data) return data as AccessRequest;
        return null;
    };

    const fetchPublicProfile = async (username: string) => {
        const { data } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('username', username)
            .eq('is_public', true)
            .single();

        return data as UserProfile | null;
    };

    const fetchPublicItems = async (userId: string) => {
        const { data } = await supabase
            .from('items')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        return data || [];
    };

    return {
        profile,
        loading,
        accessRequests,
        updateProfile,
        handleAccessRequest,
        sendAccessRequest,
        fetchPublicProfile,
        fetchPublicItems,
        refetch: fetchProfile,
    };
}

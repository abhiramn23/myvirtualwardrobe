'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { Lock, UserPlus, ShoppingBag } from 'lucide-react';
import { Item, UserProfile, CATEGORY_ICONS } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';
import { StarRating } from '@/components/wardrobe/StarRating';

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);
    const { fetchPublicProfile, fetchPublicItems, sendAccessRequest } = useProfile();
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const profile = await fetchPublicProfile(username);
            if (!profile) {
                setNotFound(true);
                setLoading(false);
                return;
            }
            setProfileData(profile);
            const publicItems = await fetchPublicItems(profile.user_id);
            setItems(publicItems as Item[]);
            setLoading(false);
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    const handleRequestAccess = async () => {
        if (!profileData) return;
        await sendAccessRequest(profileData.user_id);
        setRequestSent(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
                <Lock className="w-12 h-12 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold font-display mb-2">Profile Not Found</h1>
                <p className="text-muted-foreground max-w-md">
                    This wardrobe is private or the username doesn&apos;t exist.
                </p>
                <button
                    onClick={handleRequestAccess}
                    disabled={requestSent}
                    className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 transition-all disabled:opacity-50"
                >
                    <UserPlus className="w-4 h-4" />
                    {requestSent ? 'Request Sent!' : 'Request Access'}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-lavender/30 via-cream to-blush/20 py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl font-bold font-display mb-2">
                            {profileData?.display_name || `@${profileData?.username}`}
                        </h1>
                        {profileData?.display_name && profileData.username && (
                            <p className="text-muted-foreground">@{profileData.username}</p>
                        )}
                        {profileData?.bio && (
                            <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">{profileData.bio}</p>
                        )}
                        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                            <div>
                                <span className="font-semibold text-lg">{items.length}</span>
                                <span className="text-muted-foreground ml-1">items</span>
                            </div>
                            <div>
                                <span className="font-semibold text-lg">{items.filter((i) => i.status === 'owned').length}</span>
                                <span className="text-muted-foreground ml-1">owned</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Items Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="bg-card rounded-2xl border border-border overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="relative aspect-[3/4] bg-secondary">
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">
                                        {CATEGORY_ICONS[item.category]}
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-card/90 backdrop-blur-sm">
                                        <ShoppingBag className="w-3 h-3" />
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                                {item.brand && (
                                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm font-semibold">{formatCurrency(Number(item.price))}</span>
                                    {item.status === 'owned' && (
                                        <span className="text-xs text-muted-foreground">{item.wear_count}× worn</span>
                                    )}
                                </div>
                                {item.rating !== null && item.rating !== undefined && (
                                    <div className="mt-2">
                                        <StarRating rating={item.rating} size="sm" />
                                    </div>
                                )}
                                {item.product_link && (
                                    <a
                                        href={item.product_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-flex items-center text-xs text-primary hover:underline"
                                    >
                                        View Product →
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

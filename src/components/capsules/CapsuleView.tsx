'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    X,
    Trash2,
    Calendar,
    ShoppingBag,
    ChevronRight,
    Wind,
    Sun,
    Leaf,
    CloudSnow,
    Plane,
    Sparkles,
    Check
} from 'lucide-react';
import { useCapsules } from '@/hooks/useCapsules';
import { useItems } from '@/hooks/useItems';
import { SEASONS, Item, Capsule, Season } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';

export function CapsuleView() {
    const { capsules, loading, addCapsule, deleteCapsule, addItemToCapsule, removeItemFromCapsule } = useCapsules();
    const { items: allItems } = useItems();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isItemPickerOpen, setIsItemPickerOpen] = useState(false);
    const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);

    // Create Capsule Form
    const [newName, setNewName] = useState('');
    const [newSeason, setNewSeason] = useState<Season>(SEASONS[0]);
    const [creating, setCreating] = useState(false);

    const handleCreate = async () => {
        if (!newName) return;
        setCreating(true);
        await addCapsule(newName, newSeason);
        setCreating(false);
        setIsCreateModalOpen(false);
        setNewName('');
    };

    const getSeasonIcon = (season: string) => {
        switch (season) {
            case 'Summer': return <Sun className="w-4 h-4 text-orange-500" />;
            case 'Winter': return <CloudSnow className="w-4 h-4 text-blue-400" />;
            case 'Spring': return <Wind className="w-4 h-4 text-green-400" />;
            case 'Autumn': return <Leaf className="w-4 h-4 text-orange-600" />;
            case 'Travel': return <Plane className="w-4 h-4 text-purple-500" />;
            case 'Wedding': return <Sparkles className="w-4 h-4 text-amber-500" />;
            default: return <Calendar className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-secondary/20 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-display">Active Capsules</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    New Capsule
                </button>
            </div>

            {capsules.length === 0 ? (
                <div className="text-center py-20 bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
                    <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground">No capsules yet</h3>
                    <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto mt-2">
                        Create a seasonal capsule to organize your wardrobe into curated subsets.
                    </p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {capsules.map(capsule => (
                        <motion.div
                            key={capsule.id}
                            layoutId={capsule.id}
                            className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                        >
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-secondary/50 text-xs font-medium">
                                        {getSeasonIcon(capsule.season)}
                                        {capsule.season}
                                    </div>
                                    <button
                                        onClick={() => deleteCapsule(capsule.id)}
                                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold mb-1 truncate">{capsule.name}</h3>
                                <p className="text-xs text-muted-foreground mb-4">
                                    {capsule.items?.length || 0} items • {formatCurrency(capsule.items?.reduce((s, i) => s + Number(i.price), 0) || 0)} total
                                </p>

                                <div className="flex -space-x-3 mb-6 overflow-hidden">
                                    {capsule.items?.slice(0, 5).map(item => (
                                        <div key={item.id} className="w-10 h-10 rounded-full border-2 border-card bg-secondary overflow-hidden shrink-0">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs">🛍️</div>
                                            )}
                                        </div>
                                    ))}
                                    {(capsule.items?.length || 0) > 5 && (
                                        <div className="w-10 h-10 rounded-full border-2 border-card bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                                            +{capsule.items!.length - 5}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => { setSelectedCapsule(capsule); setIsItemPickerOpen(true); }}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-secondary hover:bg-border transition-colors text-sm font-medium"
                                >
                                    Manage Items
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Capsule Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                        />
                        <motion.div
                            className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                New Capsule
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Capsule Name</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="e.g. Summer Essentials"
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Season</label>
                                    <select
                                        value={newSeason}
                                        // Added explicit cast to Season to fix Vercel build error
                                        onChange={(e) => setNewSeason(e.target.value as Season)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    >
                                        {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <button
                                    onClick={handleCreate}
                                    disabled={!newName || creating}
                                    className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 mt-2"
                                >
                                    {creating ? 'Creating...' : 'Create Capsule'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Item Picker Modal */}
            <AnimatePresence>
                {isItemPickerOpen && selectedCapsule && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsItemPickerOpen(false)}
                        />
                        <motion.div
                            className="relative w-full max-w-2xl max-h-[80vh] bg-card border border-border rounded-2xl flex flex-col shadow-2xl overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold">{selectedCapsule.name}</h3>
                                    <p className="text-xs text-muted-foreground">Select items to include in this capsule</p>
                                </div>
                                <button
                                    onClick={() => setIsItemPickerOpen(false)}
                                    className="p-2 hover:bg-secondary rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {allItems.filter(i => i.status === 'owned').map(item => {
                                        const isInCapsule = selectedCapsule.items?.some(ci => ci.id === item.id);
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => isInCapsule ? removeItemFromCapsule(selectedCapsule.id, item.id) : addItemToCapsule(selectedCapsule.id, item.id)}
                                                className={cn(
                                                    "relative aspect-[4/5] rounded-xl border-2 transition-all cursor-pointer overflow-hidden group",
                                                    isInCapsule ? "border-primary ring-4 ring-primary/10" : "border-border hover:border-primary/40"
                                                )}
                                            >
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-secondary flex items-center justify-center text-3xl">🛍️</div>
                                                )}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-2">
                                                    <p className="text-[10px] text-white font-medium truncate">{item.title}</p>
                                                </div>

                                                {isInCapsule && (
                                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-4 bg-secondary/30 border-t border-border flex justify-end">
                                <button
                                    onClick={() => setIsItemPickerOpen(false)}
                                    className="px-6 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

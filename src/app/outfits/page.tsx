'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useItems } from '@/hooks/useItems';
import { useOutfits } from '@/hooks/useOutfits';
import { Item, ItemCategory, CATEGORIES, CATEGORY_ICONS } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, Save, Trash2, X, GripVertical } from 'lucide-react';

function DraggableItem({ item }: { item: Item }) {
    return (
        <div
            className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border cursor-grab active:cursor-grabbing card-hover"
            data-item-id={item.id}
        >
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">
                        {CATEGORY_ICONS[item.category]}
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(Number(item.price))}</p>
            </div>
            <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </div>
    );
}

export default function OutfitsPage() {
    const { items } = useItems();
    const { outfits, saveOutfit, deleteOutfit } = useOutfits();
    const [selectedItems, setSelectedItems] = useState<Record<ItemCategory, Item | null>>({
        shirts: null,
        pants: null,
        shoes: null,
        accessories: null,
    });
    const [outfitName, setOutfitName] = useState('');
    const [activeItem, setActiveItem] = useState<Item | null>(null);
    const [saving, setSaving] = useState(false);

    const ownedItems = items.filter((i) => i.status === 'owned');
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const totalCost = Object.values(selectedItems)
        .filter(Boolean)
        .reduce((sum, item) => sum + Number(item!.price), 0);

    const selectedCount = Object.values(selectedItems).filter(Boolean).length;

    const handleDragStart = (event: DragStartEvent) => {
        const item = items.find((i) => i.id === event.active.id);
        if (item) setActiveItem(item);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveItem(null);
        if (!event.over) return;

        const category = event.over.id as ItemCategory;
        const item = items.find((i) => i.id === event.active.id);
        if (item && item.category === category) {
            setSelectedItems((prev) => ({ ...prev, [category]: item }));
        }
    };

    const handleClickSelect = (item: Item) => {
        setSelectedItems((prev) => ({
            ...prev,
            [item.category]: prev[item.category]?.id === item.id ? null : item,
        }));
    };

    const handleSave = async () => {
        if (!outfitName.trim() || selectedCount === 0) return;
        setSaving(true);
        const itemIds = Object.values(selectedItems)
            .filter(Boolean)
            .map((i) => i!.id);
        await saveOutfit(outfitName, itemIds);
        setSelectedItems({ shirts: null, pants: null, shoes: null, accessories: null });
        setOutfitName('');
        setSaving(false);
    };

    const clearSelection = () => {
        setSelectedItems({ shirts: null, pants: null, shoes: null, accessories: null });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold font-display">Outfit Builder</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Drag items or click to build your perfect outfit
                </p>
            </div>

            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Item Pool */}
                    <div className="lg:col-span-2 space-y-6">
                        {CATEGORIES.map((cat) => {
                            const categoryItems = ownedItems.filter((i) => i.category === cat.value);
                            return (
                                <div key={cat.value}>
                                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <span>{CATEGORY_ICONS[cat.value]}</span> {cat.label}
                                        <span className="text-muted-foreground font-normal">({categoryItems.length})</span>
                                    </h3>
                                    {categoryItems.length === 0 ? (
                                        <p className="text-xs text-muted-foreground py-4 text-center bg-secondary rounded-xl">
                                            No owned {cat.label.toLowerCase()} yet
                                        </p>
                                    ) : (
                                        <div className="grid sm:grid-cols-2 gap-2">
                                            {categoryItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleClickSelect(item)}
                                                    className={`cursor-pointer rounded-xl transition-all ${selectedItems[item.category]?.id === item.id
                                                            ? 'ring-2 ring-primary ring-offset-2'
                                                            : ''
                                                        }`}
                                                >
                                                    <DraggableItem item={item} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Outfit Preview */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <div className="p-5 rounded-2xl border border-border bg-card">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Outfit Preview
                                    </h3>
                                    {selectedCount > 0 && (
                                        <button onClick={clearSelection} className="text-xs text-muted-foreground hover:text-foreground">
                                            Clear
                                        </button>
                                    )}
                                </div>

                                {/* Drop zones */}
                                <div className="space-y-3 mb-6">
                                    {CATEGORIES.map((cat) => {
                                        const item = selectedItems[cat.value];
                                        return (
                                            <div
                                                key={cat.value}
                                                id={cat.value}
                                                className={`p-3 rounded-xl border-2 border-dashed transition-all min-h-[60px] flex items-center ${item
                                                        ? 'border-primary/30 bg-primary/5'
                                                        : 'border-border bg-secondary/50'
                                                    }`}
                                            >
                                                {item ? (
                                                    <div className="flex items-center gap-3 w-full">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                                                            {item.image_url ? (
                                                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    {CATEGORY_ICONS[item.category]}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">{item.title}</p>
                                                            <p className="text-xs text-muted-foreground">{formatCurrency(Number(item.price))}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedItems((prev) => ({ ...prev, [cat.value]: null }))}
                                                            className="p-1 text-muted-foreground hover:text-foreground"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground w-full text-center">
                                                        {CATEGORY_ICONS[cat.value]} Drop {cat.label.toLowerCase()} here
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Total cost */}
                                {selectedCount > 0 && (
                                    <div className="flex items-center justify-between py-3 border-t border-border mb-4">
                                        <span className="text-sm font-medium">Total Cost</span>
                                        <span className="text-lg font-bold">{formatCurrency(totalCost)}</span>
                                    </div>
                                )}

                                {/* Save outfit */}
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={outfitName}
                                        onChange={(e) => setOutfitName(e.target.value)}
                                        placeholder="Name your outfit..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || selectedCount === 0 || !outfitName.trim()}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? 'Saving...' : 'Save Outfit'}
                                    </button>
                                </div>
                            </div>

                            {/* Saved outfits */}
                            {outfits.length > 0 && (
                                <div className="p-5 rounded-2xl border border-border bg-card">
                                    <h3 className="font-semibold mb-4">Saved Outfits</h3>
                                    <div className="space-y-3">
                                        {outfits.map((outfit) => (
                                            <motion.div
                                                key={outfit.id}
                                                layout
                                                className="p-3 rounded-xl bg-secondary border border-border"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium">{outfit.name}</span>
                                                    <button
                                                        onClick={() => deleteOutfit(outfit.id)}
                                                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <div className="flex gap-2">
                                                    {outfit.items?.map((item) => (
                                                        <div key={item.id} className="w-8 h-8 rounded-md overflow-hidden bg-card border border-border">
                                                            {item.image_url ? (
                                                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs">
                                                                    {CATEGORY_ICONS[item.category]}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                {outfit.items && outfit.items.length > 0 && (
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        Total: {formatCurrency(outfit.items.reduce((s, i) => s + Number(i.price), 0))}
                                                    </p>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DragOverlay>
                    {activeItem && (
                        <div className="opacity-80 w-64">
                            <DraggableItem item={activeItem} />
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

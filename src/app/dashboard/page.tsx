'use client';

import { useState } from 'react';
import { Plus, GitCompareArrows } from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { useCompare } from '@/hooks/useCompare';
import { Item, ItemCategory, ItemStatus } from '@/lib/types';
import { FilterBar } from '@/components/wardrobe/FilterBar';
import { ItemGrid } from '@/components/wardrobe/ItemGrid';
import { AddItemModal } from '@/components/wardrobe/AddItemModal';
import { EditItemModal } from '@/components/wardrobe/EditItemModal';
import { CompareModal } from '@/components/wardrobe/CompareModal';

export default function DashboardPage() {
    const { items, addItem, deleteItem, updateItem, uploadImage, filterItems } = useItems();
    const { selectedItems, toggleItemSelection, clearSelection, isSelected, canCompare, logComparison } = useCompare();
    const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
    const [selectedStatus, setSelectedStatus] = useState<ItemStatus | 'all'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [isCompareOpen, setIsCompareOpen] = useState(false);

    const filteredItems = filterItems(selectedCategory, selectedStatus);

    const handleToggleStatus = async (id: string, newStatus: 'wishlist' | 'owned') => {
        await updateItem(id, {
            status: newStatus,
            purchase_date: newStatus === 'owned' ? new Date().toISOString().split('T')[0] : null,
        });
    };

    const handleEdit = (item: Item) => {
        setEditingItem(item);
    };

    const handleSaveEdit = async (id: string, updates: Partial<Item>) => {
        // Optimistic update
        await updateItem(id, updates);
    };

    const handleCompareClick = () => {
        if (canCompare) {
            setIsCompareOpen(true);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-display">My Wardrobe</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Your personal fashion collection
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {canCompare && (
                        <button
                            onClick={handleCompareClick}
                            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-full hover:bg-border transition-all"
                        >
                            <GitCompareArrows className="w-4 h-4" />
                            Compare ({selectedItems.length})
                        </button>
                    )}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <FilterBar
                    selectedCategory={selectedCategory}
                    selectedStatus={selectedStatus}
                    onCategoryChange={setSelectedCategory}
                    onStatusChange={setSelectedStatus}
                    itemCount={filteredItems.length}
                />
            </div>

            {/* Grid */}
            <ItemGrid
                items={filteredItems}
                onDelete={deleteItem}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEdit}
                onCompareToggle={toggleItemSelection}
                isCompareSelected={isSelected}
            />

            <AddItemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={addItem}
                onUploadImage={uploadImage}
                existingItems={items}
            />

            {/* Edit Item Modal */}
            <EditItemModal
                isOpen={editingItem !== null}
                item={editingItem}
                onClose={() => setEditingItem(null)}
                onSave={handleSaveEdit}
                onUploadImage={uploadImage}
            />

            {/* Compare Modal */}
            <CompareModal
                isOpen={isCompareOpen}
                items={selectedItems}
                onClose={() => { setIsCompareOpen(false); clearSelection(); }}
                onLogComparison={logComparison}
            />
        </div>
    );
}

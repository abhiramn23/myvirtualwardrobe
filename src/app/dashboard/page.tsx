'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { ItemCategory, ItemStatus } from '@/lib/types';
import { FilterBar } from '@/components/wardrobe/FilterBar';
import { ItemGrid } from '@/components/wardrobe/ItemGrid';
import { AddItemModal } from '@/components/wardrobe/AddItemModal';

export default function DashboardPage() {
    const { items, addItem, deleteItem, updateItem, uploadImage, filterItems } = useItems();
    const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
    const [selectedStatus, setSelectedStatus] = useState<ItemStatus | 'all'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredItems = filterItems(selectedCategory, selectedStatus);

    const handleToggleStatus = async (id: string, newStatus: 'wishlist' | 'owned') => {
        await updateItem(id, {
            status: newStatus,
            purchase_date: newStatus === 'owned' ? new Date().toISOString().split('T')[0] : null,
        });
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
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:opacity-90 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add Item
                </button>
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
            />

            {/* Add Item Modal */}
            <AddItemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={addItem}
                onUploadImage={uploadImage}
            />
        </div>
    );
}

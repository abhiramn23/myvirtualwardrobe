'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES, ItemCategory, ItemStatus } from '@/lib/types';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (item: {
        title: string;
        image_url: string | null;
        price: number;
        brand: string | null;
        category: ItemCategory;
        status: ItemStatus;
        product_link: string | null;
        purchase_date: string | null;
    }) => Promise<unknown>;
    onUploadImage: (file: File) => Promise<string | null>;
}

export function AddItemModal({ isOpen, onClose, onAdd, onUploadImage }: AddItemModalProps) {
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [price, setPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState<ItemCategory>('shirts');
    const [status, setStatus] = useState<ItemStatus>('wishlist');
    const [productLink, setProductLink] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setTitle('');
        setImageUrl('');
        setImageFile(null);
        setImagePreview(null);
        setPrice('');
        setBrand('');
        setCategory('shirts');
        setStatus('wishlist');
        setProductLink('');
        setPurchaseDate('');
        setImageMode('url');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let finalImageUrl: string | null = null;

        if (imageMode === 'upload' && imageFile) {
            finalImageUrl = await onUploadImage(imageFile);
        } else if (imageMode === 'url' && imageUrl) {
            finalImageUrl = imageUrl;
        }

        await onAdd({
            title,
            image_url: finalImageUrl,
            price: parseFloat(price) || 0,
            brand: brand || null,
            category,
            status,
            product_link: productLink || null,
            purchase_date: purchaseDate || null,
        });

        resetForm();
        setLoading(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-xl"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="sticky top-0 flex items-center justify-between p-5 border-b border-border bg-card rounded-t-2xl z-10">
                            <h2 className="text-lg font-semibold">Add New Item</h2>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-5 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Classic White Oxford Shirt"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                />
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Image</label>
                                <div className="flex items-center gap-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setImageMode('url')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${imageMode === 'url' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                                            }`}
                                    >
                                        <LinkIcon className="w-3 h-3" /> URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageMode('upload')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${imageMode === 'upload' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                                            }`}
                                    >
                                        <Upload className="w-3 h-3" /> Upload
                                    </button>
                                </div>

                                {imageMode === 'url' ? (
                                    <input
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                ) : (
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full flex items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-border bg-background hover:bg-secondary text-sm text-muted-foreground transition-colors"
                                        >
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
                                            ) : (
                                                <>
                                                    <ImageIcon className="w-5 h-5" />
                                                    Click to upload image
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Price + Brand row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Price *</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Brand</label>
                                    <input
                                        type="text"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        placeholder="e.g., Zara"
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                </div>
                            </div>

                            {/* Category + Status row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category *</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as ItemCategory)}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Status *</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as ItemStatus)}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    >
                                        <option value="wishlist">Wishlist</option>
                                        <option value="owned">Owned</option>
                                    </select>
                                </div>
                            </div>

                            {/* Product Link */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Product Link</label>
                                <input
                                    type="url"
                                    value={productLink}
                                    onChange={(e) => setProductLink(e.target.value)}
                                    placeholder="https://store.com/product"
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                />
                            </div>

                            {/* Purchase Date (only for owned) */}
                            {status === 'owned' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Purchase Date</label>
                                    <input
                                        type="date"
                                        value={purchaseDate}
                                        onChange={(e) => setPurchaseDate(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mx-auto" />
                                ) : (
                                    'Add Item'
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

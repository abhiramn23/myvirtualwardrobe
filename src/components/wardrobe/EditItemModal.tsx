'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES, ItemCategory, ItemStatus, Item } from '@/lib/types';
import { StarRating } from './StarRating';

interface EditItemModalProps {
    isOpen: boolean;
    item: Item | null;
    onClose: () => void;
    onSave: (id: string, updates: Partial<Item>) => Promise<unknown>;
    onUploadImage: (file: File) => Promise<string | null>;
}

export function EditItemModal({ isOpen, item, onClose, onSave, onUploadImage }: EditItemModalProps) {
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
    const [wearCount, setWearCount] = useState('0');
    const [rating, setRating] = useState<number | null>(null);
    const [regret, setRegret] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [targetCPW, setTargetCPW] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pre-fill form when item changes
    useEffect(() => {
        if (item) {
            setTitle(item.title);
            setImageUrl(item.image_url || '');
            setPrice(String(item.price));
            setBrand(item.brand || '');
            setCategory(item.category);
            setStatus(item.status);
            setProductLink(item.product_link || '');
            setPurchaseDate(item.purchase_date || '');
            setWearCount(String(item.wear_count));
            setRating(item.rating);
            setRegret(item.regret || false);
            setReviewText(item.review_text || '');
            setTargetCPW(item.target_cp_wear ? String(item.target_cp_wear) : '');
            setImageFile(null);
            setImagePreview(null);
            setImageMode(item.image_url ? 'url' : 'url');
        }
    }, [item]);

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
        if (!item) return;
        setLoading(true);

        let finalImageUrl: string | null = item.image_url;

        if (imageMode === 'upload' && imageFile) {
            finalImageUrl = await onUploadImage(imageFile);
        } else if (imageMode === 'url' && imageUrl) {
            finalImageUrl = imageUrl;
        }

        const parsedWearCount = Math.max(0, parseInt(wearCount) || 0);

        await onSave(item.id, {
            title,
            image_url: finalImageUrl,
            price: parseFloat(price) || 0,
            brand: brand || null,
            category,
            status,
            product_link: productLink || null,
            purchase_date: purchaseDate || null,
            wear_count: parsedWearCount,
            rating: status === 'owned' ? rating : null,
            regret: status === 'owned' ? regret : false,
            review_text: status === 'owned' ? (reviewText || null) : null,
            target_cp_wear: status === 'owned' ? (parseFloat(targetCPW) || null) : null,
        });

        setLoading(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && item && (
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
                            <h2 className="text-lg font-semibold">Edit Item</h2>
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

                            {/* Wear Count */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Wear Count</label>
                                    <input
                                        type="number"
                                        value={wearCount}
                                        onChange={(e) => setWearCount(e.target.value)}
                                        min="0"
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                </div>
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
                            </div>

                            {/* Rating Section (Owned only) */}
                            {status === 'owned' && (
                                <div className="p-4 rounded-xl bg-secondary/50 space-y-4">
                                    <h3 className="text-sm font-semibold">Post-Purchase Feedback</h3>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Rating</label>
                                        <StarRating
                                            rating={rating}
                                            onChange={setRating}
                                            interactive
                                            size="lg"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="regret"
                                            checked={regret}
                                            onChange={(e) => setRegret(e.target.checked)}
                                            className="w-4 h-4 rounded border-border"
                                        />
                                        <label htmlFor="regret" className="text-sm text-muted-foreground">
                                            I regret this purchase
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Review (optional)</label>
                                        <textarea
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            placeholder="How do you feel about this purchase?"
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                                        />
                                    </div>

                                    <div className="pt-2 border-t border-border/50">
                                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                            Cost Per Wear Goal
                                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider">New</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3 text-muted-foreground">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                value={targetCPW}
                                                onChange={(e) => setTargetCPW(e.target.value)}
                                                placeholder="e.g. 5.00"
                                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                            />
                                            <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
                                                We'll track your wears until the cost-per-use reaches this target.
                                            </p>
                                        </div>
                                    </div>
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
                                    'Save Changes'
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

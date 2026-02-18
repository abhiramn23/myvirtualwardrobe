import { Item, WardrobeStats, CATEGORY_ICONS } from './types';

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

export function calculateCostPerWear(price: number, wearCount: number): number {
    if (wearCount === 0) return price;
    return price / wearCount;
}

export function calculateStats(items: Item[]): WardrobeStats {
    const totalValue = items.reduce((sum, i) => sum + Number(i.price), 0);
    const wishlistItems = items.filter((i) => i.status === 'wishlist');
    const ownedItems = items.filter((i) => i.status === 'owned');

    const wishlistValue = wishlistItems.reduce((sum, i) => sum + Number(i.price), 0);
    const ownedValue = ownedItems.reduce((sum, i) => sum + Number(i.price), 0);

    const mostWornItem =
        ownedItems.length > 0
            ? ownedItems.reduce((prev, current) => (prev.wear_count > current.wear_count ? prev : current))
            : null;

    const totalWears = ownedItems.reduce((sum, i) => sum + (i.wear_count || 0), 0);
    const averageCostPerWear = totalWears > 0 ? ownedValue / totalWears : 0;

    // Rating analytics
    const ratedItems = ownedItems.filter((i) => i.rating !== null && i.rating !== undefined);
    const averageRating =
        ratedItems.length > 0
            ? ratedItems.reduce((sum, i) => sum + (i.rating ?? 0), 0) / ratedItems.length
            : 0;

    const regrettedItems = ownedItems.filter((i) => i.regret === true);
    const mostRegrettedItem =
        regrettedItems.length > 0
            ? regrettedItems.reduce((highest, i) => (Number(i.price) > Number(highest.price) ? i : highest))
            : null;

    const brandRatings: Record<string, { total: number; count: number }> = {};
    ratedItems.forEach((item) => {
        if (item.brand) {
            if (!brandRatings[item.brand]) brandRatings[item.brand] = { total: 0, count: 0 };
            brandRatings[item.brand].total += item.rating ?? 0;
            brandRatings[item.brand].count += 1;
        }
    });

    let bestRatedBrand: string | null = null;
    let highestAvg = 0;
    Object.entries(brandRatings).forEach(([brand, data]) => {
        const avg = data.total / data.count;
        if (avg > highestAvg) {
            highestAvg = avg;
            bestRatedBrand = brand;
        }
    });

    return {
        totalValue,
        wishlistValue,
        ownedValue,
        mostWornItem,
        averageCostPerWear,
        totalItems: items.length,
        ownedItems: ownedItems.length,
        wishlistItems: wishlistItems.length,
        averageRating,
        mostRegrettedItem,
        bestRatedBrand,
    };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

/**
 * Lightweight string similarity check
 */
export function calculateSimilarity(
    item1: { title: string; brand: string | null; category: string },
    item2: { title: string; brand: string | null; category: string }
): number {
    if (item1.category !== item2.category) return 0;

    let score = 0;

    if (item1.brand && item2.brand && item1.brand.toLowerCase() === item2.brand.toLowerCase()) {
        score += 0.4;
    }

    const keywords1 = item1.title.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const keywords2 = item2.title.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    const intersection = keywords1.filter(w => keywords2.includes(w));
    const overlap = intersection.length / Math.max(keywords1.length, keywords2.length, 1);

    score += overlap * 0.6;

    return score;
}

export const COLOR_KEYWORDS = ['black', 'white', 'blue', 'brown', 'beige', 'grey', 'gray', 'red', 'green', 'yellow', 'pink', 'purple', 'navy', 'olive'];

export function convertShoeSizeFromIndia(indiaSize: number): { us: number; uk: number } {
    return {
        us: indiaSize + 1,
        uk: indiaSize,
    };
}

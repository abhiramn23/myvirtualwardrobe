import { Item, WardrobeStats } from './types';

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
    const ownedItems = items.filter((i) => i.status === 'owned');
    const wishlistItems = items.filter((i) => i.status === 'wishlist');

    const totalValue = items.reduce((sum, i) => sum + Number(i.price), 0);
    const ownedValue = ownedItems.reduce((sum, i) => sum + Number(i.price), 0);
    const wishlistValue = wishlistItems.reduce((sum, i) => sum + Number(i.price), 0);

    const mostWornItem =
        ownedItems.length > 0
            ? ownedItems.reduce((max, i) => (i.wear_count > max.wear_count ? i : max), ownedItems[0])
            : null;

    const itemsWithWears = ownedItems.filter((i) => i.wear_count > 0);
    const averageCostPerWear =
        itemsWithWears.length > 0
            ? itemsWithWears.reduce((sum, i) => sum + calculateCostPerWear(Number(i.price), i.wear_count), 0) /
            itemsWithWears.length
            : 0;

    return {
        totalValue,
        wishlistValue,
        ownedValue,
        mostWornItem,
        averageCostPerWear,
        totalItems: items.length,
        ownedItems: ownedItems.length,
        wishlistItems: wishlistItems.length,
    };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

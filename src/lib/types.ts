export type ItemCategory = 'shirts' | 'pants' | 'shoes' | 'accessories';
export type ItemStatus = 'wishlist' | 'owned';

export interface Item {
  id: string;
  user_id: string;
  title: string;
  image_url: string | null;
  price: number;
  brand: string | null;
  category: ItemCategory;
  status: ItemStatus;
  product_link: string | null;
  purchase_date: string | null;
  wear_count: number;
  created_at: string;
}

export interface Outfit {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  items?: Item[];
}

export interface OutfitItem {
  id: string;
  outfit_id: string;
  item_id: string;
}

export interface WardrobeStats {
  totalValue: number;
  wishlistValue: number;
  ownedValue: number;
  mostWornItem: Item | null;
  averageCostPerWear: number;
  totalItems: number;
  ownedItems: number;
  wishlistItems: number;
}

export const CATEGORIES: { value: ItemCategory; label: string }[] = [
  { value: 'shirts', label: 'Shirts' },
  { value: 'pants', label: 'Pants' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessories', label: 'Accessories' },
];

export const CATEGORY_ICONS: Record<ItemCategory, string> = {
  shirts: '👕',
  pants: '👖',
  shoes: '👟',
  accessories: '💍',
};

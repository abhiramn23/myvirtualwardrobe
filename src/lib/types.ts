export type ItemCategory = 'shirts' | 'pants' | 'shoes' | 'accessories' | 'kurti' | 'compare';
export type ItemStatus = 'wishlist' | 'owned';
export type RequestStatus = 'pending' | 'accepted' | 'rejected';

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
  rating: number | null;
  regret: boolean;
  review_text: string | null;
  // Phase 3 Goals
  target_cp_wear?: number | null;
  target_wear_count?: number | null;
  status_goal?: 'in_progress' | 'achieved';
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

export type CalendarEventType = 'Wedding' | 'Office' | 'Party' | 'Casual' | 'Gym' | 'Custom';

export interface OutfitCalendarEntry {
  id: string;
  user_id: string;
  outfit_id: string;
  event_date: string;
  event_type: CalendarEventType;
  notes: string | null;
  is_processed: boolean;
  created_at: string;
  outfit?: Outfit;
}

export interface Capsule {
  id: string;
  user_id: string;
  name: string;
  season: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  items?: Item[];
}

export interface CapsuleItem {
  capsule_id: string;
  item_id: string;
}

// ... existing interfaces ...

export interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserMeasurements {
  id: string;
  user_id: string;
  shoe_size_india: number | null;
  shoe_size_us: number | null;
  shoe_size_uk: number | null;
  shirt_size: string | null;
  pant_waist: number | null;
  pant_length: number | null;
  body_type: string | null;
  updated_at: string;
}

export interface AccessRequest {
  id: string;
  requester_id: string;
  owner_id: string;
  status: RequestStatus;
  created_at: string;
}

export interface CompareLog {
  id: string;
  user_id: string;
  item_1_id: string;
  item_2_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  read: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
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
  averageRating: number;
  mostRegrettedItem: Item | null;
  bestRatedBrand: string | null;
}

export const CATEGORIES: { value: ItemCategory; label: string }[] = [
  { value: 'shirts', label: 'Shirts' },
  { value: 'pants', label: 'Pants' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'kurti', label: 'Kurti' },
  { value: 'compare', label: 'Compare' },
];

export const CATEGORY_ICONS: Record<ItemCategory, string> = {
  shirts: '👕',
  pants: '👖',
  shoes: '👟',
  accessories: '💍',
  kurti: '🥻',
  compare: '⚖️',
};

export const OCCASION_TYPES = ['Wedding', 'Office', 'Party', 'Casual', 'Gym', 'Custom'] as const;
export const SEASONS = ['Winter', 'Summer', 'Spring', 'Autumn', 'Wedding', 'Travel', 'Custom'] as const;
export const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] as const;
export const BODY_TYPES = ['Slim', 'Athletic', 'Average', 'Muscular', 'Plus Size'] as const;

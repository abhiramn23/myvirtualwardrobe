-- ============================================
-- My Virtual Wardrobe — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create enums
CREATE TYPE item_category AS ENUM ('shirts', 'pants', 'shoes', 'accessories');
CREATE TYPE item_status AS ENUM ('wishlist', 'owned');

-- 2. Items table
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  brand TEXT,
  category item_category NOT NULL,
  status item_status NOT NULL DEFAULT 'wishlist',
  product_link TEXT,
  purchase_date DATE,
  wear_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Outfits table
CREATE TABLE outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Outfit-Items junction table
CREATE TABLE outfit_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_id UUID REFERENCES outfits(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(outfit_id, item_id)
);

-- 5. Create indexes for performance
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_outfits_user_id ON outfits(user_id);
CREATE INDEX idx_outfit_items_outfit_id ON outfit_items(outfit_id);
CREATE INDEX idx_outfit_items_item_id ON outfit_items(item_id);

-- 6. Enable RLS
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_items ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
CREATE POLICY "Users can view own items"
  ON items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items"
  ON items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON items FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own outfits"
  ON outfits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outfits"
  ON outfits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outfits"
  ON outfits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own outfits"
  ON outfits FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own outfit items"
  ON outfit_items FOR SELECT
  USING (outfit_id IN (SELECT id FROM outfits WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own outfit items"
  ON outfit_items FOR INSERT
  WITH CHECK (outfit_id IN (SELECT id FROM outfits WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own outfit items"
  ON outfit_items FOR DELETE
  USING (outfit_id IN (SELECT id FROM outfits WHERE user_id = auth.uid()));

-- 8. Storage bucket for item images
-- Run this separately or via Supabase dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('item-images', 'item-images', true);

-- Storage policies (run after creating bucket):
-- CREATE POLICY "Users upload own images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Public read images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'item-images');

-- CREATE POLICY "Users delete own images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);

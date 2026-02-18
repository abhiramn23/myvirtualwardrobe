-- ============================================
-- My Virtual Wardrobe — Phase 2 Migration
-- Run this in Supabase SQL Editor AFTER phase 1 schema
-- ============================================

-- ─────────────────────────────────────────────
-- 1. Extend items table with rating fields
-- ─────────────────────────────────────────────
ALTER TABLE items ADD COLUMN IF NOT EXISTS rating INT CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE items ADD COLUMN IF NOT EXISTS regret BOOLEAN DEFAULT false;
ALTER TABLE items ADD COLUMN IF NOT EXISTS review_text TEXT;

-- ─────────────────────────────────────────────
-- 2. Add new category enum values
-- ─────────────────────────────────────────────
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'kurti';
ALTER TYPE item_category ADD VALUE IF NOT EXISTS 'compare';

-- ─────────────────────────────────────────────
-- 3. User Profiles table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public profiles are viewable by anyone" ON user_profiles;
CREATE POLICY "Public profiles are viewable by anyone"
  ON user_profiles FOR SELECT
  USING (is_public = true);

-- ─────────────────────────────────────────────
-- 4. User Measurements table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_measurements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  shoe_size_india DECIMAL(4,1),
  shoe_size_us DECIMAL(4,1),
  shoe_size_uk DECIMAL(4,1),
  shirt_size TEXT, -- S/M/L/XL/XXL/custom
  pant_waist DECIMAL(5,1),
  pant_length DECIMAL(5,1),
  body_type TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_measurements_user_id ON user_measurements(user_id);

ALTER TABLE user_measurements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own measurements" ON user_measurements;
CREATE POLICY "Users can view own measurements"
  ON user_measurements FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own measurements" ON user_measurements;
CREATE POLICY "Users can insert own measurements"
  ON user_measurements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own measurements" ON user_measurements;
CREATE POLICY "Users can update own measurements"
  ON user_measurements FOR UPDATE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 5. Wardrobe Access Requests table
-- ─────────────────────────────────────────────
DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS wardrobe_access_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status request_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(requester_id, owner_id)
);

CREATE INDEX IF NOT EXISTS idx_access_requests_owner ON wardrobe_access_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_requester ON wardrobe_access_requests(requester_id);

ALTER TABLE wardrobe_access_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view requests they sent" ON wardrobe_access_requests;
CREATE POLICY "Users can view requests they sent"
  ON wardrobe_access_requests FOR SELECT
  USING (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Users can view requests they received" ON wardrobe_access_requests;
CREATE POLICY "Users can view requests they received"
  ON wardrobe_access_requests FOR SELECT
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can send access requests" ON wardrobe_access_requests;
CREATE POLICY "Users can send access requests"
  ON wardrobe_access_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Owners can update request status" ON wardrobe_access_requests;
CREATE POLICY "Owners can update request status"
  ON wardrobe_access_requests FOR UPDATE
  USING (auth.uid() = owner_id);

-- ─────────────────────────────────────────────
-- 6. Followers table (placeholder for future)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS followers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_followers_follower ON followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following ON followers(following_id);

ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own followers" ON followers;
CREATE POLICY "Users can view own followers"
  ON followers FOR SELECT
  USING (auth.uid() = following_id OR auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can follow others" ON followers;
CREATE POLICY "Users can follow others"
  ON followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow" ON followers;
CREATE POLICY "Users can unfollow"
  ON followers FOR DELETE
  USING (auth.uid() = follower_id);

-- ─────────────────────────────────────────────
-- 7. Compare Logs table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS compare_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_1_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  item_2_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_compare_logs_user ON compare_logs(user_id);

ALTER TABLE compare_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own compare logs" ON compare_logs;
CREATE POLICY "Users can view own compare logs"
  ON compare_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own compare logs" ON compare_logs;
CREATE POLICY "Users can insert own compare logs"
  ON compare_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 8. Notifications table (future - schema only)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'price_drop', 'back_in_stock', 'access_request', etc.
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 9. RLS policy for public wardrobe viewing
-- Items are viewable if the owner has is_public = true
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Public items viewable" ON items;
CREATE POLICY "Public items viewable"
  ON items FOR SELECT
  USING (
    user_id IN (
      SELECT user_id FROM user_profiles WHERE is_public = true
    )
  );

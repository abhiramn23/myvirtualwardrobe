-- ============================================
-- My Virtual Wardrobe — Phase 3 Migration
-- Advanced Engagement & Retention Features
-- ============================================

-- ─────────────────────────────────────────────
-- 1. Extend items table for Cost Per Wear Goals
-- ─────────────────────────────────────────────

-- Create goal_status type
DO $$ BEGIN
    CREATE TYPE goal_status AS ENUM ('in_progress', 'achieved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE items ADD COLUMN IF NOT EXISTS target_cp_wear NUMERIC;
ALTER TABLE items ADD COLUMN IF NOT EXISTS target_wear_count INT;
ALTER TABLE items ADD COLUMN IF NOT EXISTS status_goal goal_status DEFAULT 'in_progress';

-- Function to auto-calculate target_wear_count and update status
CREATE OR REPLACE FUNCTION set_item_goal_defaults()
RETURNS TRIGGER AS $$
BEGIN
  -- If target_cp_wear is set and price exists
  IF NEW.target_cp_wear IS NOT NULL AND NEW.target_cp_wear > 0 AND NEW.price > 0 THEN
    NEW.target_wear_count := CEIL(NEW.price / NEW.target_cp_wear);
  END IF;

  -- Update goal status based on wear_count
  IF NEW.target_wear_count IS NOT NULL AND NEW.wear_count >= NEW.target_wear_count THEN
    NEW.status_goal := 'achieved';
  ELSE
    NEW.status_goal := 'in_progress';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for goals
DROP TRIGGER IF EXISTS tr_update_item_goals ON items;
CREATE TRIGGER tr_update_item_goals
  BEFORE INSERT OR UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION set_item_goal_defaults();

-- ─────────────────────────────────────────────
-- 2. Outfit Calendar
-- ─────────────────────────────────────────────

-- Create event_type type
DO $$ BEGIN
    CREATE TYPE calendar_event_type AS ENUM ('Wedding', 'Office', 'Party', 'Casual', 'Gym', 'Custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS outfit_calendar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  outfit_id UUID REFERENCES outfits(id) ON DELETE CASCADE NOT NULL,
  event_date DATE NOT NULL,
  event_type calendar_event_type DEFAULT 'Casual',
  notes TEXT,
  is_processed BOOLEAN DEFAULT false, -- Tracks if wear count was incremented
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_outfit_calendar_user ON outfit_calendar(user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_calendar_date ON outfit_calendar(event_date);

-- RLS
ALTER TABLE outfit_calendar ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own calendar entries" ON outfit_calendar;
CREATE POLICY "Users can manage own calendar entries"
  ON outfit_calendar FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 3. Seasonal Capsules
-- ─────────────────────────────────────────────

-- Create season_type type
DO $$ BEGIN
    CREATE TYPE season_type AS ENUM ('Winter', 'Summer', 'Spring', 'Autumn', 'Wedding', 'Travel', 'Custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS capsules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  season season_type DEFAULT 'Custom',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS capsule_items (
  capsule_id UUID REFERENCES capsules(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (capsule_id, item_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_capsules_user ON capsules(user_id);
CREATE INDEX IF NOT EXISTS idx_capsule_items_capsule ON capsule_items(capsule_id);

-- RLS
ALTER TABLE capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE capsule_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own capsules" ON capsules;
CREATE POLICY "Users can manage own capsules"
  ON capsules FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own capsule items" ON capsule_items;
CREATE POLICY "Users can manage own capsule items"
  ON capsule_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM capsules 
      WHERE capsules.id = capsule_items.capsule_id 
      AND capsules.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM capsules 
      WHERE capsules.id = capsule_items.capsule_id 
      AND capsules.user_id = auth.uid()
    )
  );

-- ═══════════════════════════════════════════════════════
-- Postyn.ai — Supabase Database Schema
-- ═══════════════════════════════════════════════════════
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This sets up the tables, RLS policies, and triggers needed.

-- ── 1. User Profiles ──
-- Stores additional user info beyond what Supabase Auth holds.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  industry TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ── 2. Post History ──
-- Stores every optimization a user runs.
CREATE TABLE IF NOT EXISTS public.post_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'instagram', 'facebook', 'twitter')),
  goal TEXT NOT NULL CHECK (goal IN ('impressions', 'likes', 'followers', 'engagement')),
  original_draft TEXT NOT NULL,
  optimized_post TEXT,
  suggestions JSONB,
  suggestion_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.post_history ENABLE ROW LEVEL SECURITY;

-- Users can only access their own posts
CREATE POLICY "Users can view own posts"
  ON public.post_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts"
  ON public.post_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.post_history FOR DELETE
  USING (auth.uid() = user_id);


-- ── 3. Auto-create profile on signup ──
-- This trigger creates a profile row when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, industry)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'industry', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── 4. Indexes for performance ──
CREATE INDEX IF NOT EXISTS idx_post_history_user_id ON public.post_history(user_id);
CREATE INDEX IF NOT EXISTS idx_post_history_created_at ON public.post_history(created_at DESC);

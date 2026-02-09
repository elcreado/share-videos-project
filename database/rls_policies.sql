-- Row Level Security (RLS) Policies for VideoFeed
-- Execute these in your Supabase SQL Editor

-- ========================================
-- POLICIES FOR 'videos' TABLE
-- ========================================

-- Allow users to view all videos
CREATE POLICY "Anyone can view videos"
  ON videos FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to create their own videos
CREATE POLICY "Users can create their own videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own videos
CREATE POLICY "Users can update their own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own videos
CREATE POLICY "Users can delete their own videos"
  ON videos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ========================================
-- POLICIES FOR 'votos' TABLE
-- ========================================

-- Allow users to view all votes
CREATE POLICY "Anyone can view votes"
  ON votos FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to create their own votes
CREATE POLICY "Users can create their own votes"
  ON votos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own votes
CREATE POLICY "Users can update their own votes"
  ON votos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own votes
CREATE POLICY "Users can delete their own votes"
  ON votos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ========================================
-- POLICIES FOR 'comentarios' TABLE
-- ========================================

-- Allow users to view all comments
CREATE POLICY "Anyone can view comments"
  ON comentarios FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to create their own comments
CREATE POLICY "Users can create their own comments"
  ON comentarios FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own comments
CREATE POLICY "Users can update their own comments"
  ON comentarios FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON comentarios FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ========================================
-- POLICIES FOR 'profiles' TABLE
-- ========================================

-- Allow users to view all profiles
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

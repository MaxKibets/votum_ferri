-- Migration: Initial Schema
-- Description: Creates tables, indexes, RLS policies, and triggers for votum_ferri
-- Tables: profiles, trainings, exercises, exercise_sets

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Trainings table
CREATE TABLE IF NOT EXISTS public.trainings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  training_id UUID REFERENCES public.trainings(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Exercise sets table
CREATE TABLE IF NOT EXISTS public.exercise_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  set_number INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  rest_time INTEGER,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  -- Ensure set_number is unique within an exercise
  UNIQUE(exercise_id, set_number)
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

-- Composite index for quick user training search by date
CREATE INDEX IF NOT EXISTS trainings_user_id_date_idx ON public.trainings(user_id, date);

-- Index for sorting exercises in training
CREATE INDEX IF NOT EXISTS exercises_training_id_order_idx ON public.exercises(training_id, order_number);

-- Index for sorting sets
CREATE INDEX IF NOT EXISTS exercise_sets_exercise_id_set_number_idx ON public.exercise_sets(exercise_id, set_number);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES
-- ============================================

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Trainings policies
CREATE POLICY "Users can view own trainings"
  ON public.trainings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trainings"
  ON public.trainings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trainings"
  ON public.trainings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trainings"
  ON public.trainings FOR DELETE
  USING (auth.uid() = user_id);

-- Exercises policies
-- Users can only access exercises through their trainings
CREATE POLICY "Users can view exercises from own trainings"
  ON public.exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trainings
      WHERE trainings.id = exercises.training_id
      AND trainings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert exercises to own trainings"
  ON public.exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trainings
      WHERE trainings.id = exercises.training_id
      AND trainings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update exercises from own trainings"
  ON public.exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.trainings
      WHERE trainings.id = exercises.training_id
      AND trainings.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trainings
      WHERE trainings.id = exercises.training_id
      AND trainings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete exercises from own trainings"
  ON public.exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.trainings
      WHERE trainings.id = exercises.training_id
      AND trainings.user_id = auth.uid()
    )
  );

-- Exercise sets policies
-- Users can only access sets through their exercises/trainings
CREATE POLICY "Users can view sets from own exercises"
  ON public.exercise_sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.exercises
      INNER JOIN public.trainings ON trainings.id = exercises.training_id
      WHERE exercises.id = exercise_sets.exercise_id
      AND trainings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert sets to own exercises"
  ON public.exercise_sets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exercises
      INNER JOIN public.trainings ON trainings.id = exercises.training_id
      WHERE exercises.id = exercise_sets.exercise_id
      AND trainings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sets from own exercises"
  ON public.exercise_sets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.exercises
      INNER JOIN public.trainings ON trainings.id = exercises.training_id
      WHERE exercises.id = exercise_sets.exercise_id
      AND trainings.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exercises
      INNER JOIN public.trainings ON trainings.id = exercises.training_id
      WHERE exercises.id = exercise_sets.exercise_id
      AND trainings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sets from own exercises"
  ON public.exercise_sets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.exercises
      INNER JOIN public.trainings ON trainings.id = exercises.training_id
      WHERE exercises.id = exercise_sets.exercise_id
      AND trainings.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. CREATE FUNCTION FOR UPDATED_AT TRIGGER
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. CREATE TRIGGERS
-- ============================================

-- Trigger for profiles
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for trainings
CREATE TRIGGER set_updated_at_trainings
  BEFORE UPDATE ON public.trainings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for exercises
CREATE TRIGGER set_updated_at_exercises
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for exercise_sets
CREATE TRIGGER set_updated_at_exercise_sets
  BEFORE UPDATE ON public.exercise_sets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 7. CREATE FUNCTION TO AUTOMATICALLY CREATE PROFILE
-- ============================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Axis Tutors — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'tutor', 'student', 'parent')),
  avatar_url TEXT,
  phone TEXT,
  street_address TEXT,
  city TEXT,
  province TEXT,
  country TEXT DEFAULT 'Pakistan',
  postal_code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. TUTOR PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.tutor_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 1000,
  experience_years INTEGER DEFAULT 0,
  education TEXT,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  rating_avg NUMERIC(2,1) DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  google_calendar_token JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. STUDENT PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  grade_level TEXT,
  parent_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4. PARENT PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.parent_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. PARENT-STUDENT LINKS
-- ============================================
CREATE TABLE IF NOT EXISTS public.parent_student_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- ============================================
-- 6. SUBJECTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 7. TUTOR_SUBJECTS (junction)
-- ============================================
CREATE TABLE IF NOT EXISTS public.tutor_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  level TEXT DEFAULT 'All Levels',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tutor_id, subject_id)
);

-- ============================================
-- 8. STUDENT_SUBJECTS (junction)
-- ============================================
CREATE TABLE IF NOT EXISTS public.student_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject_id)
);

-- ============================================
-- 9. TUTOR DOCUMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.tutor_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('degree', 'cnic', 'certificate', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 10. TUTOR AVAILABILITY
-- ============================================
CREATE TABLE IF NOT EXISTS public.tutor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tutor_id, day_of_week)
);

-- ============================================
-- 11. SESSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id),
  subject_id UUID NOT NULL REFERENCES public.subjects(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN ('pending_payment', 'confirmed', 'completed', 'cancelled_student', 'cancelled_tutor', 'disputed', 'refunded')),
  hourly_rate NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL,
  tutor_payout NUMERIC(10,2) NOT NULL,
  google_event_id TEXT,
  notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 12. PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.sessions(id),
  payer_id UUID NOT NULL REFERENCES public.profiles(id),
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'authorized', 'captured', 'refunded', 'failed')),
  payment_method TEXT,
  transaction_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 13. REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) UNIQUE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 14. CHAT ROOMS
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, tutor_id)
);

-- ============================================
-- 15. MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  is_flagged BOOLEAN DEFAULT false,
  flagged_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 16. NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 17. SAVED TUTORS
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_tutors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, tutor_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_tutor_profiles_approved ON public.tutor_profiles(is_approved);
CREATE INDEX IF NOT EXISTS idx_tutor_profiles_rating ON public.tutor_profiles(rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_student ON public.sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_tutor ON public.sessions(tutor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.sessions(status);
CREATE INDEX IF NOT EXISTS idx_messages_room ON public.messages(room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- AUTO-UPDATE updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_tutor_profiles_updated_at ON public.tutor_profiles;
CREATE TRIGGER update_tutor_profiles_updated_at BEFORE UPDATE ON public.tutor_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON public.sessions;
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_tutors ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY profiles_select ON public.profiles FOR SELECT USING (true);
CREATE POLICY profiles_update ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Tutor profiles: Anyone can read approved, own can update
CREATE POLICY tutor_profiles_select ON public.tutor_profiles FOR SELECT USING (true);
CREATE POLICY tutor_profiles_insert ON public.tutor_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY tutor_profiles_update ON public.tutor_profiles FOR UPDATE USING (auth.uid() = id);

-- Student profiles: own can read/update, linked parent can read
CREATE POLICY student_profiles_select ON public.student_profiles FOR SELECT USING (
  auth.uid() = id OR
  EXISTS (SELECT 1 FROM public.parent_student_links WHERE parent_id = auth.uid() AND student_id = student_profiles.id AND status = 'approved')
);
CREATE POLICY student_profiles_insert ON public.student_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY student_profiles_update ON public.student_profiles FOR UPDATE USING (auth.uid() = id);

-- Parent profiles
CREATE POLICY parent_profiles_select ON public.parent_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY parent_profiles_insert ON public.parent_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Parent-student links
CREATE POLICY psl_select ON public.parent_student_links FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = student_id);
CREATE POLICY psl_insert ON public.parent_student_links FOR INSERT WITH CHECK (auth.uid() = parent_id);
CREATE POLICY psl_update ON public.parent_student_links FOR UPDATE USING (auth.uid() = student_id);

-- Subjects: everyone can read
CREATE POLICY subjects_select ON public.subjects FOR SELECT USING (true);

-- Tutor subjects
CREATE POLICY tutor_subjects_select ON public.tutor_subjects FOR SELECT USING (true);
CREATE POLICY tutor_subjects_insert ON public.tutor_subjects FOR INSERT WITH CHECK (auth.uid() = tutor_id);

-- Student subjects
CREATE POLICY student_subjects_select ON public.student_subjects FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY student_subjects_insert ON public.student_subjects FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Tutor documents: own tutor + admin
CREATE POLICY tutor_docs_select ON public.tutor_documents FOR SELECT USING (auth.uid() = tutor_id);
CREATE POLICY tutor_docs_insert ON public.tutor_documents FOR INSERT WITH CHECK (auth.uid() = tutor_id);

-- Tutor availability
CREATE POLICY avail_select ON public.tutor_availability FOR SELECT USING (true);
CREATE POLICY avail_insert ON public.tutor_availability FOR INSERT WITH CHECK (auth.uid() = tutor_id);
CREATE POLICY avail_update ON public.tutor_availability FOR UPDATE USING (auth.uid() = tutor_id);
CREATE POLICY avail_delete ON public.tutor_availability FOR DELETE USING (auth.uid() = tutor_id);

-- Sessions: participants can view
CREATE POLICY sessions_select ON public.sessions FOR SELECT USING (
  auth.uid() = student_id OR auth.uid() = tutor_id OR
  EXISTS (SELECT 1 FROM public.parent_student_links WHERE parent_id = auth.uid() AND student_id = sessions.student_id AND status = 'approved')
);
CREATE POLICY sessions_insert ON public.sessions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY sessions_update ON public.sessions FOR UPDATE USING (auth.uid() = student_id OR auth.uid() = tutor_id);

-- Payments
CREATE POLICY payments_select ON public.payments FOR SELECT USING (
  auth.uid() = payer_id OR
  EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = payments.session_id AND (s.student_id = auth.uid() OR s.tutor_id = auth.uid()))
);
CREATE POLICY payments_insert ON public.payments FOR INSERT WITH CHECK (auth.uid() = payer_id);

-- Reviews
CREATE POLICY reviews_select ON public.reviews FOR SELECT USING (true);
CREATE POLICY reviews_insert ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Chat rooms: participants only
CREATE POLICY rooms_select ON public.chat_rooms FOR SELECT USING (
  auth.uid() = student_id OR auth.uid() = tutor_id OR
  EXISTS (SELECT 1 FROM public.parent_student_links WHERE parent_id = auth.uid() AND student_id = chat_rooms.student_id AND status = 'approved')
);
CREATE POLICY rooms_insert ON public.chat_rooms FOR INSERT WITH CHECK (auth.uid() = student_id OR auth.uid() = tutor_id);

-- Messages: room participants (student/tutor can send, parent can read)
CREATE POLICY messages_select ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.chat_rooms r WHERE r.id = messages.room_id AND (r.student_id = auth.uid() OR r.tutor_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM public.chat_rooms r JOIN public.parent_student_links psl ON psl.student_id = r.student_id WHERE r.id = messages.room_id AND psl.parent_id = auth.uid() AND psl.status = 'approved')
);
CREATE POLICY messages_insert ON public.messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.chat_rooms r WHERE r.id = room_id AND (r.student_id = auth.uid() OR r.tutor_id = auth.uid()))
);

-- Notifications: own only
CREATE POLICY notif_select ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notif_update ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY notif_insert ON public.notifications FOR INSERT WITH CHECK (true);

-- Saved tutors
CREATE POLICY saved_select ON public.saved_tutors FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY saved_insert ON public.saved_tutors FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY saved_delete ON public.saved_tutors FOR DELETE USING (auth.uid() = student_id);

-- ============================================
-- SEED SUBJECTS
-- ============================================
INSERT INTO public.subjects (name, slug, category, icon) VALUES
  ('Mathematics', 'mathematics', 'Science', 'calculator'),
  ('Physics', 'physics', 'Science', 'atom'),
  ('Chemistry', 'chemistry', 'Science', 'flask-conical'),
  ('Biology', 'biology', 'Science', 'leaf'),
  ('Computer Science', 'computer-science', 'Science', 'monitor'),
  ('Statistics', 'statistics', 'Science', 'bar-chart'),
  ('English', 'english', 'Languages', 'book-open'),
  ('Urdu', 'urdu', 'Languages', 'pen-line'),
  ('IELTS Preparation', 'ielts-preparation', 'Languages', 'award'),
  ('SAT Preparation', 'sat-preparation', 'Languages', 'graduation-cap'),
  ('Accounts', 'accounts', 'Commerce', 'receipt'),
  ('Economics', 'economics', 'Commerce', 'trending-up'),
  ('Pakistan Studies', 'pakistan-studies', 'Arts', 'map'),
  ('Islamiat', 'islamiat', 'Arts', 'star'),
  ('O-Level Mathematics', 'o-level-mathematics', 'Science', 'calculator'),
  ('A-Level Physics', 'a-level-physics', 'Science', 'atom')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;

-- ============================================
-- SCHEMA RECONCILIATION (APP V2)
-- Keeps older installs compatible with current app code/types.
-- ============================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Karachi';

ALTER TABLE public.tutor_profiles
  ADD COLUMN IF NOT EXISTS pending_hourly_rate NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS google_refresh_token TEXT,
  ADD COLUMN IF NOT EXISTS google_calendar_id TEXT;

UPDATE public.tutor_profiles
SET google_refresh_token = COALESCE(google_refresh_token, google_calendar_token ->> 'refresh_token')
WHERE google_calendar_token IS NOT NULL;

ALTER TABLE public.student_profiles
  ADD COLUMN IF NOT EXISTS google_refresh_token TEXT,
  ADD COLUMN IF NOT EXISTS google_calendar_id TEXT;

ALTER TABLE public.parent_profiles
  ADD COLUMN IF NOT EXISTS monthly_budget NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS payment_customer_id TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'sessions'
      AND column_name = 'scheduled_at'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'sessions'
      AND column_name = 'scheduled_start'
  ) THEN
    ALTER TABLE public.sessions RENAME COLUMN scheduled_at TO scheduled_start;
  END IF;
END $$;

ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS scheduled_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS scheduled_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS actual_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS actual_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS session_link TEXT,
  ADD COLUMN IF NOT EXISTS tutor_notes TEXT,
  ADD COLUMN IF NOT EXISTS cancelled_by UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS google_event_id_tutor TEXT,
  ADD COLUMN IF NOT EXISTS google_event_id_student TEXT;

UPDATE public.sessions
SET scheduled_end = COALESCE(
  scheduled_end,
  scheduled_start + make_interval(mins => COALESCE(duration_minutes, 60))
)
WHERE scheduled_start IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tutor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  tutor_payout NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'authorized', 'captured', 'refunded', 'failed')),
  payment_gateway TEXT,
  gateway_transaction_id TEXT,
  gateway_response JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_session ON public.transactions(session_id);
CREATE INDEX IF NOT EXISTS idx_transactions_parent ON public.transactions(parent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS body TEXT,
  ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}';

UPDATE public.notifications
SET body = COALESCE(body, message)
WHERE message IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tutor_id, day_of_week, start_time, end_time)
);

INSERT INTO public.availability_slots (tutor_id, day_of_week, start_time, end_time, is_active)
SELECT tutor_id, day_of_week, start_time, end_time, is_active
FROM public.tutor_availability ta
WHERE NOT EXISTS (
  SELECT 1
  FROM public.availability_slots s
  WHERE s.tutor_id = ta.tutor_id
    AND s.day_of_week = ta.day_of_week
    AND s.start_time = ta.start_time
    AND s.end_time = ta.end_time
);

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS read_by_tutor BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS read_by_student BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS public.session_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS transactions_select ON public.transactions;
CREATE POLICY transactions_select ON public.transactions FOR SELECT USING (
  auth.uid() = parent_id OR auth.uid() = student_id OR auth.uid() = tutor_id
);

DROP POLICY IF EXISTS transactions_insert ON public.transactions;
CREATE POLICY transactions_insert ON public.transactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS availability_slots_select ON public.availability_slots;
CREATE POLICY availability_slots_select ON public.availability_slots FOR SELECT USING (true);

DROP POLICY IF EXISTS availability_slots_insert ON public.availability_slots;
CREATE POLICY availability_slots_insert ON public.availability_slots FOR INSERT WITH CHECK (auth.uid() = tutor_id);

DROP POLICY IF EXISTS availability_slots_update ON public.availability_slots;
CREATE POLICY availability_slots_update ON public.availability_slots FOR UPDATE USING (auth.uid() = tutor_id);

DROP POLICY IF EXISTS availability_slots_delete ON public.availability_slots;
CREATE POLICY availability_slots_delete ON public.availability_slots FOR DELETE USING (auth.uid() = tutor_id);

DROP POLICY IF EXISTS session_resources_select ON public.session_resources;
CREATE POLICY session_resources_select ON public.session_resources FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.sessions s
    WHERE s.id = session_resources.session_id
      AND (
        s.student_id = auth.uid()
        OR s.tutor_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.parent_student_links psl
          WHERE psl.parent_id = auth.uid()
            AND psl.student_id = s.student_id
            AND psl.status = 'approved'
        )
      )
  )
);

DROP POLICY IF EXISTS session_resources_insert ON public.session_resources;
CREATE POLICY session_resources_insert ON public.session_resources FOR INSERT WITH CHECK (auth.uid() = tutor_id);

DROP POLICY IF EXISTS blog_posts_select ON public.blog_posts;
CREATE POLICY blog_posts_select ON public.blog_posts FOR SELECT USING (is_published OR EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
));

DROP POLICY IF EXISTS blog_posts_mutate_admin ON public.blog_posts;
CREATE POLICY blog_posts_mutate_admin ON public.blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_my_child(student_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.parent_student_links
    WHERE parent_id = auth.uid()
      AND student_id = student_uuid
      AND status = 'approved'
  );
$$;

-- ============================================
-- DEMO SEED DATA (IDEMPOTENT)
-- Note: This seed uses existing auth/profile users.
-- Ensure at least one profile exists for each role: tutor, student, parent.
-- ============================================

DO $$
DECLARE
  v_admin UUID;
  v_tutor1 UUID;
  v_tutor2 UUID;
  v_student1 UUID;
  v_student2 UUID;
  v_parent1 UUID;
  v_subject_math UUID;
  v_subject_physics UUID;
  v_subject_english UUID;
  v_session_completed UUID;
  v_session_confirmed UUID;
  v_session_pending UUID;
  v_room_id UUID;
BEGIN
  SELECT id INTO v_admin FROM public.profiles WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1;
  SELECT id INTO v_tutor1 FROM public.profiles WHERE role = 'tutor' ORDER BY created_at ASC LIMIT 1;
  SELECT id INTO v_tutor2 FROM public.profiles WHERE role = 'tutor' ORDER BY created_at ASC OFFSET 1 LIMIT 1;
  SELECT id INTO v_student1 FROM public.profiles WHERE role = 'student' ORDER BY created_at ASC LIMIT 1;
  SELECT id INTO v_student2 FROM public.profiles WHERE role = 'student' ORDER BY created_at ASC OFFSET 1 LIMIT 1;
  SELECT id INTO v_parent1 FROM public.profiles WHERE role = 'parent' ORDER BY created_at ASC LIMIT 1;

  IF v_tutor1 IS NULL OR v_student1 IS NULL OR v_parent1 IS NULL THEN
    RAISE NOTICE 'Seed skipped: create at least one tutor, student, and parent user first.';
  ELSE
    -- Ensure second tutor/student fall back to first if not available
    v_tutor2 := COALESCE(v_tutor2, v_tutor1);
    v_student2 := COALESCE(v_student2, v_student1);

    -- Improve profile completeness for demo records
    UPDATE public.profiles
    SET phone = COALESCE(phone, '+92 300 1111111'),
        city = COALESCE(city, 'Lahore'),
        province = COALESCE(province, 'Punjab'),
        country = COALESCE(country, 'Pakistan'),
        timezone = COALESCE(timezone, 'Asia/Karachi')
    WHERE id IN (v_tutor1, v_tutor2, v_student1, v_student2, v_parent1);

    -- Resolve subject IDs
    SELECT id INTO v_subject_math FROM public.subjects WHERE slug = 'mathematics' LIMIT 1;
    SELECT id INTO v_subject_physics FROM public.subjects WHERE slug = 'physics' LIMIT 1;
    SELECT id INTO v_subject_english FROM public.subjects WHERE slug = 'english' LIMIT 1;

    IF v_subject_math IS NULL THEN
      SELECT id INTO v_subject_math FROM public.subjects ORDER BY created_at ASC LIMIT 1;
    END IF;
    IF v_subject_physics IS NULL THEN
      v_subject_physics := v_subject_math;
    END IF;
    IF v_subject_english IS NULL THEN
      v_subject_english := v_subject_math;
    END IF;

    -- Core role profiles
    INSERT INTO public.tutor_profiles (
      id, username, bio, hourly_rate, pending_hourly_rate, experience_years, education,
      is_approved, is_featured, rating_avg, total_sessions, total_reviews
    )
    VALUES
      (
        v_tutor1,
        'tutor-' || substr(replace(v_tutor1::text, '-', ''), 1, 8),
        'Experienced STEM tutor focused on exam preparation and concept mastery.',
        2000, 2200, 6, 'MSc Physics', true, true, 4.8, 24, 12
      ),
      (
        v_tutor2,
        'tutor-' || substr(replace(v_tutor2::text, '-', ''), 1, 8),
        'Language and communication tutor helping students improve confidence and grades.',
        1500, NULL, 4, 'MA English', true, false, 4.6, 14, 7
      )
    ON CONFLICT (id) DO UPDATE
    SET bio = EXCLUDED.bio,
        hourly_rate = EXCLUDED.hourly_rate,
        experience_years = EXCLUDED.experience_years,
        education = EXCLUDED.education,
        is_approved = EXCLUDED.is_approved;

    INSERT INTO public.student_profiles (id, date_of_birth, grade_level, parent_phone)
    VALUES
      (v_student1, DATE '2008-05-15', 'FSc Year 1', '+92 300 2222222'),
      (v_student2, DATE '2009-09-09', 'O-Level', '+92 300 2222222')
    ON CONFLICT (id) DO UPDATE
    SET grade_level = EXCLUDED.grade_level,
        parent_phone = EXCLUDED.parent_phone;

    INSERT INTO public.parent_profiles (id, monthly_budget, payment_customer_id)
    VALUES
      (v_parent1, 60000, 'cust_' || substr(replace(v_parent1::text, '-', ''), 1, 12))
    ON CONFLICT (id) DO UPDATE
    SET monthly_budget = EXCLUDED.monthly_budget;

    -- Relations
    INSERT INTO public.parent_student_links (parent_id, student_id, status)
    VALUES
      (v_parent1, v_student1, 'approved'),
      (v_parent1, v_student2, 'approved')
    ON CONFLICT (parent_id, student_id) DO UPDATE
    SET status = EXCLUDED.status;

    INSERT INTO public.tutor_subjects (tutor_id, subject_id, level)
    VALUES
      (v_tutor1, v_subject_math, 'FSc'),
      (v_tutor1, v_subject_physics, 'FSc'),
      (v_tutor2, v_subject_english, 'O-Level')
    ON CONFLICT (tutor_id, subject_id) DO UPDATE
    SET level = EXCLUDED.level;

    INSERT INTO public.student_subjects (student_id, subject_id)
    VALUES
      (v_student1, v_subject_math),
      (v_student1, v_subject_physics),
      (v_student2, v_subject_english)
    ON CONFLICT (student_id, subject_id) DO NOTHING;

    -- Tutor documents
    INSERT INTO public.tutor_documents (tutor_id, document_type, file_url, file_name, is_verified)
    SELECT v_tutor1, 'degree', 'https://example.com/docs/tutor1-degree.pdf', 'tutor1-degree.pdf', true
    WHERE NOT EXISTS (
      SELECT 1 FROM public.tutor_documents
      WHERE tutor_id = v_tutor1 AND file_name = 'tutor1-degree.pdf'
    );

    INSERT INTO public.tutor_documents (tutor_id, document_type, file_url, file_name, is_verified)
    SELECT v_tutor2, 'certificate', 'https://example.com/docs/tutor2-certificate.pdf', 'tutor2-certificate.pdf', true
    WHERE NOT EXISTS (
      SELECT 1 FROM public.tutor_documents
      WHERE tutor_id = v_tutor2 AND file_name = 'tutor2-certificate.pdf'
    );

    -- Availability (legacy + v2 table)
    INSERT INTO public.tutor_availability (tutor_id, day_of_week, start_time, end_time, is_active)
    VALUES
      (v_tutor1, 1, TIME '16:00', TIME '19:00', true),
      (v_tutor1, 3, TIME '16:00', TIME '19:00', true),
      (v_tutor2, 2, TIME '17:00', TIME '20:00', true)
    ON CONFLICT (tutor_id, day_of_week) DO UPDATE
    SET start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        is_active = EXCLUDED.is_active;

    INSERT INTO public.availability_slots (tutor_id, day_of_week, start_time, end_time, is_active)
    VALUES
      (v_tutor1, 1, TIME '16:00', TIME '18:00', true),
      (v_tutor1, 3, TIME '16:00', TIME '18:00', true),
      (v_tutor2, 2, TIME '17:00', TIME '19:00', true)
    ON CONFLICT (tutor_id, day_of_week, start_time, end_time) DO NOTHING;

    -- Sessions
    INSERT INTO public.sessions (
      student_id, tutor_id, subject_id, scheduled_start, scheduled_end,
      status, hourly_rate, total_amount, platform_fee, tutor_payout,
      session_link, tutor_notes, cancellation_reason
    )
    SELECT
      v_student1, v_tutor1, v_subject_math,
      now() - INTERVAL '3 days', now() - INTERVAL '3 days' + INTERVAL '1 hour',
      'completed', 2000, 2000, 300, 1700,
      'https://meet.example.com/axis-demo-1', 'Great progress on calculus.', NULL
    WHERE NOT EXISTS (
      SELECT 1 FROM public.sessions
      WHERE student_id = v_student1
        AND tutor_id = v_tutor1
        AND status = 'completed'
        AND scheduled_start::date = (now() - INTERVAL '3 days')::date
    );

    INSERT INTO public.sessions (
      student_id, tutor_id, subject_id, scheduled_start, scheduled_end,
      status, hourly_rate, total_amount, platform_fee, tutor_payout,
      session_link, tutor_notes, cancellation_reason
    )
    SELECT
      v_student1, v_tutor1, v_subject_physics,
      now() + INTERVAL '1 day', now() + INTERVAL '1 day 1 hour',
      'confirmed', 2200, 2200, 330, 1870,
      'https://meet.example.com/axis-demo-2', NULL, NULL
    WHERE NOT EXISTS (
      SELECT 1 FROM public.sessions
      WHERE student_id = v_student1
        AND tutor_id = v_tutor1
        AND status = 'confirmed'
        AND scheduled_start::date = (now() + INTERVAL '1 day')::date
    );

    INSERT INTO public.sessions (
      student_id, tutor_id, subject_id, scheduled_start, scheduled_end,
      status, hourly_rate, total_amount, platform_fee, tutor_payout,
      session_link, tutor_notes, cancellation_reason
    )
    SELECT
      v_student2, v_tutor2, v_subject_english,
      now() + INTERVAL '2 days', now() + INTERVAL '2 days 1 hour',
      'pending_payment', 1500, 1500, 225, 1275,
      'https://meet.example.com/axis-demo-3', NULL, NULL
    WHERE NOT EXISTS (
      SELECT 1 FROM public.sessions
      WHERE student_id = v_student2
        AND tutor_id = v_tutor2
        AND status = 'pending_payment'
        AND scheduled_start::date = (now() + INTERVAL '2 days')::date
    );

    -- Capture session ids for dependent seeds
    SELECT id INTO v_session_completed
    FROM public.sessions
    WHERE student_id = v_student1 AND tutor_id = v_tutor1 AND status = 'completed'
    ORDER BY scheduled_start DESC
    LIMIT 1;

    SELECT id INTO v_session_confirmed
    FROM public.sessions
    WHERE student_id = v_student1 AND tutor_id = v_tutor1 AND status = 'confirmed'
    ORDER BY scheduled_start DESC
    LIMIT 1;

    SELECT id INTO v_session_pending
    FROM public.sessions
    WHERE student_id = v_student2 AND tutor_id = v_tutor2 AND status = 'pending_payment'
    ORDER BY scheduled_start DESC
    LIMIT 1;

    -- Payments (legacy table)
    IF v_session_confirmed IS NOT NULL THEN
      INSERT INTO public.payments (session_id, payer_id, amount, status, payment_method, transaction_id)
      SELECT v_session_confirmed, v_parent1, 2200, 'authorized', 'mock', 'pay_' || substr(replace(v_session_confirmed::text, '-', ''), 1, 12)
      WHERE NOT EXISTS (
        SELECT 1 FROM public.payments WHERE session_id = v_session_confirmed AND status = 'authorized'
      );
    END IF;

    IF v_session_completed IS NOT NULL THEN
      INSERT INTO public.payments (session_id, payer_id, amount, status, payment_method, transaction_id)
      SELECT v_session_completed, v_parent1, 2000, 'captured', 'mock', 'pay_' || substr(replace(v_session_completed::text, '-', ''), 1, 12)
      WHERE NOT EXISTS (
        SELECT 1 FROM public.payments WHERE session_id = v_session_completed AND status = 'captured'
      );
    END IF;

    -- Transactions (v2 table)
    IF v_session_confirmed IS NOT NULL THEN
      INSERT INTO public.transactions (
        session_id, parent_id, student_id, tutor_id,
        amount, platform_fee, tutor_payout,
        status, payment_gateway, gateway_transaction_id, gateway_response
      )
      SELECT
        v_session_confirmed, v_parent1, v_student1, v_tutor1,
        2200, 330, 1870,
        'authorized', 'mock',
        'auth_' || substr(replace(v_session_confirmed::text, '-', ''), 1, 12),
        '{"seed": true}'::jsonb
      WHERE NOT EXISTS (
        SELECT 1 FROM public.transactions WHERE session_id = v_session_confirmed AND status = 'authorized'
      );
    END IF;

    IF v_session_completed IS NOT NULL THEN
      INSERT INTO public.transactions (
        session_id, parent_id, student_id, tutor_id,
        amount, platform_fee, tutor_payout,
        status, payment_gateway, gateway_transaction_id, gateway_response
      )
      SELECT
        v_session_completed, v_parent1, v_student1, v_tutor1,
        2000, 300, 1700,
        'captured', 'mock',
        'cap_' || substr(replace(v_session_completed::text, '-', ''), 1, 12),
        '{"seed": true}'::jsonb
      WHERE NOT EXISTS (
        SELECT 1 FROM public.transactions WHERE session_id = v_session_completed AND status = 'captured'
      );
    END IF;

    -- Review
    IF v_session_completed IS NOT NULL THEN
      INSERT INTO public.reviews (session_id, reviewer_id, tutor_id, rating, comment, is_visible)
      SELECT v_session_completed, v_student1, v_tutor1, 5, 'Great teaching style and clear explanations.', true
      WHERE NOT EXISTS (
        SELECT 1 FROM public.reviews WHERE session_id = v_session_completed
      );
    END IF;

    -- Chat + messages
    INSERT INTO public.chat_rooms (student_id, tutor_id)
    VALUES (v_student1, v_tutor1)
    ON CONFLICT (student_id, tutor_id) DO NOTHING;

    SELECT id INTO v_room_id
    FROM public.chat_rooms
    WHERE student_id = v_student1 AND tutor_id = v_tutor1
    LIMIT 1;

    IF v_room_id IS NOT NULL THEN
      INSERT INTO public.messages (room_id, sender_id, content, is_flagged, read_by_tutor, read_by_student)
      SELECT v_room_id, v_student1, 'Hi Sir, can we revise chapter 5 tomorrow?', false, false, true
      WHERE NOT EXISTS (
        SELECT 1 FROM public.messages
        WHERE room_id = v_room_id AND content = 'Hi Sir, can we revise chapter 5 tomorrow?'
      );

      INSERT INTO public.messages (room_id, sender_id, content, is_flagged, read_by_tutor, read_by_student)
      SELECT v_room_id, v_tutor1, 'Sure, we will cover chapter 5 and solve past paper questions.', false, true, false
      WHERE NOT EXISTS (
        SELECT 1 FROM public.messages
        WHERE room_id = v_room_id AND content = 'Sure, we will cover chapter 5 and solve past paper questions.'
      );
    END IF;

    -- Notifications
    INSERT INTO public.notifications (user_id, type, title, message, body, data, is_read)
    SELECT
      v_parent1,
      'session_booking_request',
      'Payment approval needed',
      'A new tutoring session requires your approval.',
      'A new tutoring session requires your approval.',
      jsonb_build_object('studentId', v_student2, 'sessionId', v_session_pending),
      false
    WHERE NOT EXISTS (
      SELECT 1 FROM public.notifications
      WHERE user_id = v_parent1 AND type = 'session_booking_request' AND title = 'Payment approval needed'
    );

    INSERT INTO public.notifications (user_id, type, title, message, body, data, is_read)
    SELECT
      v_student1,
      'session_confirmed',
      'Session confirmed',
      'Your next session has been confirmed by your parent.',
      'Your next session has been confirmed by your parent.',
      jsonb_build_object('sessionId', v_session_confirmed),
      false
    WHERE NOT EXISTS (
      SELECT 1 FROM public.notifications
      WHERE user_id = v_student1 AND type = 'session_confirmed' AND title = 'Session confirmed'
    );

    -- Saved tutors
    INSERT INTO public.saved_tutors (student_id, tutor_id)
    VALUES
      (v_student1, v_tutor1),
      (v_student2, v_tutor2)
    ON CONFLICT (student_id, tutor_id) DO NOTHING;

    -- Session resources
    IF v_session_completed IS NOT NULL THEN
      INSERT INTO public.session_resources (session_id, tutor_id, file_url, file_name, file_type)
      SELECT
        v_session_completed,
        v_tutor1,
        'https://example.com/resources/calculus-worksheet.pdf',
        'calculus-worksheet.pdf',
        'application/pdf'
      WHERE NOT EXISTS (
        SELECT 1 FROM public.session_resources
        WHERE session_id = v_session_completed AND file_name = 'calculus-worksheet.pdf'
      );
    END IF;

    -- Blog posts
    INSERT INTO public.blog_posts (
      title, slug, content, excerpt, cover_image_url, author_id, tags, is_published, published_at
    )
    VALUES
      (
        'How to Prepare for Board Exams in 60 Days',
        'board-exam-60-day-plan',
        'A practical 60-day study framework for Pakistani board exams.',
        'A practical 60-day study framework for Pakistani board exams.',
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
        COALESCE(v_admin, v_tutor1),
        ARRAY['Study Tips', 'Board Exams'],
        true,
        now() - INTERVAL '5 days'
      ),
      (
        'Choosing the Right Tutor: Parent Checklist',
        'parent-checklist-right-tutor',
        'A quick checklist parents can use before booking tutoring sessions.',
        'A quick checklist parents can use before booking tutoring sessions.',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
        COALESCE(v_admin, v_tutor1),
        ARRAY['Parents', 'Tutoring'],
        true,
        now() - INTERVAL '2 days'
      )
    ON CONFLICT (slug) DO NOTHING;

    RAISE NOTICE 'Demo seed completed successfully.';
  END IF;
END $$;

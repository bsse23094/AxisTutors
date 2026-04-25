-- ============================================
-- Axis Tutors Demo Seed Data
-- ============================================
-- Run after supabase/migration.sql.
-- This script is idempotent and works even if only some demo profiles already exist.

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

INSERT INTO public.blog_posts (
  title, slug, content, excerpt, cover_image_url, author_id, tags, is_published, published_at
) VALUES
  (
    'How to Prepare for Board Exams in 60 Days',
    'board-exam-60-day-plan',
    'A practical 60-day study framework for Pakistani board exams.',
    'A practical 60-day study framework for Pakistani board exams.',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    NULL,
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
    NULL,
    ARRAY['Parents', 'Tutoring'],
    true,
    now() - INTERVAL '2 days'
  )
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  v_admin_id UUID := '11111111-1111-1111-1111-111111111111';
  v_tutor_id UUID := '22222222-2222-2222-2222-222222222222';
  v_student_id UUID := '33333333-3333-3333-3333-333333333333';
  v_parent_id UUID := '44444444-4444-4444-4444-444444444444';
  v_subject_math UUID;
  v_subject_physics UUID;
  v_subject_english UUID;
  v_completed_session_id UUID;
  v_confirmed_session_id UUID;
  v_room_id UUID;
BEGIN
  -- Nuke child data first to prevent foreign key constraint violations
  DELETE FROM public.notifications WHERE user_id IN (v_admin_id, v_tutor_id, v_student_id, v_parent_id);
  DELETE FROM public.transactions WHERE student_id = v_student_id OR tutor_id = v_tutor_id;
  DELETE FROM public.payments WHERE payer_id = v_parent_id;
  DELETE FROM public.session_resources WHERE tutor_id = v_tutor_id;
  DELETE FROM public.reviews WHERE reviewer_id = v_student_id OR tutor_id = v_tutor_id;
  DELETE FROM public.messages WHERE sender_id IN (v_admin_id, v_tutor_id, v_student_id, v_parent_id);
  DELETE FROM public.chat_rooms WHERE student_id = v_student_id OR tutor_id = v_tutor_id;
  DELETE FROM public.sessions WHERE student_id = v_student_id OR tutor_id = v_tutor_id;
  DELETE FROM public.parent_student_links WHERE parent_id = v_parent_id OR student_id = v_student_id;
  DELETE FROM public.saved_tutors WHERE student_id = v_student_id OR tutor_id = v_tutor_id;
  DELETE FROM public.student_subjects WHERE student_id = v_student_id;
  DELETE FROM public.tutor_subjects WHERE tutor_id = v_tutor_id;
  
  -- Nuke auth identities
  DELETE FROM auth.identities WHERE user_id IN (v_admin_id, v_tutor_id, v_student_id, v_parent_id);

  -- Nuke any existing dummy users to clear corrupted state (this cascades to profiles)
  DELETE FROM auth.users WHERE id IN (v_admin_id, v_tutor_id, v_student_id, v_parent_id);

  -- Insert dummy auth users so we don't rely on the user to create them manually
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES
    (v_admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@axistutors.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin User", "role":"admin"}', now(), now()),
    (v_tutor_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tutor@axistutors.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Demo Tutor", "role":"tutor"}', now(), now()),
    (v_student_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'student@axistutors.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Demo Student", "role":"student"}', now(), now()),
    (v_parent_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'parent@axistutors.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Demo Parent", "role":"parent"}', now(), now())
  ON CONFLICT (id) DO UPDATE SET
    raw_app_meta_data = EXCLUDED.raw_app_meta_data,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

  -- Insert auth identities for email login
  INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
  VALUES
    (v_admin_id, v_admin_id::text, v_admin_id, format('{"sub":"%s","email":"%s"}', v_admin_id::text, 'admin@axistutors.com')::jsonb, 'email', now(), now()),
    (v_tutor_id, v_tutor_id::text, v_tutor_id, format('{"sub":"%s","email":"%s"}', v_tutor_id::text, 'tutor@axistutors.com')::jsonb, 'email', now(), now()),
    (v_student_id, v_student_id::text, v_student_id, format('{"sub":"%s","email":"%s"}', v_student_id::text, 'student@axistutors.com')::jsonb, 'email', now(), now()),
    (v_parent_id, v_parent_id::text, v_parent_id, format('{"sub":"%s","email":"%s"}', v_parent_id::text, 'parent@axistutors.com')::jsonb, 'email', now(), now())
  ON CONFLICT DO NOTHING;

  -- The auth.users trigger automatically creates the public.profiles. We just need to update them.
  UPDATE public.profiles
  SET phone = COALESCE(phone, '+92 300 1111111'),
      city = COALESCE(city, 'Lahore'),
      province = COALESCE(province, 'Punjab'),
      country = COALESCE(country, 'Pakistan')
  WHERE id IN (v_admin_id, v_tutor_id, v_student_id, v_parent_id);

  -- Set roles explicitly just in case
  UPDATE public.profiles SET role = 'admin' WHERE id = v_admin_id;
  UPDATE public.profiles SET role = 'tutor' WHERE id = v_tutor_id;
  UPDATE public.profiles SET role = 'student' WHERE id = v_student_id;
  UPDATE public.profiles SET role = 'parent' WHERE id = v_parent_id;

  SELECT id INTO v_subject_math FROM public.subjects WHERE slug = 'mathematics' LIMIT 1;
  SELECT id INTO v_subject_physics FROM public.subjects WHERE slug = 'physics' LIMIT 1;
  SELECT id INTO v_subject_english FROM public.subjects WHERE slug = 'english' LIMIT 1;

  -- Tutor Profile
  INSERT INTO public.tutor_profiles (
    id, username, bio, hourly_rate, experience_years, education,
    is_approved, is_featured, rating_avg, total_sessions, total_reviews
  )
  VALUES (
    v_tutor_id,
    'tutor-' || substr(replace(v_tutor_id::text, '-', ''), 1, 8),
    'Experienced STEM tutor focused on exam preparation and concept mastery.',
    2000, 6, 'MSc Physics', true, true, 4.8, 24, 12
  )
  ON CONFLICT (id) DO UPDATE
  SET bio = EXCLUDED.bio,
      hourly_rate = EXCLUDED.hourly_rate,
      experience_years = EXCLUDED.experience_years,
      education = EXCLUDED.education,
      is_approved = EXCLUDED.is_approved,
      is_featured = EXCLUDED.is_featured,
      rating_avg = EXCLUDED.rating_avg,
      total_sessions = EXCLUDED.total_sessions,
      total_reviews = EXCLUDED.total_reviews;

  INSERT INTO public.tutor_documents (tutor_id, document_type, file_url, file_name, is_verified)
  SELECT v_tutor_id, 'degree', 'https://example.com/docs/tutor1-degree.pdf', 'tutor1-degree.pdf', true
  WHERE NOT EXISTS (
    SELECT 1 FROM public.tutor_documents td
    WHERE td.tutor_id = v_tutor_id AND td.file_name = 'tutor1-degree.pdf'
  );

  INSERT INTO public.tutor_availability (tutor_id, day_of_week, start_time, end_time, is_active)
  VALUES
    (v_tutor_id, 1, TIME '16:00', TIME '19:00', true),
    (v_tutor_id, 3, TIME '16:00', TIME '19:00', true)
  ON CONFLICT (tutor_id, day_of_week) DO UPDATE
  SET start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time,
      is_active = EXCLUDED.is_active;

  INSERT INTO public.availability_slots (tutor_id, day_of_week, start_time, end_time, is_active)
  VALUES
    (v_tutor_id, 1, TIME '16:00', TIME '18:00', true),
    (v_tutor_id, 3, TIME '16:00', TIME '18:00', true)
  ON CONFLICT (tutor_id, day_of_week, start_time, end_time) DO NOTHING;

  IF v_subject_math IS NOT NULL THEN
    INSERT INTO public.tutor_subjects (tutor_id, subject_id, level)
    VALUES (v_tutor_id, v_subject_math, 'FSc')
    ON CONFLICT (tutor_id, subject_id) DO UPDATE SET level = EXCLUDED.level;
  END IF;

  IF v_subject_physics IS NOT NULL THEN
    INSERT INTO public.tutor_subjects (tutor_id, subject_id, level)
    VALUES (v_tutor_id, v_subject_physics, 'FSc')
    ON CONFLICT (tutor_id, subject_id) DO UPDATE SET level = EXCLUDED.level;
  END IF;

  -- Student Profile
  INSERT INTO public.student_profiles (id, date_of_birth, grade_level, parent_phone)
  VALUES (v_student_id, DATE '2008-05-15', 'FSc Year 1', '+92 300 2222222')
  ON CONFLICT (id) DO UPDATE
  SET date_of_birth = EXCLUDED.date_of_birth,
      grade_level = EXCLUDED.grade_level,
      parent_phone = EXCLUDED.parent_phone;

  IF v_subject_math IS NOT NULL THEN
    INSERT INTO public.student_subjects (student_id, subject_id)
    VALUES (v_student_id, v_subject_math)
    ON CONFLICT (student_id, subject_id) DO NOTHING;
  END IF;

  IF v_subject_physics IS NOT NULL THEN
    INSERT INTO public.student_subjects (student_id, subject_id)
    VALUES (v_student_id, v_subject_physics)
    ON CONFLICT (student_id, subject_id) DO NOTHING;
  END IF;

  IF v_subject_english IS NOT NULL THEN
    INSERT INTO public.student_subjects (student_id, subject_id)
    VALUES (v_student_id, v_subject_english)
    ON CONFLICT (student_id, subject_id) DO NOTHING;
  END IF;

  INSERT INTO public.saved_tutors (student_id, tutor_id)
  VALUES (v_student_id, v_tutor_id)
  ON CONFLICT (student_id, tutor_id) DO NOTHING;

  -- Parent Profile
  INSERT INTO public.parent_profiles (id)
  VALUES (v_parent_id)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.parent_student_links (parent_id, student_id, status)
  VALUES (v_parent_id, v_student_id, 'approved')
  ON CONFLICT (parent_id, student_id) DO UPDATE
  SET status = EXCLUDED.status;

  -- Sessions
  IF v_subject_math IS NOT NULL THEN
    INSERT INTO public.sessions (
      student_id, tutor_id, subject_id, scheduled_start, scheduled_end,
      status, hourly_rate, total_amount, platform_fee, tutor_payout,
      session_link, tutor_notes, cancellation_reason
    )
    SELECT
      v_student_id, v_tutor_id, v_subject_math,
      now() - INTERVAL '3 days', now() - INTERVAL '3 days' + INTERVAL '1 hour',
      'completed', 2000, 2000, 300, 1700,
      'https://meet.example.com/axis-demo-' || substr(replace(v_tutor_id::text, '-', ''), 1, 8),
      'Great progress on calculus.', NULL
    WHERE NOT EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.student_id = v_student_id
        AND s.tutor_id = v_tutor_id
        AND s.status = 'completed'
        AND s.scheduled_start::date = (now() - INTERVAL '3 days')::date
    );

    INSERT INTO public.sessions (
      student_id, tutor_id, subject_id, scheduled_start, scheduled_end,
      status, hourly_rate, total_amount, platform_fee, tutor_payout,
      session_link, tutor_notes, cancellation_reason
    )
    SELECT
      v_student_id, v_tutor_id, v_subject_physics,
      now() + INTERVAL '1 day', now() + INTERVAL '1 day' + INTERVAL '1 hour',
      'confirmed', 2200, 2200, 330, 1870,
      'https://meet.example.com/axis-demo-' || substr(replace(v_tutor_id::text, '-', ''), 1, 8) || '-2',
      NULL, NULL
    WHERE v_subject_physics IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.sessions s
        WHERE s.student_id = v_student_id
          AND s.tutor_id = v_tutor_id
          AND s.status = 'confirmed'
          AND s.scheduled_start::date = (now() + INTERVAL '1 day')::date
      );

    SELECT s.id INTO v_completed_session_id
    FROM public.sessions s
    WHERE s.student_id = v_student_id
      AND s.tutor_id = v_tutor_id
      AND s.status = 'completed'
    ORDER BY s.scheduled_start DESC
    LIMIT 1;

    SELECT s.id INTO v_confirmed_session_id
    FROM public.sessions s
    WHERE s.student_id = v_student_id
      AND s.tutor_id = v_tutor_id
      AND s.status = 'confirmed'
    ORDER BY s.scheduled_start DESC
    LIMIT 1;

    INSERT INTO public.chat_rooms (student_id, tutor_id)
    VALUES (v_student_id, v_tutor_id)
    ON CONFLICT (student_id, tutor_id) DO NOTHING;

    SELECT cr.id INTO v_room_id
    FROM public.chat_rooms cr
    WHERE cr.student_id = v_student_id
      AND cr.tutor_id = v_tutor_id
    LIMIT 1;

    IF v_room_id IS NOT NULL THEN
      INSERT INTO public.messages (room_id, sender_id, content, is_flagged, read_by_tutor, read_by_student)
      SELECT v_room_id, v_student_id, 'Hi Sir, can we revise chapter 5 tomorrow?', false, false, true
      WHERE NOT EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.room_id = v_room_id AND m.content = 'Hi Sir, can we revise chapter 5 tomorrow?'
      );

      INSERT INTO public.messages (room_id, sender_id, content, is_flagged, read_by_tutor, read_by_student)
      SELECT v_room_id, v_tutor_id, 'Sure, we will cover chapter 5 and solve past paper questions.', false, true, false
      WHERE NOT EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.room_id = v_room_id AND m.content = 'Sure, we will cover chapter 5 and solve past paper questions.'
      );
    END IF;

    IF v_completed_session_id IS NOT NULL THEN
      INSERT INTO public.reviews (session_id, reviewer_id, tutor_id, rating, comment, is_visible)
      SELECT v_completed_session_id, v_student_id, v_tutor_id, 5, 'Great teaching style and clear explanations.', true
      WHERE NOT EXISTS (
        SELECT 1 FROM public.reviews r WHERE r.session_id = v_completed_session_id
      );

      INSERT INTO public.session_resources (session_id, tutor_id, file_url, file_name, file_type)
      SELECT
        v_completed_session_id,
        v_tutor_id,
        'https://example.com/resources/calculus-worksheet.pdf',
        'calculus-worksheet.pdf',
        'application/pdf'
      WHERE NOT EXISTS (
        SELECT 1 FROM public.session_resources sr
        WHERE sr.session_id = v_completed_session_id
          AND sr.file_name = 'calculus-worksheet.pdf'
      );
    END IF;

    IF v_confirmed_session_id IS NOT NULL THEN
      INSERT INTO public.payments (session_id, payer_id, amount, status, payment_method, transaction_id)
      SELECT
        v_confirmed_session_id,
        v_parent_id,
        2200,
        'authorized',
        'mock',
        'pay_' || substr(replace(v_confirmed_session_id::text, '-', ''), 1, 12)
      WHERE NOT EXISTS (
        SELECT 1 FROM public.payments p WHERE p.session_id = v_confirmed_session_id AND p.status = 'authorized'
      );

      INSERT INTO public.transactions (
        session_id, parent_id, student_id, tutor_id,
        amount, platform_fee, tutor_payout,
        status, payment_gateway, gateway_transaction_id, gateway_response
      )
      SELECT
        v_confirmed_session_id,
        v_parent_id,
        v_student_id,
        v_tutor_id,
        2200, 330, 1870,
        'authorized', 'mock',
        'auth_' || substr(replace(v_confirmed_session_id::text, '-', ''), 1, 12),
        '{"seed": true}'::jsonb
      WHERE NOT EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE t.session_id = v_confirmed_session_id AND t.status = 'authorized'
      );
    END IF;

    IF v_completed_session_id IS NOT NULL THEN
      INSERT INTO public.payments (session_id, payer_id, amount, status, payment_method, transaction_id)
      SELECT
        v_completed_session_id,
        v_parent_id,
        2000,
        'captured',
        'mock',
        'pay_' || substr(replace(v_completed_session_id::text, '-', ''), 1, 12)
      WHERE NOT EXISTS (
        SELECT 1 FROM public.payments p WHERE p.session_id = v_completed_session_id AND p.status = 'captured'
      );

      INSERT INTO public.transactions (
        session_id, parent_id, student_id, tutor_id,
        amount, platform_fee, tutor_payout,
        status, payment_gateway, gateway_transaction_id, gateway_response
      )
      SELECT
        v_completed_session_id,
        v_parent_id,
        v_student_id,
        v_tutor_id,
        2000, 300, 1700,
        'captured', 'mock',
        'cap_' || substr(replace(v_completed_session_id::text, '-', ''), 1, 12),
        '{"seed": true}'::jsonb
      WHERE NOT EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE t.session_id = v_completed_session_id AND t.status = 'captured'
      );
    END IF;

    INSERT INTO public.notifications (user_id, type, title, message, link, is_read)
    SELECT
      v_parent_id,
      'session_booking_request',
      'Payment approval needed',
      'A new tutoring session requires your approval.',
      '/parent/payments',
      false
    WHERE NOT EXISTS (
      SELECT 1 FROM public.notifications n
      WHERE n.user_id = v_parent_id AND n.type = 'session_booking_request'
    );

    INSERT INTO public.notifications (user_id, type, title, message, link, is_read)
    SELECT
      v_student_id,
      'session_confirmed',
      'Session confirmed',
      'Your next session has been confirmed.',
      '/student',
      false
    WHERE NOT EXISTS (
      SELECT 1 FROM public.notifications n
      WHERE n.user_id = v_student_id AND n.type = 'session_confirmed'
    );
  END IF;

  RAISE NOTICE 'Demo seed completed successfully.';
END $$;
// This file should be regenerated via: supabase gen types typescript --project-id YOUR_ID > types/database.ts
// For now, this is a manual type definition matching the schema from the spec.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'tutor' | 'student' | 'parent'
          full_name: string
          email: string
          phone: string | null
          avatar_url: string | null
          street_address: string | null
          city: string | null
          province: string | null
          country: string | null
          postal_code: string | null
          timezone: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at' | 'is_active' | 'timezone' | 'country'> & {
          is_active?: boolean
          timezone?: string
          country?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      tutor_profiles: {
        Row: {
          id: string
          bio: string | null
          hourly_rate: number
          pending_hourly_rate: number | null
          experience_years: number
          education: string | null
          is_approved: boolean
          is_featured: boolean
          rating_avg: number
          total_sessions: number
          google_refresh_token: string | null
          google_calendar_id: string | null
          username: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tutor_profiles']['Row'], 'created_at' | 'is_approved' | 'is_featured' | 'rating_avg' | 'total_sessions' | 'experience_years' | 'hourly_rate'> & {
          hourly_rate?: number
          experience_years?: number
          is_approved?: boolean
          is_featured?: boolean
          rating_avg?: number
          total_sessions?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['tutor_profiles']['Insert']>
      }
      student_profiles: {
        Row: {
          id: string
          date_of_birth: string | null
          grade_level: string | null
          parent_phone: string
          google_refresh_token: string | null
          google_calendar_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['student_profiles']['Row'], 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['student_profiles']['Insert']>
      }
      parent_profiles: {
        Row: {
          id: string
          monthly_budget: number | null
          payment_customer_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['parent_profiles']['Row'], 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['parent_profiles']['Insert']>
      }
      parent_student_links: {
        Row: {
          id: string
          parent_id: string
          student_id: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['parent_student_links']['Row'], 'id' | 'created_at' | 'status'> & {
          id?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['parent_student_links']['Insert']>
      }
      subjects: {
        Row: {
          id: string
          name: string
          slug: string
          category: string | null
          icon: string | null
          description: string | null
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['subjects']['Row'], 'id' | 'is_active'> & {
          id?: string
          is_active?: boolean
        }
        Update: Partial<Database['public']['Tables']['subjects']['Insert']>
      }
      tutor_subjects: {
        Row: {
          tutor_id: string
          subject_id: string
          level: string | null
        }
        Insert: Database['public']['Tables']['tutor_subjects']['Row']
        Update: Partial<Database['public']['Tables']['tutor_subjects']['Insert']>
      }
      student_subjects: {
        Row: {
          student_id: string
          subject_id: string
        }
        Insert: Database['public']['Tables']['student_subjects']['Row']
        Update: Partial<Database['public']['Tables']['student_subjects']['Insert']>
      }
      availability_slots: {
        Row: {
          id: string
          tutor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['availability_slots']['Row'], 'id' | 'created_at' | 'is_active'> & {
          id?: string
          is_active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['availability_slots']['Insert']>
      }
      sessions: {
        Row: {
          id: string
          tutor_id: string
          student_id: string
          subject_id: string | null
          status: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled_student' | 'cancelled_tutor' | 'disputed' | 'refunded'
          scheduled_start: string
          scheduled_end: string
          actual_start: string | null
          actual_end: string | null
          hourly_rate: number
          total_amount: number
          platform_fee: number
          tutor_payout: number
          session_link: string | null
          tutor_notes: string | null
          cancellation_reason: string | null
          cancelled_by: string | null
          google_event_id_tutor: string | null
          google_event_id_student: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'created_at' | 'updated_at' | 'status'> & {
          id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>
      }
      chat_rooms: {
        Row: {
          id: string
          tutor_id: string
          student_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['chat_rooms']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['chat_rooms']['Insert']>
      }
      messages: {
        Row: {
          id: string
          room_id: string
          sender_id: string
          content: string | null
          file_url: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          is_flagged: boolean
          flagged_by: string | null
          read_by_tutor: boolean
          read_by_student: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at' | 'is_flagged' | 'read_by_tutor' | 'read_by_student'> & {
          id?: string
          is_flagged?: boolean
          read_by_tutor?: boolean
          read_by_student?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      transactions: {
        Row: {
          id: string
          session_id: string | null
          parent_id: string | null
          student_id: string | null
          tutor_id: string | null
          amount: number
          platform_fee: number
          tutor_payout: number
          status: 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed'
          payment_gateway: string | null
          gateway_transaction_id: string | null
          gateway_response: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'status'> & {
          id?: string
          status?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          session_id: string
          student_id: string
          tutor_id: string
          rating: number
          comment: string | null
          is_published: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'is_published'> & {
          id?: string
          is_published?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string | null
          data: Json | null
          is_read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'is_read'> & {
          id?: string
          is_read?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      tutor_documents: {
        Row: {
          id: string
          tutor_id: string
          document_type: 'degree' | 'cnic' | 'certificate' | 'other'
          file_url: string
          file_name: string | null
          status: 'pending' | 'approved' | 'rejected'
          admin_notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tutor_documents']['Row'], 'id' | 'created_at' | 'status'> & {
          id?: string
          status?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['tutor_documents']['Insert']>
      }
      session_resources: {
        Row: {
          id: string
          session_id: string
          tutor_id: string
          file_url: string
          file_name: string
          file_type: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['session_resources']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['session_resources']['Insert']>
      }
      saved_tutors: {
        Row: {
          student_id: string
          tutor_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['saved_tutors']['Row'], 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['saved_tutors']['Insert']>
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string | null
          excerpt: string | null
          cover_image_url: string | null
          author_id: string | null
          tags: string[] | null
          is_published: boolean
          published_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'is_published'> & {
          id?: string
          is_published?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
      }
    }
    Functions: {
      get_my_role: {
        Args: Record<string, never>
        Returns: string
      }
      is_my_child: {
        Args: { student_uuid: string }
        Returns: boolean
      }
    }
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type TutorProfile = Database['public']['Tables']['tutor_profiles']['Row']
export type StudentProfile = Database['public']['Tables']['student_profiles']['Row']
export type ParentProfile = Database['public']['Tables']['parent_profiles']['Row']
export type Subject = Database['public']['Tables']['subjects']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type ChatRoom = Database['public']['Tables']['chat_rooms']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type AvailabilitySlot = Database['public']['Tables']['availability_slots']['Row']

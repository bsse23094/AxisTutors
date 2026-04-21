export type { 
  Database, 
  Profile, 
  TutorProfile, 
  StudentProfile, 
  ParentProfile, 
  Subject, 
  Session, 
  ChatRoom, 
  Message, 
  Transaction, 
  Review, 
  Notification,
  AvailabilitySlot 
} from './database'

export type UserRole = 'admin' | 'tutor' | 'student' | 'parent'

export interface TutorCardProps {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  bio: string
  hourly_rate: number
  rating_avg: number
  total_sessions: number
  subjects: { name: string; level: string }[]
  city: string
}

export interface ChatWindowProps {
  roomId: string
  currentUserId: string
  currentUserRole: 'tutor' | 'student' | 'parent'
  readOnly?: boolean
  otherUser: {
    id: string
    name: string
    avatar_url: string | null
    role: 'tutor' | 'student'
  }
}

export interface SidebarItem {
  label: string
  href: string
  icon: string
  badge?: number
  children?: SidebarItem[]
}

export interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export type SessionStatus = 
  | 'pending_payment'
  | 'confirmed'
  | 'completed'
  | 'cancelled_student'
  | 'cancelled_tutor'
  | 'disputed'
  | 'refunded'

export type NotificationType =
  | 'session_booking_request'
  | 'session_confirmed'
  | 'session_cancelled'
  | 'session_reminder_1h'
  | 'payment_request'
  | 'message_received'
  | 'parent_link_request'
  | 'tutor_approved'
  | 'review_request'

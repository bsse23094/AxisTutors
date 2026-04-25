export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type AnyTable = {
  Row: any;
  Insert: any;
  Update: any;
};

export interface Database {
  public: {
    Tables: {
      profiles: AnyTable;
      tutor_profiles: AnyTable;
      student_profiles: AnyTable;
      parent_profiles: AnyTable;
      parent_student_links: AnyTable;
      subjects: AnyTable;
      tutor_subjects: AnyTable;
      student_subjects: AnyTable;
      availability_slots: AnyTable;
      sessions: AnyTable;
      chat_rooms: AnyTable;
      messages: AnyTable;
      transactions: AnyTable;
      reviews: AnyTable;
      notifications: AnyTable;
      tutor_documents: AnyTable;
      session_resources: AnyTable;
      saved_tutors: AnyTable;
      blog_posts: AnyTable;
    };
    Functions: {
      [key: string]: any;
    };
  }
}

export type Profile = any;
export type TutorProfile = any;
export type StudentProfile = any;
export type ParentProfile = any;
export type Subject = any;
export type Session = any;
export type ChatRoom = any;
export type Message = any;
export type Transaction = any;
export type Review = any;
export type Notification = any;
export type AvailabilitySlot = any;

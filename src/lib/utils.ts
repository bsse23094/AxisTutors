import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function calculatePlatformFee(amount: number): number {
  const commission = parseFloat(process.env.NEXT_PUBLIC_PLATFORM_COMMISSION || '0.15')
  return Math.round(amount * commission)
}

export function calculateTutorPayout(amount: number): number {
  return amount - calculatePlatformFee(amount)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function validatePakistaniPhone(phone: string): boolean {
  // Accepts +92XXXXXXXXXX or 03XXXXXXXXXX
  return /^(\+92|0)3\d{9}$/.test(phone.replace(/[\s-]/g, ''))
}

export const GRADE_LEVELS = [
  'Primary',
  'Middle',
  'Matric Year 1',
  'Matric Year 2',
  'FSc Year 1',
  'FSc Year 2',
  'O-Level',
  'A-Level',
  'University',
  'Other',
] as const

export const PROVINCES = [
  'Punjab',
  'Sindh',
  'KPK',
  'Balochistan',
  'Islamabad (ICT)',
  'Gilgit-Baltistan',
  'AJK',
] as const

export const TEACHING_LEVELS = [
  'Matric',
  'FSc',
  'O-Level',
  'A-Level',
  'University',
  'All Levels',
] as const

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

// Deterministic color assignment for calendar events
const CALENDAR_COLORS = [
  '#1F8F62', '#2C7F58', '#4E9B64', '#f59e0b',
  '#27A271', '#2F8CC2', '#ef4444', '#22c55e',
]

export function getStudentColor(studentId: string): string {
  let hash = 0
  for (let i = 0; i < studentId.length; i++) {
    hash = studentId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return CALENDAR_COLORS[Math.abs(hash) % CALENDAR_COLORS.length]
}

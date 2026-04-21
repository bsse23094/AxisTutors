# Axis Tutors: Premier EdTech Platform 🚀
![Axis Tutors Premium Layout](https://img.shields.io/badge/UI-Premium_Forest_Green-1A3B2B?style=for-the-badge) ![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

Axis Tutors is an elite, high-performance marketplace connecting ambitious students across Pakistan with rigidly verified local and international educators. 

Designed with a heavy focus on luxury branding aesthetics, the platform completely steps away from traditional chaotic edutainment websites. It utilizes an ultra-premium **Dark Green (`#1A3B2B`)**, **Light Green (`#9FD0AA`)**, and **Warm Beige (`#F7F5F0`)** identity, governed natively by modern CSS Variables and executed beautifully through `Outfit` and `Inter` typography grids.

## ✨ Core Features & Aesthetics

### The Grand UI Framework
- **Split-Pane Authentication Flow**: A revolutionary 2-column aesthetic for Login/Registration, delivering deep brand immersion on the left while cleanly rendering heavily padded forms on the right.
- **Glassmorphic Data Floating**: Extensive use of `backdrop-filter: blur` styling completely replaces hard borders, resulting in floating dashboards and highly elevated navigation layers.
- **Dynamic CSS Geometric Backing**: High-end orbital shapes and blurred abstract geometries (`var(--primary)` filtering) have entirely replaced cheap vectors and heavy stock imagery, maximizing layout scale.
- **Micro-Animations**: All primary components natively use heavily tuned `card-hover` CSS transform lifts (`translate-Y: -4px`) to respond instantly and fluidly.

### The Ecosystem Engines
- **Surgical Search**: Realize deep filtering of tutors based upon metrics (Price, Location, Subject matching, Verified reviews). Filter sidebars scroll smoothly while remaining sticky to the viewport. 
- **Calculator Modules**: Built-in interactive financial slide-calculator inside `Become a Tutor` predicting scalable monthly income explicitly customized under dark mode UI principles.
- **Multi-Portal Dashboards**: Segmented, distinct routing spaces isolating **Tutor Dashboards**, **Parent Oversight Nodes**, and **Student Learning Centers**, completely ensuring structural security.

## 🛠 Tech Stack

- **Framework**: `Next.js 14` (App Router) 
- **Styling**: Vanilla `CSS` Variables paired selectively with `Tailwind`.
- **Database / Auth**: `Supabase` (Secure Auth & Edge Functions).
- **Icons**: `Lucide React` configured entirely to `strokeWidth: 1.5` for sharp, high-end scaling. 
- **Fonts**: `Outfit` (Primary Display Headers) / `Inter` (Data Readability).

## 🚀 Setup & Local Execution

Ensure that your `env` keys are localized correctly. **All `.env` strings are intentionally Git-Ignored for explicit infrastructure security.**

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Synchronization**
   Create a `.env.local` inside the root and configure Supabase keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Deploy Development Architecture**
   ```bash
   npm run dev
   ```
   Navigate to `localhost:3000` to witness the premium UI instantly.

## 🛡 Trust & Safety Core
Axis Tutors operates on rigid moderation. Student-Tutor chat is instantly established only upon explicit booking, completely eliminating unsolicited approaches. All structural parents hold absolute, read-only oversight properties across session transactions.

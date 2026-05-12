# Blood Bank Management System

A modern, full-stack Blood Bank Management application built with Next.js, Tailwind CSS, and Supabase. This application allows users to request blood tests, apply to become blood donors, and provides an admin dashboard to manage inventory and applications.

## 🚀 Features

- **Donor Applications**: Users can submit applications to donate blood, providing their medical history and contact details.
- **Blood Test Requests**: Users can schedule blood tests (e.g., Complete Blood Count, Blood Typing).
- **Admin Dashboard**:
  - Real-time statistics (Total units, pending donors, pending tests, critical blood types).
  - Blood Inventory Management.
  - Approve/Reject Donor Applications.
  - Manage Blood Test Requests.
- **Responsive Design**: Fully responsive interface built with Tailwind CSS and Radix UI components.

## 🏗️ Project Structure

The project follows the standard Next.js App Router structure:

```text
blood_-tk/
├── app/                      # Next.js App Router (Pages & Layouts)
│   ├── actions.ts            # Server actions for database operations (Supabase)
│   ├── admin/                # Admin dashboard pages
│   ├── donate/               # Donor application page
│   ├── request-test/         # Blood test request page
│   ├── globals.css           # Global Tailwind styles
│   ├── layout.tsx            # Root layout wrapper
│   └── page.tsx              # Landing page
├── components/               # React Components
│   ├── ui/                   # Reusable UI components (Buttons, Inputs, Dialogs)
│   ├── blood-inventory-card.tsx
│   ├── dashboard-stats.tsx
│   ├── donor-application-form.tsx
│   ├── donors-table.tsx
│   └── header.tsx
├── lib/                      # Utilities and Configurations
│   └── supabase.ts           # Supabase client initialization & TypeScript types
├── public/                   # Static assets (images, icons)
├── styles/                   # Additional styling assets
├── .env.local                # Environment variables (Supabase Keys)
├── package.json              # Project dependencies
└── tailwind.config.js        # Tailwind CSS configuration
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- **Node.js** (v18.x or newer)
- **npm** or **pnpm** package manager
- A **Supabase** account (Free tier is perfectly fine)

## 🛠️ Setup & Installation

### 1. Clone or Download the Repository
Navigate to the project folder in your terminal:
```bash
cd blood_-tk
```

### 2. Install Dependencies
Run the following command to install all required packages:
```bash
npm install
```

### 3. Configure Environment Variables
Create a file named `.env.local` in the **root** of your project directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*(You can find these in your Supabase Dashboard under Project Settings > API).*

### 4. Setup the Supabase Database
Go to the **SQL Editor** in your Supabase Dashboard and run the following SQL query to create the necessary tables and populate initial data:

```sql
-- 1. Create the blood inventory table
CREATE TABLE blood_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blood_type TEXT NOT NULL,
  units_available INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default blood types
INSERT INTO blood_inventory (blood_type, units_available) VALUES
  ('A+', 10), ('A-', 5), ('B+', 12), ('B-', 3), 
  ('AB+', 4), ('AB-', 2), ('O+', 15), ('O-', 8);

-- 2. Create the donor applications table
CREATE TABLE donor_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  blood_type TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  weight NUMERIC NOT NULL,
  address TEXT NOT NULL,
  medical_conditions TEXT,
  last_donation_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create the blood test requests table
CREATE TABLE blood_test_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  test_type TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Disable RLS for local development
ALTER TABLE blood_inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE donor_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE blood_test_requests DISABLE ROW LEVEL SECURITY;
```

### 5. Start the Development Server
Run the local Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔒 A Note on Security (RLS)
For ease of initial setup, the SQL setup script above disables Row Level Security (RLS). This means the database is open to read/write requests without authentication. **Before deploying this app to production**, you must:
1. Enable RLS on all tables in Supabase.
2. Create secure access policies.
3. Implement an Admin authentication system so only authorized staff can access the `/admin` routes.

## 💻 Tech Stack in Detail

This project leverages a modern web development stack designed for performance, scalability, and developer experience.

### Next.js (App Router)
- **What it is**: A React framework built by Vercel for building fast, full-stack web applications.
- **How it's used**: Next.js handles routing (pages like `/admin` and `/donate`), server-side rendering for fast page loads, and API routes via "Server Actions" (in `app/actions.ts`). Server Actions securely communicate directly with the Supabase database without exposing logic to the client.

### Tailwind CSS
- **What it is**: A utility-first CSS framework.
- **How it's used**: Rather than writing custom CSS files, Tailwind allows us to build responsive, beautiful layouts directly in our React components using utility classes (e.g., `flex`, `text-center`, `bg-red-500`). This ensures a consistent design system throughout the app.

### Radix UI & shadcn/ui
- **What it is**: Unstyled, accessible React components combined with beautifully designed Tailwind defaults.
- **How it's used**: The `components/ui/` folder contains pre-built UI components like Dialogs, Buttons, Forms, and Select dropdowns. They provide a polished look out-of-the-box and handle complex accessibility requirements (like keyboard navigation and screen-reader support) automatically.

### Supabase
- **What it is**: An open-source Firebase alternative powered by PostgreSQL.
- **How it's used**: It serves as the primary backend and database. We use the Supabase JS client to insert donor applications and query the blood inventory. Supabase handles all data persistence securely.

### TypeScript
- **What it is**: A strongly typed programming language that builds on JavaScript.
- **How it's used**: TypeScript is used everywhere in the project to catch bugs before the code runs. For example, in `lib/supabase.ts`, we define interfaces for `BloodInventory` and `DonorApplication` so the editor knows exactly what data fields exist and what types they should be.
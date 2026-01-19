import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (client) return client
  
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  return client
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle server component context where cookies can't be set
          }
        },
      },
    }
  )
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export interface BloodInventory {
  id: string
  blood_type: BloodType
  units_available: number
  last_updated: string
  created_at: string
}

export interface DonorApplication {
  id?: string
  full_name: string
  email: string
  phone: string
  blood_type: BloodType
  date_of_birth: string
  weight: number
  address: string
  medical_conditions?: string
  last_donation_date?: string
  status?: 'pending' | 'approved' | 'rejected' | 'completed'
  created_at?: string
}

export interface BloodTestRequest {
  id?: string
  full_name: string
  email: string
  phone: string
  date_of_birth: string
  test_type: 'blood_typing' | 'complete_blood_count' | 'blood_sugar' | 'hemoglobin' | 'comprehensive'
  preferred_date: string
  preferred_time: string
  notes?: string
  status?: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  created_at?: string
}

'use client'

import { useEffect, useState } from 'react'
import { getDonorApplications } from '@/app/actions'
import { DonorsTable } from '@/components/donors-table'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { DonorApplication } from '@/lib/supabase'

export default function DonorsPage() {
  const [donors, setDonors] = useState<DonorApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const data = await getDonorApplications()
        console.log('[v0] Donor applications fetched:', data)
        setDonors(data)
      } catch (err) {
        console.error('[v0] Failed to fetch donors:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch donors')
      } finally {
        setLoading(false)
      }
    }

    fetchDonors()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Donor Applications</CardTitle>
            <CardDescription>Manage blood donor applications</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading donor applications...</div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">Error: {error}</div>
            ) : donors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No donor applications found
              </div>
            ) : (
              <DonorsTable donors={donors} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

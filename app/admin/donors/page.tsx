'use client'

import { useEffect, useState } from 'react'
import { getDonorApplications } from '@/app/actions'
import { DonorsTable } from '@/components/donors-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { DonorApplication } from '@/lib/supabase'

export default function DonorsPage() {
  const [donors, setDonors] = useState<DonorApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const data = await getDonorApplications()
        setDonors(data)
      } catch (error) {
        console.error('Failed to fetch donors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonors()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Donor Applications</CardTitle>
            <CardDescription>Manage blood donor applications</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading donor applications...</div>
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

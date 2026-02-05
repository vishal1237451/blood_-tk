'use client'

import { useEffect, useState } from 'react'
import { getBloodTestRequests } from '@/app/actions'
import { TestsTable } from '@/components/tests-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { BloodTestRequest } from '@/lib/supabase'

export default function TestsPage() {
  const [tests, setTests] = useState<BloodTestRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getBloodTestRequests()
        setTests(data)
      } catch (error) {
        console.error('Failed to fetch tests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Blood Test Requests</CardTitle>
            <CardDescription>Manage blood test requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading blood test requests...</div>
            ) : tests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No blood test requests found
              </div>
            ) : (
              <TestsTable tests={tests} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { getBloodTestRequests } from '@/app/actions'
import { TestsTable } from '@/components/tests-table'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { BloodTestRequest } from '@/lib/supabase'

export default function TestsPage() {
  const [tests, setTests] = useState<BloodTestRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getBloodTestRequests()
        console.log('[v0] Blood test requests fetched:', data)
        setTests(data)
      } catch (err) {
        console.error('[v0] Failed to fetch tests:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch tests')
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Blood Test Requests</CardTitle>
            <CardDescription>Manage blood test requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading blood test requests...</div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">Error: {error}</div>
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

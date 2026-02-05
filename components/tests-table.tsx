'use client'

import { useState } from 'react'
import { updateBloodTestRequestStatus } from '@/app/actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { BloodTestRequest } from '@/lib/supabase'

interface TestsTableProps {
  tests: BloodTestRequest[]
}

const testTypeLabels: Record<string, string> = {
  blood_typing: 'Blood Typing',
  complete_blood_count: 'Complete Blood Count',
  blood_sugar: 'Blood Sugar',
  hemoglobin: 'Hemoglobin',
  comprehensive: 'Comprehensive Panel',
}

export function TestsTable({ tests }: TestsTableProps) {
  const [statusMap, setStatusMap] = useState<Record<string, string>>({})

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const result = await updateBloodTestRequestStatus(id, newStatus)
      if (result.success) {
        setStatusMap(prev => ({
          ...prev,
          [id]: newStatus
        }))
      } else {
        console.error('Failed to update status:', result.error)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Test Type</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Preferred Date</TableHead>
            <TableHead>Preferred Time</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.full_name}</TableCell>
              <TableCell>{test.email}</TableCell>
              <TableCell>{test.phone}</TableCell>
              <TableCell>{testTypeLabels[test.test_type] || test.test_type}</TableCell>
              <TableCell>{test.date_of_birth}</TableCell>
              <TableCell>{test.preferred_date}</TableCell>
              <TableCell>{test.preferred_time}</TableCell>
              <TableCell className="max-w-xs truncate">{test.notes || '-'}</TableCell>
              <TableCell>
                <Select
                  value={statusMap[test.id!] || test.status || 'pending'}
                  onValueChange={(value) => handleStatusChange(test.id!, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

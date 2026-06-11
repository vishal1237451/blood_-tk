'use client'

import { useState, useEffect } from 'react'
import { updateBloodTestRequestStatus, deleteBloodTestRequest } from '@/backend/actions'
import { Button } from '@/components/ui/button'
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
import { Trash2 } from 'lucide-react'
import type { BloodTestRequest } from '@/backend/supabase'

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
  const [entries, setEntries] = useState<BloodTestRequest[]>(tests)
  const [statusMap, setStatusMap] = useState<Record<string, string>>({})
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setEntries(tests)
  }, [tests])

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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blood test request?')) {
      return
    }

    try {
      setIsDeleting(prev => ({ ...prev, [id]: true }))
      const result = await deleteBloodTestRequest(id)
      if (result.success) {
        setEntries(prev => prev.filter(entry => entry.id !== id))
      } else {
        alert(result.error || 'Failed to delete blood test request')
      }
    } catch (error) {
      console.error('Error deleting test request:', error)
      alert('An error occurred while deleting the blood test request')
    } finally {
      setIsDeleting(prev => ({ ...prev, [id]: false }))
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
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((test) => (
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
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleDelete(test.id!)}
                  disabled={isDeleting[test.id!]}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


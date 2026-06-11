'use client'

import { useState, useEffect } from 'react'
import { updateDonorApplicationStatus, deleteDonorApplication } from '@/backend/actions'
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
import type { DonorApplication } from '@/backend/supabase'

interface DonorsTableProps {
  donors: DonorApplication[]
}

export function DonorsTable({ donors }: DonorsTableProps) {
  const [entries, setEntries] = useState<DonorApplication[]>(donors)
  const [statusMap, setStatusMap] = useState<Record<string, string>>({})
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setEntries(donors)
  }, [donors])

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const result = await updateDonorApplicationStatus(id, newStatus)
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
    if (!window.confirm('Are you sure you want to delete this donor application?')) {
      return
    }

    try {
      setIsDeleting(prev => ({ ...prev, [id]: true }))
      const result = await deleteDonorApplication(id)
      if (result.success) {
        setEntries(prev => prev.filter(entry => entry.id !== id))
      } else {
        alert(result.error || 'Failed to delete donor application')
      }
    } catch (error) {
      console.error('Error deleting donor:', error)
      alert('An error occurred while deleting the donor application')
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
            <TableHead>Blood Type</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Weight (kg)</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((donor) => (
            <TableRow key={donor.id}>
              <TableCell className="font-medium">{donor.full_name}</TableCell>
              <TableCell>{donor.email}</TableCell>
              <TableCell>{donor.phone}</TableCell>
              <TableCell>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                  {donor.blood_type}
                </span>
              </TableCell>
              <TableCell>{donor.date_of_birth}</TableCell>
              <TableCell>{donor.weight}</TableCell>
              <TableCell className="max-w-xs truncate">{donor.address}</TableCell>
              <TableCell>
                <Select
                  value={statusMap[donor.id!] || donor.status || 'pending'}
                  onValueChange={(value) => handleStatusChange(donor.id!, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleDelete(donor.id!)}
                  disabled={isDeleting[donor.id!]}
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


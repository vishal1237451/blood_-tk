'use client'

import { useState } from 'react'
import { updateDonorApplicationStatus } from '@/backend/actions'
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
import type { DonorApplication } from '@/backend/supabase'

interface DonorsTableProps {
  donors: DonorApplication[]
}

export function DonorsTable({ donors }: DonorsTableProps) {
  const [statusMap, setStatusMap] = useState<Record<string, string>>({})

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.map((donor) => (
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

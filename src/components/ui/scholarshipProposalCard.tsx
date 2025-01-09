'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, User, Users, Calendar } from 'lucide-react'
import { useState } from "react"
import { ScholarshipProposal } from "@/types/secretaryScholarshipProposal"
import { Session } from "next-auth"

export function ScholarshipCard({ proposal, session }: { proposal: ScholarshipProposal; session:Session}) {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending')

  const handleUserResponse = async (accepted: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships/secretary/status?scholarship_id=${proposal.id}&accepted=${accepted}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
      })
      setStatus(accepted ? 'accepted' : 'rejected')
    } catch (error: any) {
      console.error("Error updating scholarship status:", error)
    }
  }

  return (
    <Card className="w-full max-w-md flex flex-col">
      <CardHeader>
        <CardTitle>{proposal.name}</CardTitle>
        {proposal.description && <CardDescription>{proposal.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-2 flex-grow">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Publisher: {proposal.publisher}</span>
        </div>
        <div>Type: {proposal.type}</div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Spots: {proposal.spots}</span>
        </div>
        <div>Jury: {proposal.jury.join(', ')}</div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Deadline: {proposal.deadline}</span>
        </div>
        {proposal.edictUrl && (
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <a href={proposal.edictUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View Edict
            </a>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-4 flex justify-between">
        <Button onClick={() => handleUserResponse(true)} disabled={status !== 'pending'} variant={status === 'accepted' ? 'default' : 'outline'}>
          Accept
        </Button>
        <Button onClick={() => handleUserResponse(false)} disabled={status !== 'pending'} variant={status === 'rejected' ? 'destructive' : 'outline'}>
          Reject
        </Button>
      </CardFooter>
    </Card>
  )
}


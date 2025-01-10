'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScholarshipApplication } from "@/types/application"
import { Session } from 'next-auth'

export function ScholarshipCard({ application, accessToken }: { application: ScholarshipApplication; accessToken: Session; }) {
  const [userResponse, setUserResponse] = useState<'Accepted' | 'Declined' | undefined>(application.userResponse)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-500';
      case 'Rejected':
        return 'bg-red-500';
      case 'Approved':
        return 'bg-green-500';
      case 'Under Evaluation':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  }

  const handleResponse = async (response: 'Accepted' | 'Declined') => {
    setUserResponse(response);

    try {
      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grading/${application.id}/response?user_response=${response}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken?.accessToken}`
        },
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to update the scholarship response');
      }

      console.log(`Successfully updated the scholarship response to ${response}`);
    } catch (error) {
      console.error(`Error updating response: ${error.message}`);
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{application.scholarshipName}</CardTitle>
        {(application.status === 'Approved' || application.status === 'Rejected') && application.grade && (
          <span className="text-sm font-medium">Grade: {application.grade}</span>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Badge className={`${getStatusColor(application.status)} text-white`}>
            {application.status}
          </Badge>
          {application.select && application.status === 'Approved' && !userResponse && (
            <div className="flex space-x-2">
              <Button onClick={() => handleResponse('Accepted')} variant="default" size="sm">Accept</Button>
              <Button onClick={() => handleResponse('Declined')} variant="outline" size="sm">Decline</Button>
            </div>
          )}
        </div>
      </CardContent>
      { userResponse && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            You have {userResponse} this scholarship.
          </p>
        </CardFooter>
      )}
    </Card>
  )
}

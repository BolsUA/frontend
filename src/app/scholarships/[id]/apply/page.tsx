'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Scholarship {
  id: string;
  name: string;
  requiredDocuments: { name: string; hasTemplate: boolean }[];
}

// This would typically come from your API or be passed as a prop
const scholarship: Scholarship = {
  id: '1',
  name: 'Advanced Computer Science Scholarship',
  requiredDocuments: [
    { name: 'CV', hasTemplate: true },
    { name: 'Research Proposal', hasTemplate: false },
    { name: 'Academic Transcripts', hasTemplate: false }
  ]
}

interface FormData {
  documents: { [key: string]: File | null };
}

export default function ApplyForScholarship() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    documents: {}
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentName: string) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      documents: { ...prev.documents, [documentName]: file }
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    
    scholarship.requiredDocuments.forEach(doc => {
      if (!formData.documents[doc.name]) {
        newErrors[doc.name] = `${doc.name} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-10">
        <CardContent className="pt-6">
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your documents for {scholarship.name} have been submitted successfully. We will review your application and get back to you soon.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/scholarships')} className="mt-4 w-full">
            Back to Scholarships
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Upload Documents for {scholarship.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {scholarship.requiredDocuments.map((doc) => (
              <div key={doc.name} className="flex flex-col space-y-2">
                <Label htmlFor={`document-${doc.name}`}>{doc.name}</Label>
                <div className="flex items-center space-x-2">
                  <input
                    id={`document-${doc.name}`}
                    name={`document-${doc.name}`}
                    type="file"
                    onChange={(e) => handleFileChange(e, doc.name)}
                    className={`file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 ${errors[doc.name] ? 'border-red-500' : ''}`}
                  />
                  {doc.hasTemplate && (
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" /> Template
                    </Button>
                  )}
                </div>
                {errors[doc.name] && <p className="text-red-500 text-sm">{errors[doc.name]}</p>}
              </div>
            ))}
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Please upload all required documents before submitting.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Documents'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
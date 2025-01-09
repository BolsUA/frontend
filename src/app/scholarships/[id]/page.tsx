// @ts-ignore
// @ts-nocheck

import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Users, FileText, User } from "lucide-react"
import Link from 'next/link'
import { MdOutlineSchool } from "react-icons/md";

interface Scholarship {
  id: string
  name: string
  description: string
  publisher: string
  type: string
  jury: { name: string, id: string }[]
  deadline: string
  status: "Draft" | "Under Review" | "Open" | "Jury Evaluation" | "Closed"
  scientific_areas: { name: string, id: string }[]
  documents: { name: string, file_path:string, hasTemplate: boolean, required: boolean , template: boolean }[]
  edict: { name: string, description: string, publication_date: string, id: string }
}

const areaColors = {
  // Physical Sciences
  "Physics": "bg-blue-500/50 border-transparent text-secondary-foreground hover:bg-secondary/80",
  "Chemistry": "bg-blue-400/50 border-transparent text-secondary-foreground hover:bg-secondary/80",
  "Mathematics": "bg-blue-300/50 border-transparent text-secondary-foreground hover:bg-secondary/80",

  // Life Sciences
  "Biology": "bg-green-500/50 border-transparent text-secondary-foreground hover:bg-secondary/80",
  "Medicine": "bg-green-400/50 border-transparent text-secondary-foreground hover:bg-secondary/80",
  "Public Health": "bg-green-300/50 border-transparent text-secondary-foreground hover:bg-secondary/80",
  "Environmental Science": "bg-yellow-200/50 border-transparent text-secondary-foreground hover:bg-secondary/80",
  "Ecology": "bg-yellow-100/50 border-transparent text-secondary-foreground hover:bg-secondary/80",

  // Engineering and Technology
  "Engineering": "bg-indigo-500/50 border-transparent text-secondary-foreground hover:bg-secondary/80",
  "Computer Science": "bg-indigo-400/50 border-transparent text-secondary-foreground hover:bg-secondary/80",

  // Social Sciences
  "Psychology": "bg-purple-500/50 border-transparent text-secondary-foreground hover:bg-secondary/80",
  "Sociology": "bg-purple-400/50 border-transparent text-secondary-foreground hover:bg-secondary/80",
  "Anthropology": "bg-purple-300/50 border-transparent text-secondary-foreground hover:bg-secondary/80",

  // Humanities
  "Literature": "bg-red-500/50 border-transparent text-secondary-foreground hover:bg-secondary/80",
  "History": "bg-red-400/50 border-transparent text-secondary-foreground hover:bg-secondary/80",
  "Philosophy": "bg-red-300/50 border-transparent text-secondary-foreground hover:bg-secondary/80",

  // Sustainability
  "Sustainability": "bg-teal-500/50 border-transparent text-secondary-foreground hover:bg-secondary/80",

  // Default
  "default": "bg-gray-500/50 text-secondary-foreground hover:bg-secondary/80"
};

// This would typically come from your API or database
async function getScholarship(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships/${id}/details`)
      .then(res => res.json())
      .catch(() => null);
    return response;
  } catch {
    return null;
  }
}


export default async function ScholarshipDetails({ params }: { params: { id: string } }) {
  const scholarship = await getScholarship(params.id)

  if (!scholarship) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{scholarship.name}</CardTitle>
            </div>
            
            <Badge variant={scholarship.status === 'Open' ? 'default' : 'secondary'}>
                {scholarship.status}
              </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground mt-2">{scholarship.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Scientific Areas</h3>
              <div className="flex flex-wrap gap-2">
                {scholarship.scientific_areas.flatMap(area => {
                  try {
                    const names = JSON.parse(area.name).map((area: string) => area.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
                    return names;
                  } catch {
                    return area.name
                  }
                }).map((area) => (
                  <Badge key={area} className={areaColors[area as keyof typeof areaColors] || areaColors["default"]}>
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 justify-items-stretch">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>{scholarship.spots} spots available</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Application deadline: {scholarship.deadline}</span>
              </div>
              <div className="flex items-center">            
                <MdOutlineSchool className="mr-2 h-4 w-4"/>
                <span>{scholarship.type} scholarship</span>
              </div>
            </div>

            <Separator />

             <div> 
              <h3 className="font-semibold mb-2">Selected Jury</h3>
              <ul className="list-disc list-inside">
                  <li className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {scholarship.jury.map((jury) => (
                      <span key={jury.id}>{jury.name}</span>
                    ))}
                  </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Required Documents</h3>
              <ul className="space-y-2">
              {scholarship.documents.length === 0 ? <p className="text-muted-foreground mt-2">No documents required</p> : null}
                {scholarship.documents.map((documents) => (
                  <li key={documents.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      {documents.name}
                    </div>
                    {documents.file_path && (
                        <Link href={documents.file_path} target="_blank">
                          <Button variant="outline" size="sm">Download Template</Button>
                        </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              {/* Edict is a file like the documents, but is mandatory */}
              <h3 className="font-semibold mb-2">Edict</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  {scholarship.edict.name}
                </div>
                <Link href={scholarship.edict.file_path} target="_blank">
                  <Button variant="outline" size="sm">Download Edict</Button>
                </Link>
            </div>

            <div className="flex justify-end">
              <Link href={`/scholarships/${scholarship.id}/apply`}><Button>Apply for Scholarship</Button></Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import { IoCalendarClear } from "react-icons/io5";
import { useEffect, useState } from "react";

// Define the structure of a scholarship
interface Scholarship {
  id: string
  name: string
  scientific_areas: { name: string, id: string }[]
  type: string
  deadline: string
  status: "Draft" | "Under Review" | "Open" | "Jury Evaluation" | "Closed"
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

const buttonColors = {
  "Draft": "bg-gray-500/50 text-secondary-foreground hover:bg-secondary/80",
  "Under Review": "bg-yellow-500/50 text-secondary-foreground hover:bg-secondary/80",
  "Open": "bg-green-500/50 text-secondary-foreground hover:bg-secondary/80",
  "Jury Evaluation": "bg-blue-500/50 text-secondary-foreground hover:bg-secondary/80",
  "Closed": "bg-red-500/50 text-secondary-foreground hover:bg-secondary/80",
};

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await fetch("http://localhost:8000/scholarships").then((res) => res.json());
        setScholarships(response);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      }
    };
  
    fetchScholarships();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Scholarships</h1>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id}>
              <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center p-6">
                <div className="flex-grow mb-4 md:mb-0 md:mr-4">
                  <h2 className="text-xl font-semibold mb-2">{scholarship.name}</h2>
                  <div className="mb-2">
                    {/* <span className="font-semibold">Scientific Areas:</span> */}
                    <div className="flex flex-wrap gap-1 mt-1 mb-2">
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
                    <div className="mb-2">
                        <span className="font-semibold">Type:</span> {scholarship.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <div className="mb-2">
                    <Badge className={`top-4 right-4 z-10 ${buttonColors[scholarship.status as keyof typeof buttonColors] || buttonColors["Draft"]}`}>
                      {scholarship.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <IoCalendarClear className="w-4 h-4"/>
                    <span> {scholarship.deadline} </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import { IoCalendarClear } from "react-icons/io5";

// Define the structure of a scholarship
interface Scholarship {
  id: string
  name: string
  scientificAreas: string[]
  type: string
  deadline: string
  status: string
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

// Sample data (replace this with actual data from your backend)
const scholarships: Scholarship[] = [
  {
    id: "1",
    name: "STEM Excellence Scholarship",
    scientificAreas: ["Engineering", "Computer Science", "Mathematics"],
    type: "Full Tuition",
    deadline: "1 day left",
    status: "Open",
  },
  {
    id: "2",
    name: "Global Health Research Grant",
    scientificAreas: ["Medicine", "Public Health", "Biology"],
    type: "Research Grant",
    deadline: " closed at 14-08-2024",
    status: "Closed",
  },
  {
    id: "3",
    name: "Environmental Studies Fellowship",
    scientificAreas: ["Environmental Science", "Ecology", "Sustainability"],
    type: "Fellowship",
    deadline: "1 week left",
    status: "Open",
  },
  {
    id: "4",
    name: "Arts and Humanities Scholarship",
    scientificAreas: ["Literature", "History", "Philosophy"],
    type: "Partial Tuition",
    deadline: "2 months left",
    status: "Open",
  },
  {
    id: "5",
    name: "Social Sciences Research Award",
    scientificAreas: ["Psychology", "Sociology", "Anthropology"],
    type: "Research Award",
    deadline: " closed at 01-10-2024",
    status: "Closed",
  },
]


export default function ScholarshipsPage() {
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
                      {scholarship.scientificAreas.map((area) => (
                        <Badge key={area} className={areaColors[area as keyof typeof areaColors] || areaColors["default"]}>
                          {area}
                        </Badge>
                      ))}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Type:</span> {scholarship.type}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <div className="mb-2">
                    <Badge
                      variant={
                        scholarship.status === "Open"
                          ? "success" // Change "success" to "default" or another accepted type
                          : scholarship.status === "Closed"
                            ? "destructive"
                            : "default"
                      }
                      className="top-4 right-4 z-10"
                    >
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

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, Filter, SortDesc, X } from "lucide-react"
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { IoCalendarClear } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Define the structure of a scholarship
interface Scholarship {
  id: string
  name: string
  scientific_areas: { name: string, id: string }[]
  type: string
  deadline: string
  status: "Draft" | "Under Review" | "Open" | "Jury Evaluation" | "Closed"
  publisher: string
}

interface Filters {
  types: string[]
  scientific_areas: string[]
  status: string[]
  deadlines: string[]
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
  const [filters, setFilters] = useState({} as Filters);
  const [activeFilters, setActiveFilters] = useState<Partial<Record<keyof Filters, string[]>>>({})

  type DateRange = { from: Date; to?: Date };
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const [sortOrder, setSortOrder] = useState<string | null>(null); // Manage the sort order state

  useEffect(() => {
    const fetchScholarships = async () => {
      const queryParams = new URLSearchParams();

      for (const [filterType, values] of Object.entries(activeFilters)) {
        if (!values || !values.length) continue;

        if (filterType === 'deadlines') {
          const [from, to] = values as string[];
          queryParams.append('deadline_start', from);
          queryParams.append('deadline_end', to);
          continue;
        }
        // queryParams.append(filterType, values.join(','));

        for (const value of values) queryParams.append(filterType, value);
      }


      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships?${queryParams.toString()}`)
        .then((res) => res.json())
        .catch(() => []);

      if (sortOrder) {
        response.sort((a: Scholarship, b: Scholarship) => {
          if (sortOrder === 'deadline_asc') {
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          } else if (sortOrder === 'deadline_desc') {
            return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
          } else if (sortOrder === 'name_asc') {
            return a.name.localeCompare(b.name);
          } else if (sortOrder === 'name_desc') {
            return b.name.localeCompare(a.name);
          }
          return 0;
        });
      }

      setScholarships(response);
    };

    fetchScholarships();
  }, [activeFilters, sortOrder]);

  useEffect(() => {
    const filteredScholarships = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships/filters`)
        .then((res) => res.json())
        .catch(() => []);

      if ('detail' in response) return;
      setFilters(response);
    }
    filteredScholarships();
  }, []);

  const handleFilterChange = (filterType: keyof Filters, value: string | null) => {
    setActiveFilters((prev) => {
      const updatedFilters = { ...prev };
      const currentValues = new Set(updatedFilters[filterType] || []);

      if (value === null) {
        delete updatedFilters[filterType];
        if (filterType === 'deadlines') setDateRange(undefined);
      } else if (value.includes(" - ")) {
        // If value is a date range string, handle it accordingly
        const dates = value.split(" - ");
        const from = new Date(dates[0]);
        const to = new Date(dates[1]);
        updatedFilters[filterType] = [
          from.toISOString().split('T')[0],
          to.toISOString().split('T')[0]
        ];
      } else {
        if (currentValues.has(value)) currentValues.delete(value);
        else currentValues.add(value);
        updatedFilters[filterType] = Array.from(currentValues);
      }
      return updatedFilters;
    });
  };

  const renderFilterPopover = (title: string, filterType: keyof Filters) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 border-dashed">
          {title}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ScrollArea className="h-72 w-full">
          {filters[filterType]?.map((item) => (
            <div key={item} className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={`${filterType}-${item}`}
                checked={(activeFilters[filterType] || []).includes(item)}
                onCheckedChange={() => handleFilterChange(filterType, item)}
              />
              <Label htmlFor={`${filterType}-${item}`}>{item}</Label>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Scholarships</h1>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Filters</h2>
            <Separator orientation="vertical" className="h-6" />
            {renderFilterPopover('Types', 'types')}
            {renderFilterPopover('Scientific Areas', 'scientific_areas')}
            {renderFilterPopover('Status', 'status')}
            <Button
              variant="outline"
              className="h-9 border-dashed"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              Deadlines
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <SortDesc className="h-5 w-5 text-muted-foreground" />
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Order by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline_asc">Deadline (Ascending)</SelectItem>
                <SelectItem value="deadline_desc">Deadline (Descending)</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(activeFilters).flatMap(([filterType, values]) => {
              if (filterType === 'deadlines' && values) {
                const [start, end] = (values as unknown as [Date, Date]) || [null, null];
                return [
                  <Badge
                    key={`${filterType}-range`}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleFilterChange('deadlines', null)}
                  >
                    {`${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ]
              }
              return (values as string[]).map((value) => (
                <Badge
                  key={`${filterType}-${value}`}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleFilterChange(filterType as keyof Filters, value)}
                >
                  {value}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))
            })}
          </div>
          {isCalendarOpen && (
            <div className="flex justify-center mt-4">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                    setIsCalendarOpen(false); // Close the calendar after selection

                    // Update activeFilters with the selected date range
                    handleFilterChange('deadlines', `${format(range.from, "yyyy-MM-dd")} - ${format(range.to, "yyyy-MM-dd")}`);
                  } else if (range?.from && !range?.to) {
                    setDateRange({ from: range.from, to: undefined });
                  } else {
                    setDateRange(undefined);
                  }
                }}

                numberOfMonths={2}
                className="rounded-md border"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4">
          {scholarships.map((scholarship) => (
            <Link key={scholarship.id} href={`/scholarships/${scholarship.id}`}>
              <Card key={scholarship.id} className="hover:shadow-lg hover:bg-gray-600 transition-shadow duration-300">
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
                      <IoCalendarClear className="w-4 h-4" />
                      <span> {scholarship.deadline} </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

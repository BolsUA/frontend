import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from 'next/link';
import { IoCalendarClear } from "react-icons/io5";
import { auth } from '@/auth';

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

async function getScholarship(userId: string,accessToken: string): Promise<Scholarship[] | null> {
  try {
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/scholarships/jury/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    //console.log(response);
    if (!response.ok) {
      console.error("API request failed:", response.status);
      return null;
    }

    const data = await response.json();
    return data?.map((proposal: Scholarship) => ({
      id: proposal.id,
      name: proposal.name,
      scientific_areas: proposal.scientific_areas,
      type: proposal.type,
      deadline: proposal.deadline,
      status: proposal.status,
      publisher: proposal.publisher,
    }));
  } catch (error) {
    console.error('Failed to fetch scholarships:', error);
    return null;
  }
}

export default async function ScholarshipsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div className="p-4">Please log in to view scholarships</div>;
  }

  // @ts-expect-error Session does not have accessToken
  if (!session.accessToken) {
    return <div className="p-4">Unauthorized</div>;
  }

  // @ts-expect-error Session does not have accessToken
  const scholarships = await getScholarship(session.user.id, session.accessToken);
  if (!scholarships || scholarships.length === 0) {
    return <div className="p-4">No scholarships found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Scholarships to Review</h1>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4">
        {scholarships.map((scholarship) => (
            <Link key={scholarship.id} href={`/jury/applications/${scholarship.id}`}>
            <Card key={scholarship.id} className="mb-4 hover:shadow-lg hover:bg-gray-600 transition-shadow duration-300">
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

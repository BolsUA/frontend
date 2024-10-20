import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Porposals: Porposals[] = [
  {
    id: "1",
    name: "STEM Excellence Scholarship",
    scientificAreas: ["Engineering", "Computer Science", "Mathematics"],
    type: "Full Tuition",
    deadline: "1 day left",
    status: "Draft",
  },
  {
    id: "2",
    name: "Global Health Research Grant",
    scientificAreas: ["Medicine", "Public Health", "Biology"],
    type: "Research Grant",
    deadline: " 14-08-2024",
    status: "Under Review",
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
    status: "Jury Evaluation",
  },
  {
    id: "5",
    name: "Social Sciences Research Award",
    scientificAreas: ["Psychology", "Sociology", "Anthropology"],
    type: "Research Award",
    deadline: "01-10-2024",
    status: "Closed",
  },
]

export default async function TaskPage() {
    return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Scholarships Porposals</h1>
            <Table>
                <TableCaption>A list of your scholarships porposals.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead className="text-right">View</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Proposal {
  name: string;
  type: string;
  deadline: string;
  status: string;
}

const buttonColors = {
  "Draft": "bg-gray-500/50 text-secondary-foreground hover:bg-secondary/80",
  "Under Review": "bg-yellow-500/50 text-secondary-foreground hover:bg-secondary/80",
  "Open": "bg-green-500/50 text-secondary-foreground hover:bg-secondary/80",
  "Jury Evaluation": "bg-blue-500/50 text-secondary-foreground hover:bg-secondary/80",
  "Closed": "bg-red-500/50 text-secondary-foreground hover:bg-secondary/80",
};

const Proposals: Proposal[] = [
  {
    name: "STEM Excellence Scholarship",
    type: "Full Tuition",
    deadline: "1 day left",
    status: "Draft",
  },
  {
    name: "Global Health Research Grant",
    type: "Research Grant",
    deadline: "14-08-2024",
    status: "Under Review",
  },
  {
    name: "Environmental Studies Fellowship",
    type: "Fellowship",
    deadline: "1 week left",
    status: "Open",
  },
  {
    name: "Arts and Humanities Scholarship",
    type: "Partial Tuition",
    deadline: "2 months left",
    status: "Jury Evaluation",
  },
  {
    name: "Social Sciences Research Award",
    type: "Research Award",
    deadline: "01-10-2024",
    status: "Closed",
  },
  {
    name: "Innovative Technology Grant",
    type: "Research Grant",
    deadline: "15-09-2023",
    status: "Open",
  },
  {
    name: "Creative Arts Fellowship",
    type: "Fellowship",
    deadline: "30-11-2023",
    status: "Under Review",
  },
  {
    name: "Environmental Protection Scholarship",
    type: "Partial Tuition",
    deadline: "20-12-2023",
    status: "Draft",
  },
  {
    name: "Medical Research Award",
    type: "Research Award",
    deadline: "05-01-2024",
    status: "Jury Evaluation",
  },
  {
    name: "Global Education Scholarship",
    type: "Full Tuition",
    deadline: "10-02-2024",
    status: "Closed",
  },
];

export default async function PorposalsPage() {
  return (
    <div className="container mx-auto p-4">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-2xl font-bold mb-6">Scholarships Porposals</h1>
        <Button variant="destructive" className="text-right bg-green-800  hover:bg-secondary/80" asChild>
          <Link href="/proposals/submit">New Porposal</Link>
        </Button>
      </div>
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
          {Proposals.map((proposal, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{proposal.name}</TableCell>
              <TableCell>
                <Badge className={`top-4 right-4 z-10 ${buttonColors[proposal.status as keyof typeof buttonColors] || buttonColors["Draft"]} w-32 h-8 flex items-center justify-center text-sm`}>
                  {proposal.status}
                </Badge>
              </TableCell>
              <TableCell>{proposal.type}</TableCell>
              <TableCell>{proposal.deadline}</TableCell>
              <TableCell className="text-right">
                <Button variant="secondary" className="text-right bg-blue-800  hover:bg-secondary/80">More details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

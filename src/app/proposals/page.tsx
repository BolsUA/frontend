import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { auth } from '../../auth';
import { redirect } from "next/navigation";

interface Proposal {
  id: string;
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

async function getProposals(userId: string): Promise<Proposal[] | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships?publisher=${userId}`)
      .then(res => res.json())
      .catch(() => null);

    if (!response) return null;

    const proposals = response?.map((proposal: Proposal) => ({
      id: proposal.id,
      name: proposal.name,
      type: proposal.type,
      deadline: proposal.deadline,
      status: proposal.status,
    }));

    return proposals;
  } catch {
    return null;
  }
}

export default async function ProposalsPage() {
  const session = await auth();
  if (!session || !session.user || !session.user?.id) return redirect('/');

  const proposals = await getProposals(session.user.id);
  if (!proposals) return redirect('/');

  return (
    <div className="container mx-auto p-4">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-2xl font-bold mb-6">Scholarships Proposals</h1>
        <Button variant="destructive" className="text-right bg-green-800  hover:bg-secondary/80" asChild>
          <Link href="/proposals/submit">New Proposal</Link>
        </Button>
      </div>
      <Table>
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
          {proposals.map((proposal, index) => (
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
                <Button variant="secondary" className="text-right bg-blue-800  hover:bg-secondary/80">
                  <Link href={`/scholarships/${proposal.id}`}>More details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { ScholarshipCard } from '@/components/ui/scholarshipProposalCard'
import { auth } from '../../../auth';
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { ApiResponse, ScholarshipProposal, transformApiResponse } from '@/types/secretaryScholarshipProposal';

async function fetchScholarshipsProposals(session: Session): Promise<ScholarshipProposal[]> {
    try {
        // const response = await fetch(`http://localhost:8001/scholarships/secretary/under_review`, {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholarships/secretary/under_review`, {
            method: 'GET',
            headers: {
                // @ts-expect-error Access token is defined
                'Authorization': `Bearer ${session?.accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: ApiResponse[] = await response.json();
        console.log(data);
        const transformedData: ScholarshipProposal[] = data.map(transformApiResponse);
        return transformedData;
    } catch (err) {
        console.error("Failed to fetch applications:", err);
        return [];
    }
}

export default async function ScholarshipProposalsPage() {
    const session = await auth();
    if (!session || !session.user || !session.user?.id) return redirect('/');

    const scholarshipProposals = await fetchScholarshipsProposals(session);

    return (
        <div className="container mx-auto py-8">
            {scholarshipProposals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6"> 
                    { scholarshipProposals.map((proposal) => (
                        <ScholarshipCard key={proposal.id} proposal={proposal} session={session}/>
                    ))}
                </div>
            ) : (
                    <p className="text-gray-500 text-center">
                        No application to review at the moment.
                    </p>
                )}
        </div>
    )
}


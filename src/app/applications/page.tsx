import { ScholarshipCard } from "@/components/ui/applicationCard"
import { ScholarshipApplication, ApiResponse, transformApiResponse } from "@/types/application"
import { auth } from '../../auth';
import { redirect } from "next/navigation";
import { Session } from "next-auth";

export default async function ScholarshipsPage() {
    const session = await auth();
    if (!session || !session.user || !session.user?.id) return redirect('/');

    const applications = await fetchScholarships(session);

    return (
        <div className="px-8 py-8">
            <div className="space-y-4">
                {applications.length > 0 ? (
                    applications.map((application) => (
                        // @ts-expect-error Access token is defined
                        <ScholarshipCard key={application.id} application={application} accessToken={session} />
                    ))
                ) : (
                        <p className="text-gray-500 text-center">
                            No applications available at the moment.
                        </p>
                    )}
            </div>
        </div>
    )
}

async function fetchScholarships(session: Session): Promise<ScholarshipApplication[]> {
    try {
        const user_id = session.user?.id;
        const response = await fetch(`http://localhost:8002/applications/?user_id=${user_id}&skip=0&limit=100`, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                // @ts-expect-error Access token is defined
                'Authorization': `Bearer ${session?.accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data: ApiResponse[] = await response.json();
        const transformedData: ScholarshipApplication[] = data.map(transformApiResponse);
        return transformedData;
    } catch (err) {
        console.error("Failed to fetch applications:", err);
        return [];
    }
}
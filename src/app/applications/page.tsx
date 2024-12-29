"use client"

import { useEffect, useState } from "react";
import { ScholarshipCard } from "@/components/ui/applicationCard"
import { ScholarshipApplication, ApiResponse, transformApiResponse } from "@/types/application"
import { auth } from '../../auth';
import { redirect } from "next/navigation";

export default async function ScholarshipsPage() {
    const session = await auth();
    if (!session || !session.user || !session.user?.id) return redirect('/');

    const [applications, setApplications] = useState<ScholarshipApplication[]>([]);

    useEffect(() => {
        const fetchScholarships = async () => {

            try {
                const user_id = session.user?.id;
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/?user_id=${user_id}&skip=0&limit=100`, {
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
                const transformedData: ScholarshipApplication[] = data.map(transformApiResponse);
                setApplications(transformedData);
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            }
        };

        fetchScholarships();
    }, []);

    return (
        <div className="px-8 py-8">
            <div className="space-y-4">
                {applications.length > 0 ? (
                    applications.map((application) => (
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

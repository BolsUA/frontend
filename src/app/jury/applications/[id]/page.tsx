import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import Link from 'next/link'
import { auth } from '@/auth';
import GradeApplicationDialog from "@/components/gradingDialog"
import { revalidatePath } from 'next/cache';
import SubmitResultsButton from "@/components/submitResultsButton"

interface Application {
    id: string
    scholarship_id: string
    user_id: string
    name: string
    documents: { name: string, file_path: string, }[]
}

interface Scholarship {
    jury: number
}

async function getApplications(scholarship_id: string, accessToken: string): Promise<Application[] | null> {
    try {

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/grading/applications/${scholarship_id}`,
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

        return data?.map((application: Application) => ({
            id: application.id,
            scholarship_id: application.scholarship_id,
            user_id: application.user_id,
            name: application.name,
            documents: application.documents
        }));
    } catch (error) {
        console.error('Failed to fetch scholarships:', error);
        return null;
    }
}

async function getCurrentResults(scholarshipId: string, accessToken: string): Promise<Application[] | null> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grading/grades?scholarship_id=${scholarshipId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            console.error("API request failed:", response.status);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch scholarships:', error);
        return null;
    }
}

async function refreshResults(path: string) {
    'use server'
    revalidatePath(path)
}

export default async function ScholarshipsPage({ params }: { params: { id: string } }) {
    const session = await auth();

    if (!session?.user?.id) {
        return <div className="p-4">Please log in to view scholarships</div>;
    }

    // @ts-expect-error Session does not have accessToken
    if (!session.accessToken) {
        return <div className="p-4">Unauthorized</div>;
    }

    // @ts-expect-error Session does not have accessToken
    const applications = await getApplications(params.id, session.accessToken);
    if (!applications || applications.length === 0) {
        return <div className="p-4">No applications found</div>;
    }

    // @ts-expect-error Session does not have accessToken
    const results = await getCurrentResults(params.id, session.accessToken);
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">All Applications</h1>
            <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-4">
                    {applications.map((application) => (
                        <Card key={application.id} className="hover:shadow-lg hover:bg-gray-600 transition-shadow duration-300">
                            <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center p-6">
                                <div className="flex-grow mb-4 md:mb-0 md:mr-4">
                                    <h2 className="text-xl font-semibold mb-2">{application.name}</h2>
                                </div>
                                <div className="flex space-x-2">
                                    {application.documents.map((documents) => (
                                        <li
                                            key={documents.name}
                                            className="flex flex-col space-y-2 mb-4 p-2 border rounded-lg"
                                        >
                                            <div className="flex items-center">
                                                <FileText className="mr-2 h-4 w-4" />
                                                {documents.name}
                                            </div>
                                            {documents.file_path && (
                                                <Link
                                                    href={`${process.env.NEXT_PUBLIC_API_URL}/${documents.file_path}`}
                                                    target="_blank"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className="w-full mt-2"
                                                        size="sm"
                                                    >
                                                        Download Document
                                                    </Button>
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                    <GradeApplicationDialog
                                        session={session}
                                        application={application}
                                        results={results}
                                        refreshResults={refreshResults}
                                        path={`/jury/applications/${params.id}`}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
            <SubmitResultsButton
                applications={applications}
                results={results}
                scholarshipId={params.id}
                // @ts-expect-error Session does not have accessToken
                accessToken={session.accessToken}
            />
        </div>
    )
}

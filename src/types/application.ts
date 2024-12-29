export type ApplicationStatus = 'Submitted' | 'Rejected' | 'Approved' | 'Under Evaluation';

export interface ScholarshipApplication {
  id: string;
  scholarshipName: string;
  status: ApplicationStatus;
  grade?: number;
  userResponse?: 'Accepted' | 'Declined';
}

export type ApiResponse = {
  id: number;
  scholarship_id: number;
  user_id: string;
  status: string;
  created_at: string;
  name: string;
  documents: { name: string; file_path: string }[];
  user_response: string | null;
  grade: number | null;
};

export const transformApiResponse = (response: ApiResponse): ScholarshipApplication => {
  return {
    id: response.id.toString(), // Convert numeric ID to string
    scholarshipName: response.name,
    status: response.status as ScholarshipApplication["status"], // Type assertion
    grade: (response.status === "Approved" || response.status === "Reject") && "grade" in response ? (response as any).grade : undefined,
    userResponse: response.user_response === null ? undefined : response.user_response as 'Accepted' | 'Declined',
  };
};

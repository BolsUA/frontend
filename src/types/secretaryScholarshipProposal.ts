export interface ScholarshipProposal {
  id: string
  name: string
  description?: string
  publisher: string
  type: string
  spots: number
  jury: string[]
  deadline: string
  edictUrl: string
}

export type ApiResponse = {
  id: number;
  name: string;
  description?: string;
  publisher: string;
  type: string;
  spots: number;
  jury: { id: number; name: string }[];
  deadline: string; // ISO date string
  edict_id?: number;
  edict: { id: number; url: string };
};

export const transformApiResponse = (response: ApiResponse): ScholarshipProposal => {
  return {
    id: response.id.toString(),
    name: response.name,
    description: response.description,
    publisher: response.publisher,
    type: response.type,
    spots: response.spots,
    jury: response.jury.map(j => j.name),
    deadline: response.deadline,
    edictUrl: response.edict?.url || "",
  };
};

import api from './api';

export interface IssueData {
  title: string;
  description: string;
  location: string;
  images?: string[];
}

export interface Issue extends IssueData {
  _id: string;
  status: 'pending' | 'in-progress' | 'resolved';
  reportedBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const getIssues = async (): Promise<Issue[]> => {
  const response = await api.get('/issues');
  return response.data;
};

export const createIssue = async (data: IssueData): Promise<Issue> => {
  const response = await api.post('/issues', data);
  return response.data;
};

export const updateIssueStatus = async (id: string, status: Issue['status']): Promise<Issue> => {
  const response = await api.patch(`/issues/${id}/status`, { status });
  return response.data;
};
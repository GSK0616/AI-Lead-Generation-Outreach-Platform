import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Lead } from '@/types';
import api from '@/lib/api';

export function useLeads() {
  return useQuery<Lead[]>('leads', async () => {
    const { data } = await api.get('/leads');
    return data;
  });
}

export function useLeadById(id: string) {
  return useQuery<Lead>(['lead', id], async () => {
    const { data } = await api.get(`/leads/${id}`);
    return data;
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation(
    async (lead: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data } = await api.post('/leads', lead);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('leads');
      },
    }
  );
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, ...updates }: Partial<Lead> & { id: string }) => {
      const { data } = await api.put(`/leads/${id}`, updates);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('leads');
      },
    }
  );
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      await api.delete(`/leads/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('leads');
      },
    }
  );
}

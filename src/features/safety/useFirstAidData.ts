import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { FirstAidLog } from '../../types';

export function useFirstAidData() {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['first_aid_logs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('first_aid_logs').select('*');
      if (error) throw error;
      return (data || []).map(l => ({
        id: l.id,
        date: l.date,
        staffId: l.staff_id,
        incidentDescription: l.incident_description,
        treatmentProvided: l.treatment_provided,
        createdAt: l.created_at
      })) as FirstAidLog[];
    }
  });

  const addFirstAidMutation = useMutation({
    mutationFn: async (log: Omit<FirstAidLog, 'id'>) => {
      const { data, error } = await supabase.from('first_aid_logs').insert([{
        date: log.date,
        staff_id: log.staffId,
        incident_description: log.incidentDescription,
        treatment_provided: log.treatmentProvided
      }]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['first_aid_logs'] })
  });

  const deleteFirstAidMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('first_aid_logs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['first_aid_logs'] })
  });

  return {
    logs,
    isLoading,
    addFirstAid: addFirstAidMutation.mutateAsync,
    deleteFirstAid: deleteFirstAidMutation.mutateAsync
  };
}

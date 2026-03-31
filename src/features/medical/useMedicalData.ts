import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { ClinicalNote, MARChart, QuarantineRecord } from '../../types';

export const useMedicalData = () => {
  const queryClient = useQueryClient();

  const { data: clinicalNotes = [], isLoading: notesLoading } = useQuery({
    queryKey: ['clinical_notes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('clinical_notes').select('*');
      if (error) throw error;
      return data as ClinicalNote[];
    },
    select: (data) => data.filter(n => !n.is_deleted)
  });

  const { data: marCharts = [], isLoading: marLoading } = useQuery({
    queryKey: ['mar_charts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('mar_charts').select('*');
      if (error) throw error;
      return data as MARChart[];
    },
    select: (data) => data.filter(m => !m.is_deleted)
  });

  const { data: quarantineRecords = [], isLoading: quarantineLoading } = useQuery({
    queryKey: ['quarantine_records'],
    queryFn: async () => {
      const { data, error } = await supabase.from('quarantine_records').select('*');
      if (error) throw error;
      return data as QuarantineRecord[];
    },
    select: (data) => data.filter(q => !q.is_deleted)
  });

  const addClinicalNoteMutation = useMutation({
    mutationFn: async (note: Partial<ClinicalNote>) => {
      const { data, error } = await supabase.from('clinical_notes').insert([{
        ...note,
        id: note.id || crypto.randomUUID(),
        created_at: new Date().toISOString(),
        is_deleted: false
      }]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clinical_notes'] })
  });

  const addMarChartMutation = useMutation({
    mutationFn: async (chart: Partial<MARChart>) => {
      const { data, error } = await supabase.from('mar_charts').insert([{
        ...chart,
        id: chart.id || crypto.randomUUID(),
        created_at: new Date().toISOString(),
        is_deleted: false
      }]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mar_charts'] })
  });

  const addQuarantineRecordMutation = useMutation({
    mutationFn: async (record: Partial<QuarantineRecord>) => {
      const { data, error } = await supabase.from('quarantine_records').insert([{
        ...record,
        id: record.id || crypto.randomUUID(),
        created_at: new Date().toISOString(),
        is_deleted: false
      }]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quarantine_records'] })
  });

  const updateClinicalNoteMutation = useMutation({
    mutationFn: async (note: Partial<ClinicalNote>) => {
      const { data, error } = await supabase.from('clinical_notes')
        .update(note).eq('id', note.id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clinical_notes'] })
  });

  const updateQuarantineRecordMutation = useMutation({
    mutationFn: async (record: Partial<QuarantineRecord>) => {
      const { data, error } = await supabase.from('quarantine_records')
        .update(record).eq('id', record.id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quarantine_records'] })
  });

  return {
    clinicalNotes,
    marCharts,
    quarantineRecords,
    isLoading: notesLoading || marLoading || quarantineLoading,
    addClinicalNote: addClinicalNoteMutation.mutateAsync,
    updateClinicalNote: updateClinicalNoteMutation.mutateAsync,
    addMarChart: addMarChartMutation.mutateAsync,
    addQuarantineRecord: addQuarantineRecordMutation.mutateAsync,
    updateQuarantineRecord: updateQuarantineRecordMutation.mutateAsync,
    isOffline: false
  };
};

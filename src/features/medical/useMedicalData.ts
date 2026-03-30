import { useQuery, useMutation } from '@tanstack/react-query';
import { ClinicalNote, MARChart, QuarantineRecord, Animal } from '../../types';
import { supabase } from '../../lib/supabase';
import { queryClient } from '../../lib/queryClient';

export function useMedicalData() {
  const { data: clinicalNotes = [], isLoading: isLoadingNotes } = useQuery({
    queryKey: ['medical_logs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('medical_logs').select('*').eq('is_deleted', false);
      if (error) throw error;
      return data as ClinicalNote[];
    },
  });

  const { data: marCharts = [], isLoading: isLoadingCharts } = useQuery({
    queryKey: ['mar_charts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('mar_charts').select('*').eq('is_deleted', false);
      if (error) throw error;
      return data as MARChart[];
    },
  });

  const { data: quarantineRecords = [], isLoading: isLoadingQuarantine } = useQuery({
    queryKey: ['quarantine_records'],
    queryFn: async () => {
      const { data, error } = await supabase.from('quarantine_records').select('*').eq('is_deleted', false);
      if (error) throw error;
      return data as QuarantineRecord[];
    },
  });

  const { data: animals = [], isLoading: isLoadingAnimals } = useQuery({
    queryKey: ['animals'],
    queryFn: async () => {
      const { data, error } = await supabase.from('animals').select('*').eq('is_deleted', false);
      if (error) throw error;
      return data as Animal[];
    },
  });

  const isLoading = isLoadingNotes || isLoadingCharts || isLoadingQuarantine || isLoadingAnimals;

  const addClinicalNoteMutation = useMutation({
    mutationFn: async (note: Omit<ClinicalNote, 'id' | 'animal_name'>) => {
      const { data: animal } = await supabase.from('animals').select('name').eq('id', note.animal_id).single();
      const { error } = await supabase.from('medical_logs').insert({
        ...note,
        id: crypto.randomUUID(),
        animal_name: animal?.name || 'Unknown',
        is_deleted: false,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medical_logs'] }),
  });

  const updateClinicalNoteMutation = useMutation({
    mutationFn: async (note: ClinicalNote) => {
      const { error } = await supabase.from('medical_logs').update({
        ...note,
        updated_at: new Date().toISOString()
      }).eq('id', note.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medical_logs'] }),
  });

  const addMarChartMutation = useMutation({
    mutationFn: async (chart: Omit<MARChart, 'id' | 'animal_name' | 'administered_dates' | 'status'>) => {
      const { data: animal } = await supabase.from('animals').select('name').eq('id', chart.animal_id).single();
      const { error } = await supabase.from('mar_charts').insert({
        ...chart,
        id: crypto.randomUUID(),
        animal_name: animal?.name || 'Unknown',
        administered_dates: [],
        status: 'Active',
        is_deleted: false,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mar_charts'] }),
  });

  const updateMarChartMutation = useMutation({
    mutationFn: async (chart: MARChart) => {
      const { error } = await supabase.from('mar_charts').update({
        ...chart,
        updated_at: new Date().toISOString()
      }).eq('id', chart.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mar_charts'] }),
  });

  const signOffDoseMutation = useMutation({
    mutationFn: async ({ chartId, dateIso }: { chartId: string, dateIso: string }) => {
      const { data: chart } = await supabase.from('mar_charts').select('administered_dates').eq('id', chartId).single();
      if (chart) {
        const currentDates = chart.administered_dates || [];
        if (!currentDates.includes(dateIso)) {
          const { error } = await supabase.from('mar_charts').update({
            administered_dates: [...currentDates, dateIso],
            updated_at: new Date().toISOString()
          }).eq('id', chartId);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mar_charts'] }),
  });

  const addQuarantineRecordMutation = useMutation({
    mutationFn: async (record: Omit<QuarantineRecord, 'id' | 'animal_name' | 'status'>) => {
      const { data: animal } = await supabase.from('animals').select('name').eq('id', record.animal_id).single();
      const { error } = await supabase.from('quarantine_records').insert({
        ...record,
        id: crypto.randomUUID(),
        animal_name: animal?.name || 'Unknown',
        status: 'Active',
        is_deleted: false,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quarantine_records'] }),
  });

  const updateQuarantineRecordMutation = useMutation({
    mutationFn: async (record: QuarantineRecord) => {
      const { error } = await supabase.from('quarantine_records').update({
        ...record,
        updated_at: new Date().toISOString()
      }).eq('id', record.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quarantine_records'] }),
  });

  return { 
    clinicalNotes, 
    marCharts, 
    quarantineRecords, 
    animals, 
    isLoading, 
    addClinicalNote: addClinicalNoteMutation.mutate, 
    updateClinicalNote: updateClinicalNoteMutation.mutate, 
    addMarChart: addMarChartMutation.mutate, 
    updateMarChart: updateMarChartMutation.mutate, 
    signOffDose: (chartId: string, dateIso: string) => signOffDoseMutation.mutate({ chartId, dateIso }), 
    addQuarantineRecord: addQuarantineRecordMutation.mutate, 
    updateQuarantineRecord: updateQuarantineRecordMutation.mutate 
  };
}

import { useCallback, useMemo, useState, useEffect } from 'react';
import { LogEntry, LogType } from '../../types';
import { useAnimalsData } from '../animals/useAnimalsData';
import { supabase } from '../../lib/supabase';

export const useDailyLogData = (viewDate: string, activeCategory: string, animalId?: string) => {
  const { animals, isLoading: animalsLoading } = useAnimalsData();
  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadLogs = async () => {
      try {
        // Online Primary
        const { data, error } = await supabase.from('daily_logs').select('*');
        
        if (error) throw error;

        if (data && isMounted) {
          // JS Filtering
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const activeLogs = data.filter((log: any) => !log.is_deleted);
          setAllLogs(activeLogs);
          setIsLogsLoading(false);
        }
      } catch (err) {
        console.error("Supabase fetch failed:", err);
        if (isMounted) setIsLogsLoading(false);
      }
    };

    loadLogs();

    return () => {
      isMounted = false;
    };
  }, [viewDate, animalId]);

  const logs = useMemo(() => allLogs, [allLogs]);

  const getTodayLog = useCallback((animalId: string, type: LogType) => {
    return logs.find(log => log.animal_id === animalId && log.log_type === type);
  }, [logs]);

  const addLogEntry = useCallback(async (entry: Partial<LogEntry>) => {
    try {
      const { error } = await supabase.from('daily_logs').insert({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        is_deleted: false,
        ...entry
      });
      if (error) throw error;
    } catch (err) {
      console.error('Failed to add log entry:', err);
    }
  }, []);

  const filteredAnimals = useMemo(() => {
    return animals.filter(a => activeCategory === 'all' || a.category === activeCategory);
  }, [animals, activeCategory]);

  return { 
    animals: filteredAnimals, 
    getTodayLog, 
    addLogEntry, 
    dailyLogs: logs, 
    isLoading: animalsLoading || isLogsLoading 
  };
};

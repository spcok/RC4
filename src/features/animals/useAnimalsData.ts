import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const useAnimalsData = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animals, setAnimals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        // Online Primary: Fetch from Supabase
        const { data, error } = await supabase.from('animals').select('*');
        
        if (error) throw error;

        if (data && isMounted) {
          // JS Filtering
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const activeAnimals = data.filter((a: any) => !a.is_deleted && !a.archived);
          setAnimals(activeAnimals);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Supabase fetch failed:", err);
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { animals, isLoading };
};

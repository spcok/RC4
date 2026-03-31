import { useState, useEffect } from 'react';
import { Animal, Task } from '../../types';
import { supabase } from '../../lib/supabase';

export function useFeedingScheduleData() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [
          { data: animalsData },
          { data: tasksData }
        ] = await Promise.all([
          supabase.from('animals').select('*'),
          supabase.from('tasks').select('*')
        ]);

        if (isMounted) {
          setAnimals((animalsData || []) as Animal[]);
          setTasks((tasksData || []) as Task[]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load feeding schedule data:', err);
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  const addTasks = async (newTasks: Task[]) => {
    try {
      const { error } = await supabase.from('tasks').insert(newTasks.map(task => ({
        ...task,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      })));
      if (error) throw error;
    } catch (err) {
      console.error('Failed to add tasks:', err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return {
    animals,
    tasks,
    isLoading,
    addTasks,
    deleteTask
  };
}

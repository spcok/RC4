import { useState, useMemo, useEffect } from 'react';
import { Task, User, UserRole, Animal } from '../../types';
import { supabase } from '../../lib/supabase';

const mockUsers: User[] = [
  { id: 'u1', email: 'john@example.com', name: 'John Doe', initials: 'JD', role: UserRole.VOLUNTEER },
  { id: 'u2', email: 'jane@example.com', name: 'Jane Smith', initials: 'JS', role: UserRole.ADMIN }
];

export const useTaskData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [
          { data: tasksData },
          { data: animalsData }
        ] = await Promise.all([
          supabase.from('tasks').select('*'),
          supabase.from('animals').select('*')
        ]);

        if (isMounted) {
          setTasks((tasksData || []) as Task[]);
          setAnimals((animalsData || []) as Animal[]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load task data:', err);
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  const [filter, setFilter] = useState<'assigned' | 'pending' | 'completed'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = mockUsers[0];

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter === 'completed' && !task.completed) return false;
      if (filter === 'pending' && task.completed) return false;
      if (filter === 'assigned' && (task.assigned_to !== currentUser.id || task.completed)) return false;

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const animalName = animals.find(a => a.id === task.animal_id)?.name.toLowerCase() || '';
        return (
          task.title.toLowerCase().includes(searchLower) ||
          animalName.includes(searchLower)
        );
      }
      return true;
    });
  }, [tasks, filter, searchTerm, currentUser.id, animals]);

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    try {
      const { error } = await supabase.from('tasks').insert({
        ...newTask,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      
      // Refresh tasks
      const { data: tasksData } = await supabase.from('tasks').select('*');
      if (tasksData) setTasks(tasksData as Task[]);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase.from('tasks').update(updates).eq('id', id);
      if (error) throw error;
      
      // Refresh tasks
      const { data: tasksData } = await supabase.from('tasks').select('*');
      if (tasksData) setTasks(tasksData as Task[]);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      
      // Refresh tasks
      const { data: tasksData } = await supabase.from('tasks').select('*');
      if (tasksData) setTasks(tasksData as Task[]);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    try {
      const { error } = await supabase.from('tasks').update({ 
        completed: !task.completed,
        completed_at: !task.completed ? new Date().toISOString() : null
      }).eq('id', task.id);
      if (error) throw error;
      
      // Refresh tasks
      const { data: tasksData } = await supabase.from('tasks').select('*');
      if (tasksData) setTasks(tasksData as Task[]);
    } catch (err) {
      console.error('Failed to toggle task completion:', err);
    }
  };

  return { tasks: filteredTasks, animals, users: mockUsers, isLoading, filter, setFilter, searchTerm, setSearchTerm, addTask, updateTask, deleteTask, toggleTaskCompletion, currentUser };
};

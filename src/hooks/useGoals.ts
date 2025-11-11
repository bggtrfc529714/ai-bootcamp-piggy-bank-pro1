import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export const useGoals = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch goals
  const {
    data: goals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(g => ({
        id: g.id,
        name: g.name,
        targetAmount: Number(g.target_amount),
        currentAmount: Number(g.current_amount),
      })) as Goal[];
    },
    enabled: !!user,
  });

  // Add goal
  const addGoalMutation = useMutation({
    mutationFn: async (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('goals')
        .insert([
          {
            user_id: user.id,
            name: goal.name,
            target_amount: goal.targetAmount,
            current_amount: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
      toast({
        title: 'Goal Created!',
        description: 'Start saving towards your goal!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update goal progress
  const updateGoalProgressMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const goal = goals.find(g => g.id === id);
      if (!goal) throw new Error('Goal not found');

      const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);

      const { error } = await supabase
        .from('goals')
        .update({ current_amount: newAmount })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
      toast({
        title: 'Progress Updated!',
        description: 'Money added to your goal!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete goal
  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('goals').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
      toast({
        title: 'Deleted',
        description: 'Goal removed successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    goals,
    isLoading,
    error,
    addGoal: addGoalMutation.mutate,
    updateGoalProgress: updateGoalProgressMutation.mutate,
    deleteGoal: deleteGoalMutation.mutate,
  };
};

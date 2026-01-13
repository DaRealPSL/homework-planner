import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/core/lib/supabase';
import type { Homework, HomeworkAttachment, HomeworkCompletion } from '@/core/types/database';
import { getCurrentUser } from '@/core/lib/supabase';

interface HomeworkWithRelations extends Homework {
  attachments: HomeworkAttachment[];
  completion: HomeworkCompletion[];
  creator?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function useRealtimeHomework(classId: string) {
  const [homework, setHomework] = useState<HomeworkWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHomework = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('homework')
        .select(`
          *,
          homework_attachments(*),
          homework_completion(*),
          creator:profiles!homework_created_by_fkey(display_name, avatar_url)
        `)
        .eq('class_id', classId)
        .order('due_date', { ascending: true });

      if (error) throw error;

      setHomework(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (!classId) return;

    fetchHomework();

    // Subscribe to homework changes
    const homeworkSubscription = supabase
      .channel(`homework-${classId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'homework',
          filter: `class_id=eq.${classId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setHomework((prev) => [...prev, payload.new as HomeworkWithRelations]);
          } else if (payload.eventType === 'UPDATE') {
            setHomework((prev) =>
              prev.map((hw) =>
                hw.id === payload.new.id ? (payload.new as HomeworkWithRelations) : hw
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setHomework((prev) => prev.filter((hw) => hw.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Subscribe to attachment changes
    const attachmentSubscription = supabase
      .channel(`attachments-${classId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'homework_attachments',
        },
        () => {
          // Refetch homework to get updated attachments
          fetchHomework();
        }
      )
      .subscribe();

    // Subscribe to completion changes
    const completionSubscription = supabase
      .channel(`completion-${classId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'homework_completion',
        },
        () => {
          // Refetch homework to get updated completion status
          fetchHomework();
        }
      )
      .subscribe();

    return () => {
      homeworkSubscription.unsubscribe();
      attachmentSubscription.unsubscribe();
      completionSubscription.unsubscribe();
    };
  }, [classId, fetchHomework]);

  const toggleCompletion = async (homeworkId: string, done: boolean) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // First, check if a completion record exists
      const { data: existing } = await supabase
        .from('homework_completion')
        .select('id')
        .eq('homework_id', homeworkId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('homework_completion')
          .update({
            done,
            updated_at: new Date().toISOString(),
          })
          .eq('homework_id', homeworkId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('homework_completion')
          .insert({
            homework_id: homeworkId,
            user_id: user.id,
            done,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      // Refetch to update UI
      await fetchHomework();
    } catch (err) {
      console.error('Error toggling completion:', err);
      throw err;
    }
  };

  return {
    homework,
    loading,
    error,
    toggleCompletion,
    refetch: fetchHomework,
  };
}
// src/hooks/useRealtimeHomework.ts
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/core/lib/supabase';
import { getCurrentUser } from '@/core/lib/supabase';
import type { Homework, HomeworkAttachment, HomeworkCompletion } from '@/core/types/database';
import type {
  HomeworkWithRelations,
  RealtimePostgresPayload,
} from '@/core/types/supabase-overrides';

/**
 * Normalize a raw row returned by Supabase (which uses `homework_attachments` and
 * `homework_completion`) into our `HomeworkWithRelations` shape (which expects
 * `attachments` and `completion`).
 */
function normalizeRow(raw: any): HomeworkWithRelations {
  return {
    // copy base homework fields (we keep unknown extras)
    ...(raw as Homework),

    // map relation fields
    attachments: (raw.homework_attachments as HomeworkAttachment[]) ?? [],
    completion: (raw.homework_completion as HomeworkCompletion[]) ?? [],

    // map creator (supabase returned field name in your select)
    creator:
      raw.creator && typeof raw.creator === 'object'
        ? {
            display_name: raw.creator.display_name ?? null,
            avatar_url: raw.creator.avatar_url ?? null,
          }
        : undefined,

    // allow other fields to pass through
    // (if raw has fields that are not in Homework, they'll remain on the object)
    // NOTE: the spread above already copied raw fields; we intentionally keep it.
  } as HomeworkWithRelations;
}

export function useRealtimeHomework(classId: string) {
  const [homework, setHomework] = useState<HomeworkWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHomework = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('homework')
        .select(`
          *,
          homework_attachments(*),
          homework_completion(*),
          creator:profiles!homework_created_by_fkey(display_name, avatar_url)
        `)
        .eq('class_id', classId)
        .order('due_date', { ascending: true });

      if (fetchError) throw fetchError;

      const rows = (data as any[]) ?? [];
      const normalized = rows.map(normalizeRow);
      setHomework(normalized);
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
        (payload: RealtimePostgresPayload<any>) => {
          // Normalize incoming payload rows (payload.new / payload.old use DB names)
          const newRaw = (payload.new ?? null) as any;
          const oldRaw = (payload.old ?? null) as any;
          const newRow = newRaw ? normalizeRow(newRaw) : null;
          const oldRow = oldRaw ? normalizeRow(oldRaw) : null;
          const evt = (payload.eventType || '').toUpperCase();

          if (evt === 'INSERT' && newRow) {
            setHomework((prev) => {
              const exists = prev.some((h) => h.id === newRow.id);
              return exists ? prev : [...prev, newRow];
            });
          } else if (evt === 'UPDATE' && newRow) {
            setHomework((prev) => prev.map((hw) => (hw.id === newRow.id ? newRow : hw)));
          } else if (evt === 'DELETE' && oldRow) {
            setHomework((prev) => prev.filter((hw) => hw.id !== oldRow.id));
          }
        }
      )
      .subscribe();

    // Subscribe to attachment changes (refetch attachments on change)
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

    // Subscribe to completion changes (refetch completion status on change)
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
      try {
        homeworkSubscription.unsubscribe();
      } catch {
        /* ignore */
      }
      try {
        attachmentSubscription.unsubscribe();
      } catch {
        /* ignore */
      }
      try {
        completionSubscription.unsubscribe();
      } catch {
        /* ignore */
      }
    };
  }, [classId, fetchHomework]);

  const toggleCompletion = async (homeworkId: string, done: boolean) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // First, check if a completion record exists
      const { data: existing, error: existingError } = await supabase
        .from('homework_completion')
        .select('id')
        .eq('homework_id', homeworkId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingError) throw existingError;

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('homework_completion')
          .update({
            done,
            updated_at: new Date().toISOString(),
          })
          .eq('homework_id', homeworkId)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('homework_completion')
          .insert({
            homework_id: homeworkId,
            user_id: user.id,
            done,
            updated_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      }

      // Refetch to update UI
      await fetchHomework();
    } catch (err) {
      // eslint-disable-next-line no-console
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

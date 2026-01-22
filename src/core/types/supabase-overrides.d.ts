//src/core/types/supabase-overrides.d.ts
export type RealtimePostgresPayload<T = any> = {
  schema?: string;
  table?: string;
  type?: string; // e.g. 'INSERT' | 'UPDATE' | 'DELETE'
  eventType?: string; // some libs call it eventType
  commit_timestamp?: string;
  new?: T | null;
  old?: T | null;
  [key: string]: any;
};

/**
 * HomeworkWithRelations: matches the shape returned by our complex select:
 * - DB returns homework_attachments/homework_completion and we may map them to attachments/completion.
 * - Keep fields optional/nullable to match DB and avoid compile errors across components.
 */
export interface HomeworkWithRelations {
  id: string;
  class_id?: string;
  title?: string | null;
  description?: string | null | undefined;
  subject?: string | null | undefined;
  due_date?: string | null | undefined;
  created_by?: string | null | undefined;
  created_at?: string | null | undefined;
  updated_at?: string | null | undefined;

  // DB-returned relation names
  homework_attachments?: any[]; // raw DB relation
  homework_completion?: any[];

  // convenient names the UI uses
  attachments?: any[];
  completion?: any[];

  // creator alias from your select
  creator?: { display_name?: string | null; avatar_url?: string | null } | null;

  [k: string]: any;
}

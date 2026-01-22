//src/core/types/supabase-overrides.ts
import type { Tables } from './database';

/**
 * HomeworkWithRelations: matches the shape returned by our complex select
 * with joined relations from Supabase.
 */
export interface HomeworkWithRelations {
	id: string;
	class_id?: string;
	title?: string | null;
	description?: string | null;
	subject?: string | null;
	due_date?: string | null;
	created_by?: string | null;
	created_at?: string | null;
	updated_at?: string | null;

	// DB-returned relation names
	homework_attachments?: any[];
	homework_completion?: any[];

	// Convient aliases for the UI
	attachments?: any[];
	completion?: any[];

	// Creator alias from select
	creator?: {
		display_name?: string | null;
		avatar_url?: string | null;
	} | null;

	[k: string]: any;
}

export type RealtimePostgresPayload<T = any> = {
	schema?: string;
	table?: string;
	type?: string;
	eventType?: string;
	commit_timetamp?: string;
	new?: T | null;
	old?: T | null;
	[key: string]: any;
}



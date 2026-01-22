//src/core/types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      classes: {
        Row: {
          id: string;
          code: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          class_id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          class_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      homework: {
        Row: {
          id: string;
          class_id: string;
          title: string;
          description: string | null;
          subject: string | null;
          due_date: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          title: string;
          description?: string | null;
          subject?: string | null;
          due_date: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          title?: string;
          description?: string | null;
          subject?: string | null;
          due_date?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "homework_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "homework_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      homework_attachments: {
        Row: {
          id: string;
          homework_id: string;
          storage_path: string;
          filename: string;
          mime_type: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          homework_id: string;
          storage_path: string;
          filename: string;
          mime_type: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          homework_id?: string;
          storage_path?: string;
          filename?: string;
          mime_type?: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "homework_attachments_homework_id_fkey";
            columns: ["homework_id"];
            isOneToOne: false;
            referencedRelation: "homework";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "homework_attachments_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      homework_completion: {
        Row: {
          id: string;
          homework_id: string;
          user_id: string;
          done: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          homework_id: string;
          user_id: string;
          done?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          homework_id?: string;
          user_id?: string;
          done?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "homework_completion_homework_id_fkey";
            columns: ["homework_id"];
            isOneToOne: false;
            referencedRelation: "homework";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "homework_completion_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      // add this inside Database.public.Tables { ... }
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          priority?: 'low' | 'normal' | 'high' | 'urgent' | null;
          pinned: boolean;
          class_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at?: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content?: string | null;
          priority: 'low' | 'normal' | 'high' | 'urgent' | null;
          pinned?: boolean;
          class_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string | null;
          priority: 'low' | 'normal' | 'high' | 'urgent' | null;
          pinned?: boolean;
          class_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcements_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      audit_logs: {
        Row: {
          id: string;
          action: string;
          user_id: string | null;
          metadata: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          action: string;
          user_id?: string | null;
          metadata?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          action?: string;
          user_id?: string | null;
          metadata?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          type: string; // e.g. 'info' | 'reminder' | 'alert'
          title: string;
          message: string | null;
          read: boolean;
          user_id?: string | null;
          class_id?: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          title: string;
          message?: string | null;
          read?: boolean;
          user_id?: string | null;
          class_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          title?: string;
          message?: string | null;
          read?: boolean;
          user_id?: string | null;
          class_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
        ];
      };
      content_reports: {
        Row: {
          id: string;
          homework_id: string;
          reported_by: string;
          reason: string;
          description: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          homework_id: string;
          reported_by: string;
          reason: string;
          description?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          homework_id?: string;
          reported_by?: string;
          reason?: string;
          description?: string | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_reports_homework_id_fkey";
            columns: ["homework_id"];
            isOneToOne: false;
            referencedRelation: "homework";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_reports_reported_by_fkey";
            columns: ["reported_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      }
    };
  };
  Views: {
    [_ in never]: never;
  };
  Functions: {
    get_class_by_code: {
      Args: {
        p_code: string;
      };
      Returns: Array<{
        id: string;
        class_id: string;
        code: string;
        name: string | null;
      }>;
    };
  };
  Enums: {
    [_ in never]: never;
  };
  CompositeTypes: {
    [_ in never]: never;
  };
};


export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Insert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Update<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Homework = Tables<"homework">;
export type HomeworkAttachment = Tables<"homework_attachments">;
export type HomeworkCompletion = Tables<"homework_completion">;
export type Profile = Tables<"profiles">;
export type Class = Tables<"classes">;

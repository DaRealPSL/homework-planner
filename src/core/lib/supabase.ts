// src/core/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

import { supabaseAnonKey, supabaseUrl} from '../config/constants';

const DEBUG = false;

if (DEBUG) {
  console.group("Supabase debug");
  console.log("url:", supabaseUrl);
  console.log("urlValid:", supabaseUrl.startsWith("https://"));
  console.log("hasAnonKey:", Boolean(supabaseAnonKey));
  console.log("keyLength:", supabaseAnonKey.length);
  console.log(
    "keyType:",
    supabaseAnonKey.startsWith("eyJ")
      ? "legacy-jwt"
      : supabaseAnonKey.startsWith("sb_publishable_")
      ? "publishable"
      : "unknown"
  );
  console.groupEnd();
}

if (DEBUG && (!supabaseUrl || !supabaseAnonKey)) {
  console.error("supabase env vars missing");
  throw new Error("missing supabase environment variables");
}

if (DEBUG && !supabaseUrl.startsWith("https://")) {
  console.error("invalid supabase url");
  throw new Error("invalid supabase url");
}

if (DEBUG) console.log("creating supabase client");

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

if (DEBUG) console.log("supabase client ready");

// Test connection
supabase
  .from("classes")
  .select("count", { count: "exact", head: true })
  .then(({ error, count }) => {
    if (!DEBUG) return;

    if (error) {
      console.error("supabase connection test failed", error);
    } else {
      console.log("supabase connection ok");
      console.log("classesTableAccessible:", count !== null);
    }
  });

// Helper function to get current user
export const getCurrentUser = async () => {
  const {
    data: { user },
  //} = await supabase.auth.getUser();
  } = await supabase.auth.getUser();
  return user;
};

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  localStorage.removeItem("classId");
};

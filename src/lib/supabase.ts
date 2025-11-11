import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration - optional for demo mode
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Create a dummy client for demo mode
let supabase: SupabaseClient | null = null;

// Only create real client if credentials are provided
if (supabaseUrl !== 'https://demo.supabase.co' && supabaseAnonKey !== 'demo-key') {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Types
export type Dimension = 'health' | 'skills' | 'discipline' | 'social' | 'finance' | 'mood';

export interface Decision {
  id: string;
  category: string;
  action: string;
  intensity: number;
  context?: string;
  sentiment: number;
  decided_at: string;
  created_at: string;
}

export interface AltDecision {
  id: string;
  decision_ref: string;
  alt_action: string;
  rationale: string;
  generated_at: string;
}

export interface DailyDelta {
  id: string;
  day: string;
  dim: Dimension;
  real_score: number;
  alt_score: number;
  delta: number;
}

export interface SyncTask {
  id: string;
  title: string;
  dim: Dimension;
  effort: number;
  due_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface UserGoals {
  primary: string;
  secondary?: string;
  target_divergence?: number;
}

export interface UserBaseline {
  health: number;
  skills: number;
  discipline: number;
  social: number;
  finance: number;
  mood: number;
}

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  photo_url?: string;
  goals: UserGoals;
  baseline: UserBaseline;
  streak: number;
  created_at: string;
}

// Mock user for demo (replace with real auth)
export const mockUser: UserProfile = {
  id: 'demo-user-001',
  username: 'demo_user',
  display_name: 'Demo User',
  goals: {
    primary: 'health',
    secondary: 'skills',
    target_divergence: -10
  },
  baseline: {
    health: 50,
    skills: 50,
    discipline: 50,
    social: 50,
    finance: 50,
    mood: 50
  },
  streak: 0,
  created_at: new Date().toISOString()
};
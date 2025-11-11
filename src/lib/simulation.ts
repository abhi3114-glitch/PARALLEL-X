import { Dimension, Decision, AltDecision, DailyDelta, SyncTask } from './supabase';
import { generateAIAlternateDecision, AIAlternateDecision } from './groq';

// Policy Matrix: maps actions to dimension impacts
interface PolicyImpact {
  [key: string]: Partial<Record<Dimension, number>>;
}

export const POLICY_MATRIX: PolicyImpact = {
  // Positive actions
  'workout': { health: 3, discipline: 2, mood: 1 },
  'study': { skills: 4, discipline: 1, mood: 1 },
  'sleep_extra': { health: 2, mood: 1, skills: 1 },
  'meditate': { mood: 3, discipline: 2, health: 1 },
  'social_event': { social: 3, mood: 2 },
  'save_money': { finance: 2, discipline: 1 },
  'read_book': { skills: 3, mood: 1 },
  'cook_healthy': { health: 2, finance: 1, discipline: 1 },
  'network': { social: 2, skills: 1 },
  'side_project': { skills: 3, finance: 1, discipline: 2 },
  
  // Negative actions
  'scroll_phone': { discipline: -2, mood: -1, skills: -1 },
  'skip_workout': { health: -2, discipline: -1 },
  'junk_food': { health: -2, finance: -1 },
  'oversleep': { discipline: -2, mood: -1 },
  'impulse_buy': { finance: -3, discipline: -1 },
  'procrastinate': { discipline: -3, skills: -1, mood: -1 },
  'skip_social': { social: -2, mood: -1 },
  'stay_up_late': { health: -2, mood: -1, discipline: -1 }
};

// Map user actions to policy keys
export function mapActionToPolicy(action: string): string {
  const actionLower = action.toLowerCase();
  
  if (actionLower.includes('workout') || actionLower.includes('exercise') || actionLower.includes('gym')) {
    return actionLower.includes('skip') ? 'skip_workout' : 'workout';
  }
  if (actionLower.includes('study') || actionLower.includes('learn') || actionLower.includes('course')) {
    return 'study';
  }
  if (actionLower.includes('sleep') && (actionLower.includes('extra') || actionLower.includes('more'))) {
    return 'sleep_extra';
  }
  if (actionLower.includes('meditate') || actionLower.includes('mindful')) {
    return 'meditate';
  }
  if (actionLower.includes('social') || actionLower.includes('friend') || actionLower.includes('party')) {
    return actionLower.includes('skip') ? 'skip_social' : 'social_event';
  }
  if (actionLower.includes('save') || actionLower.includes('invest')) {
    return 'save_money';
  }
  if (actionLower.includes('read') || actionLower.includes('book')) {
    return 'read_book';
  }
  if (actionLower.includes('cook') || actionLower.includes('meal prep')) {
    return 'cook_healthy';
  }
  if (actionLower.includes('scroll') || actionLower.includes('social media') || actionLower.includes('tiktok')) {
    return 'scroll_phone';
  }
  if (actionLower.includes('junk') || actionLower.includes('fast food') || actionLower.includes('pizza')) {
    return 'junk_food';
  }
  if (actionLower.includes('procrastinate') || actionLower.includes('delay')) {
    return 'procrastinate';
  }
  if (actionLower.includes('buy') && (actionLower.includes('impulse') || actionLower.includes('unnecessary'))) {
    return 'impulse_buy';
  }
  
  // Default neutral
  return 'neutral';
}

// Calculate impact vector from decision
export function calculateImpact(decision: Decision): Partial<Record<Dimension, number>> {
  const policyKey = mapActionToPolicy(decision.action);
  const baseImpact = POLICY_MATRIX[policyKey] || {};
  
  // Scale by intensity (1-5)
  const scaledImpact: Partial<Record<Dimension, number>> = {};
  for (const [dim, value] of Object.entries(baseImpact)) {
    scaledImpact[dim as Dimension] = value * (decision.intensity / 3);
  }
  
  // Adjust by sentiment (-2 to +2)
  if (decision.sentiment !== 0) {
    const sentimentBonus = decision.sentiment * 0.5;
    for (const dim of Object.keys(scaledImpact) as Dimension[]) {
      scaledImpact[dim]! += sentimentBonus;
    }
  }
  
  return scaledImpact;
}

// Calculate impact from AI alternate decision
export function calculateAIImpact(aiDecision: AIAlternateDecision): Partial<Record<Dimension, number>> {
  const impact: Partial<Record<Dimension, number>> = {};
  
  for (const impactItem of aiDecision.expectedImpact) {
    const dim = impactItem.dimension as Dimension;
    if (dim) {
      impact[dim] = impactItem.change;
    }
  }
  
  return impact;
}

// Generate alternate decision (AI-powered with fallback)
export async function generateAlternateDecision(decision: Decision): Promise<AltDecision & { aiPowered?: boolean; aiData?: AIAlternateDecision }> {
  try {
    // Try AI-powered generation
    const aiDecision = await generateAIAlternateDecision(
      decision.action,
      decision.category,
      decision.intensity,
      decision.sentiment,
      decision.context
    );
    
    return {
      id: `alt-${decision.id}`,
      decision_ref: decision.id,
      alt_action: aiDecision.action,
      rationale: aiDecision.rationale,
      generated_at: new Date().toISOString(),
      aiPowered: true,
      aiData: aiDecision
    };
  } catch (error) {
    console.error('AI generation failed, using fallback:', error);
    return generateFallbackAlternate(decision);
  }
}

// Fallback alternate decision generation
function generateFallbackAlternate(decision: Decision): AltDecision {
  const policyKey = mapActionToPolicy(decision.action);
  const impact = POLICY_MATRIX[policyKey] || {};
  
  // Find the most negative dimension
  const negDims = Object.entries(impact)
    .filter(([_, val]) => val < 0)
    .sort(([_, a], [__, b]) => a - b);
  
  let altAction = '';
  let rationale = '';
  
  if (negDims.length > 0) {
    // Flip negative action to positive
    const alternatives: Record<string, string> = {
      'scroll_phone': 'read_book',
      'skip_workout': 'workout',
      'junk_food': 'cook_healthy',
      'oversleep': 'sleep_extra',
      'impulse_buy': 'save_money',
      'procrastinate': 'study',
      'skip_social': 'social_event',
      'stay_up_late': 'meditate'
    };
    
    const altKey = alternatives[policyKey] || 'workout';
    altAction = altKey.replace(/_/g, ' ');
    rationale = `Instead of ${decision.action}, your alternate self chose to ${altAction}, improving ${negDims[0][0]} and overall wellbeing.`;
  } else {
    // Already positive, make it even better
    altAction = `${decision.action} (extended session)`;
    rationale = `Your alternate self doubled down on this positive choice, maximizing the benefits.`;
  }
  
  return {
    id: `alt-${decision.id}`,
    decision_ref: decision.id,
    alt_action: altAction,
    rationale,
    generated_at: new Date().toISOString()
  };
}

// Simulate daily deltas with AI support
export async function simulateDailyDeltas(
  realDecisions: Decision[],
  altDecisions: (AltDecision & { aiPowered?: boolean; aiData?: AIAlternateDecision })[],
  day: string
): Promise<DailyDelta[]> {
  const dimensions: Dimension[] = ['health', 'skills', 'discipline', 'social', 'finance', 'mood'];
  const realScores: Record<Dimension, number> = {
    health: 0, skills: 0, discipline: 0, social: 0, finance: 0, mood: 0
  };
  const altScores: Record<Dimension, number> = {
    health: 0, skills: 0, discipline: 0, social: 0, finance: 0, mood: 0
  };
  
  // Calculate real scores
  realDecisions.forEach(decision => {
    const impact = calculateImpact(decision);
    for (const [dim, value] of Object.entries(impact)) {
      realScores[dim as Dimension] += value;
    }
  });
  
  // Calculate alternate scores (AI-powered or rule-based)
  altDecisions.forEach(altDec => {
    if (altDec.aiPowered && altDec.aiData) {
      // Use AI-calculated impact
      const impact = calculateAIImpact(altDec.aiData);
      for (const [dim, value] of Object.entries(impact)) {
        altScores[dim as Dimension] += value * 1.1; // 10% bonus for AI decisions
      }
    } else {
      // Use rule-based impact
      const altAction = altDec.alt_action.toLowerCase();
      const policyKey = mapActionToPolicy(altAction);
      const impact = POLICY_MATRIX[policyKey] || {};
      
      for (const [dim, value] of Object.entries(impact)) {
        altScores[dim as Dimension] += value * 1.2; // 20% bonus for alternate
      }
    }
  });
  
  // Generate deltas
  return dimensions.map(dim => ({
    id: `delta-${day}-${dim}`,
    day,
    dim,
    real_score: Math.round(realScores[dim] * 10) / 10,
    alt_score: Math.round(altScores[dim] * 10) / 10,
    delta: Math.round((altScores[dim] - realScores[dim]) * 10) / 10
  }));
}

// Calculate Multiverse Score (sum of positive deltas)
export function calculateMultiverseScore(deltas: DailyDelta[]): number {
  return deltas.reduce((sum, delta) => {
    return sum + Math.max(0, delta.delta);
  }, 0);
}

// Generate Reality Sync Tasks with AI enhancement
export function generateSyncTasks(deltas: DailyDelta[]): SyncTask[] {
  // Find top 3 dimensions with highest positive delta
  const topDeltas = [...deltas]
    .filter(d => d.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3);
  
  const taskTemplates: Record<Dimension, string[]> = {
    health: [
      '30-minute workout session',
      'Prepare a healthy meal',
      'Get 8 hours of sleep tonight',
      '10-minute meditation',
      'Take a 20-minute walk outside'
    ],
    skills: [
      'Complete one online course module',
      'Read 20 pages of a skill-building book',
      'Practice coding for 1 hour',
      'Watch an educational video',
      'Work on a personal project for 45 minutes'
    ],
    discipline: [
      'Wake up at your target time',
      'Complete your morning routine',
      'Finish one important task before lunch',
      'Avoid phone for 2 hours',
      'Stick to your schedule today'
    ],
    social: [
      'Call a friend or family member',
      'Attend a social event',
      'Send 3 meaningful messages',
      'Join a community activity',
      'Have a quality conversation'
    ],
    finance: [
      'Review and update your budget',
      'Save $50 today',
      'Cancel one unnecessary subscription',
      'Research one investment opportunity',
      'Track all expenses today'
    ],
    mood: [
      'Practice gratitude journaling',
      'Spend 30 minutes on a hobby',
      'Take a walk in nature',
      'Listen to uplifting music',
      'Do something that makes you smile'
    ]
  };
  
  return topDeltas.map(delta => {
    const templates = taskTemplates[delta.dim];
    const randomTask = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      id: `task-${Date.now()}-${delta.dim}-${Math.random().toString(36).substr(2, 9)}`,
      title: randomTask,
      dim: delta.dim,
      effort: Math.min(5, Math.ceil(Math.abs(delta.delta) / 2)),
      due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };
  });
}
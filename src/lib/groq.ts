import Groq from 'groq-sdk';
import { Decision, DailyDelta } from './supabase';

// Initialize Groq client
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || '';

let groqClient: Groq | null = null;

if (groqApiKey && groqApiKey !== 'your_groq_api_key_here') {
  groqClient = new Groq({
    apiKey: groqApiKey,
    dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
  });
}

export { groqClient };

// Types for AI responses
export interface AIAlternateDecision {
  action: string;
  rationale: string;
  expectedImpact: {
    dimension: string;
    change: number;
    explanation: string;
  }[];
  difficulty: number;
  timeframe: string;
}

export interface AIInsight {
  type: 'warning' | 'success' | 'info' | 'tip';
  title: string;
  message: string;
  actionable: boolean;
  suggestedAction?: string;
}

export interface AIAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  motivationalMessage: string;
}

// Generate alternate decision using Groq AI
export async function generateAIAlternateDecision(
  realAction: string,
  category: string,
  intensity: number,
  sentiment: number,
  context?: string
): Promise<AIAlternateDecision> {
  if (!groqClient) {
    // Fallback to rule-based system
    return generateFallbackAlternate(realAction, category, intensity);
  }

  try {
    const prompt = `You are an AI life coach analyzing decisions. A person made this decision:

Action: ${realAction}
Category: ${category}
Intensity (1-5): ${intensity}
Sentiment (-2 to +2): ${sentiment}
${context ? `Context: ${context}` : ''}

Generate an alternate, better decision they could have made instead. Consider:
- Health, Skills, Discipline, Social, Finance, and Mood dimensions
- Realistic and actionable alternatives
- Positive long-term impact

Respond in JSON format:
{
  "action": "specific alternate action",
  "rationale": "why this is better",
  "expectedImpact": [
    {"dimension": "health", "change": 2, "explanation": "brief explanation"},
    {"dimension": "skills", "change": 3, "explanation": "brief explanation"}
  ],
  "difficulty": 3,
  "timeframe": "30 minutes"
}`;

    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert life coach and decision analyst. Provide practical, actionable advice in JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    const parsed = JSON.parse(response);
    return parsed as AIAlternateDecision;
  } catch (error) {
    console.error('Error generating AI alternate decision:', error);
    return generateFallbackAlternate(realAction, category, intensity);
  }
}

// Generate personalized insights using AI
export async function generateAIInsights(
  decisions: Decision[],
  deltas: DailyDelta[]
): Promise<AIInsight[]> {
  if (!groqClient || decisions.length === 0) {
    return generateFallbackInsights(deltas);
  }

  try {
    const recentDecisions = decisions.slice(-5).map(d => ({
      action: d.action,
      category: d.category,
      intensity: d.intensity
    }));

    const prompt = `Analyze these recent decisions and performance gaps:

Recent Decisions: ${JSON.stringify(recentDecisions)}
Performance Gaps: ${JSON.stringify(deltas.map(d => ({ dimension: d.dim, gap: d.delta })))}

Generate 3-4 personalized insights as a life coach. Each insight should be:
- Specific and actionable
- Encouraging but honest
- Focused on improvement

Respond in JSON format:
{
  "insights": [
    {
      "type": "warning|success|info|tip",
      "title": "short title",
      "message": "detailed message",
      "actionable": true,
      "suggestedAction": "specific action to take"
    }
  ]
}`;

    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a supportive life coach providing personalized insights. Be encouraging but realistic.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    const parsed = JSON.parse(response);
    return parsed.insights as AIInsight[];
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return generateFallbackInsights(deltas);
  }
}

// Generate comprehensive analysis
export async function generateAIAnalysis(
  decisions: Decision[],
  deltas: DailyDelta[],
  completedTasks: number
): Promise<AIAnalysis> {
  if (!groqClient || decisions.length === 0) {
    return generateFallbackAnalysis(deltas, completedTasks);
  }

  try {
    const prompt = `Provide a comprehensive life analysis based on:

Total Decisions: ${decisions.length}
Completed Sync Tasks: ${completedTasks}
Performance Gaps: ${JSON.stringify(deltas.map(d => ({ dimension: d.dim, yourScore: d.real_score, alternateScore: d.alt_score, gap: d.delta })))}

Generate a motivational analysis in JSON format:
{
  "overallScore": 75,
  "strengths": ["list of 2-3 strengths"],
  "weaknesses": ["list of 2-3 areas to improve"],
  "recommendations": ["list of 3-4 specific recommendations"],
  "motivationalMessage": "encouraging message about their journey"
}`;

    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert life coach providing comprehensive analysis. Be specific, actionable, and motivating.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    const parsed = JSON.parse(response);
    return parsed as AIAnalysis;
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    return generateFallbackAnalysis(deltas, completedTasks);
  }
}

// Fallback functions for when AI is not available
function generateFallbackAlternate(action: string, category: string, intensity: number): AIAlternateDecision {
  const alternatives: Record<string, Omit<AIAlternateDecision, 'difficulty' | 'timeframe'>> = {
    'Health & Fitness': {
      action: 'Complete a 30-minute workout session',
      rationale: 'Regular exercise improves physical health and mental clarity',
      expectedImpact: [
        { dimension: 'health', change: 3, explanation: 'Cardiovascular and strength benefits' },
        { dimension: 'discipline', change: 2, explanation: 'Building consistent habits' },
        { dimension: 'mood', change: 1, explanation: 'Endorphin release' }
      ]
    },
    'Learning & Skills': {
      action: 'Study for 1 hour on a skill-building course',
      rationale: 'Continuous learning compounds over time',
      expectedImpact: [
        { dimension: 'skills', change: 4, explanation: 'Direct skill development' },
        { dimension: 'discipline', change: 1, explanation: 'Focused learning time' }
      ]
    },
    'default': {
      action: 'Choose a more productive alternative',
      rationale: 'Small improvements compound into significant changes',
      expectedImpact: [
        { dimension: 'discipline', change: 2, explanation: 'Building better habits' }
      ]
    }
  };

  const alt = alternatives[category] || alternatives['default'];
  return {
    ...alt,
    difficulty: Math.min(5, intensity + 1),
    timeframe: '30-60 minutes'
  };
}

function generateFallbackInsights(deltas: DailyDelta[]): AIInsight[] {
  const insights: AIInsight[] = [];
  
  const worstDelta = deltas.reduce((worst, current) => 
    current.delta > worst.delta ? current : worst
  , deltas[0]);

  if (worstDelta && worstDelta.delta > 2) {
    insights.push({
      type: 'warning',
      title: `${worstDelta.dim.charAt(0).toUpperCase() + worstDelta.dim.slice(1)} needs attention`,
      message: `Your alternate self is ahead by ${worstDelta.delta.toFixed(1)} points in ${worstDelta.dim}. Focus on this dimension to close the gap.`,
      actionable: true,
      suggestedAction: `Complete sync tasks related to ${worstDelta.dim}`
    });
  }

  const bestDelta = deltas.reduce((best, current) => 
    current.delta < best.delta ? current : best
  , deltas[0]);

  if (bestDelta && bestDelta.delta < -1) {
    insights.push({
      type: 'success',
      title: `Excelling in ${bestDelta.dim}!`,
      message: `You're ahead of your alternate self by ${Math.abs(bestDelta.delta).toFixed(1)} points. Keep up the great work!`,
      actionable: false
    });
  }

  insights.push({
    type: 'tip',
    title: 'Consistency is key',
    message: 'Small daily improvements compound into remarkable results over time. Focus on building sustainable habits.',
    actionable: true,
    suggestedAction: 'Log at least one decision daily'
  });

  return insights;
}

function generateFallbackAnalysis(deltas: DailyDelta[], completedTasks: number): AIAnalysis {
  const avgDelta = deltas.reduce((sum, d) => sum + d.delta, 0) / deltas.length;
  const score = Math.max(0, Math.min(100, 70 - avgDelta * 5));

  return {
    overallScore: Math.round(score),
    strengths: deltas.filter(d => d.delta < 0).map(d => `Strong ${d.dim} performance`),
    weaknesses: deltas.filter(d => d.delta > 2).map(d => `${d.dim.charAt(0).toUpperCase() + d.dim.slice(1)} needs improvement`),
    recommendations: [
      'Focus on completing sync tasks daily',
      'Log decisions consistently to track progress',
      'Prioritize dimensions with the largest gaps',
      'Celebrate small wins to maintain motivation'
    ],
    motivationalMessage: completedTasks > 0 
      ? `You've completed ${completedTasks} sync tasks! Every step forward counts. Keep pushing toward your best self.`
      : 'Your journey to becoming your best self starts now. Every decision matters!'
  };
}
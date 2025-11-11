import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Decision, DailyDelta, mockUser } from '@/lib/supabase';
import { 
  simulateDailyDeltas, 
  generateAlternateDecision, 
  calculateMultiverseScore,
  generateSyncTasks 
} from '@/lib/simulation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Target, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [deltas, setDeltas] = useState<DailyDelta[]>([]);
  const [multiverseScore, setMultiverseScore] = useState(0);
  const [divergence, setDivergence] = useState(0);

  useEffect(() => {
    try {
      // Load decisions from localStorage
      const storedDecisions = JSON.parse(localStorage.getItem('decisions') || '[]');
      setDecisions(storedDecisions);

      if (storedDecisions.length > 0) {
        // Generate alternate decisions
        const altDecisions = storedDecisions.map(generateAlternateDecision);
        
        // Simulate today's deltas
        const today = new Date().toISOString().split('T')[0];
        const todayDeltas = simulateDailyDeltas(storedDecisions, altDecisions, today);
        setDeltas(todayDeltas);
        
        // Calculate scores
        const msScore = calculateMultiverseScore(todayDeltas);
        setMultiverseScore(Math.round(msScore * 10) / 10);
        
        // Total divergence (positive means alternate is ahead, negative means you're ahead)
        const totalDivergence = todayDeltas.reduce((sum, d) => sum + d.delta, 0);
        setDivergence(Math.round(totalDivergence * 10) / 10);
        
        // Generate and save sync tasks if not exists
        const existingTasks = JSON.parse(localStorage.getItem('syncTasks') || '[]');
        if (existingTasks.length === 0) {
          const newTasks = generateSyncTasks(todayDeltas);
          localStorage.setItem('syncTasks', JSON.stringify(newTasks));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  const radarData = deltas.map(d => ({
    dimension: d.dim.charAt(0).toUpperCase() + d.dim.slice(1),
    'You (Real)': Math.max(0, Math.abs(d.real_score)),
    'Alternate Self': Math.max(0, Math.abs(d.alt_score))
  }));

  const barData = deltas.map(d => ({
    name: d.dim.charAt(0).toUpperCase() + d.dim.slice(1),
    delta: d.delta,
    fill: d.delta > 0 ? '#ef4444' : '#10b981'
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {mockUser.display_name}
            </h1>
            <p className="text-slate-400">
              Compare your reality with your alternate self
            </p>
          </div>
          <Link to="/log">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Log New Decision
            </Button>
          </Link>
        </div>

        {decisions.length === 0 ? (
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Activity className="w-16 h-16 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No decisions logged yet</h3>
              <p className="text-slate-400 text-center mb-6">
                Start logging your daily decisions to see how your alternate self would choose differently
              </p>
              <Link to="/log">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Log Your First Decision
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/20 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardDescription className="text-purple-300">Multiverse Score</CardDescription>
                  <CardTitle className="text-3xl text-white flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    {multiverseScore}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-200">
                    Areas where alternate is ahead
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 border-pink-500/20 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardDescription className="text-pink-300">Total Gap</CardDescription>
                  <CardTitle className="text-3xl text-white flex items-center gap-2">
                    {divergence > 0 ? (
                      <TrendingDown className="w-6 h-6 text-red-400" />
                    ) : (
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    )}
                    {divergence > 0 ? '+' : ''}{divergence}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-pink-200">
                    {divergence > 0 ? 'Alternate is ahead' : divergence < 0 ? 'You are ahead!' : 'Perfectly aligned'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/20 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardDescription className="text-blue-300">Decisions Today</CardDescription>
                  <CardTitle className="text-3xl text-white flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-400" />
                    {decisions.length}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-200">
                    Logged and simulated
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white">Performance Comparison</CardTitle>
                  <CardDescription className="text-slate-400">
                    You vs your alternate self across all dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#ffffff20" />
                      <PolarAngleAxis 
                        dataKey="dimension" 
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                      />
                      <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fill: '#94a3b8' }} />
                      <Radar 
                        name="You (Real)" 
                        dataKey="You (Real)" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.4} 
                      />
                      <Radar 
                        name="Alternate Self" 
                        dataKey="Alternate Self" 
                        stroke="#a855f7" 
                        fill="#a855f7" 
                        fillOpacity={0.4} 
                      />
                      <Legend wrapperStyle={{ color: '#fff' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white">Dimension Gaps</CardTitle>
                  <CardDescription className="text-slate-400">
                    Red = Alternate ahead | Green = You ahead
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #ffffff20',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value: number) => [
                          value > 0 ? `Alternate +${value}` : `You +${Math.abs(value)}`,
                          'Gap'
                        ]}
                      />
                      <Bar dataKey="delta" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Dimension Details */}
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Dimension Breakdown</CardTitle>
                <CardDescription className="text-slate-400">
                  Detailed comparison for each life dimension
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deltas.map(delta => (
                    <div key={delta.dim} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium capitalize">
                          {delta.dim}
                        </span>
                        <span className={`text-sm font-semibold ${
                          delta.delta > 0 ? 'text-red-400' : delta.delta < 0 ? 'text-green-400' : 'text-slate-400'
                        }`}>
                          {delta.delta > 0 ? `Alternate +${delta.delta}` : delta.delta < 0 ? `You +${Math.abs(delta.delta)}` : 'Tied'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-20">You:</span>
                        <Progress 
                          value={Math.min(100, Math.abs(delta.real_score) * 10)} 
                          className="flex-1 h-2 bg-slate-800"
                        />
                        <span className="text-xs text-blue-400 w-12 text-right">{Math.abs(delta.real_score).toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-20">Alternate:</span>
                        <Progress 
                          value={Math.min(100, Math.abs(delta.alt_score) * 10)} 
                          className="flex-1 h-2 bg-slate-800"
                        />
                        <span className="text-xs text-purple-400 w-12 text-right">{Math.abs(delta.alt_score).toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
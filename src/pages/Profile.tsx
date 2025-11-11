import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockUser, Decision, SyncTask } from '@/lib/supabase';
import { Flame, Trophy, Target, Calendar, Award, TrendingUp } from 'lucide-react';

export default function Profile() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    const storedDecisions = JSON.parse(localStorage.getItem('decisions') || '[]');
    setDecisions(storedDecisions);

    // Calculate streak (simplified - just count days with decisions)
    const uniqueDays = new Set(
      storedDecisions.map((d: Decision) => d.decided_at.split('T')[0])
    );
    setStreak(uniqueDays.size);

    // Award badges based on milestones
    const earnedBadges: string[] = [];
    if (storedDecisions.length >= 1) earnedBadges.push('First Decision');
    if (storedDecisions.length >= 5) earnedBadges.push('Getting Started');
    if (storedDecisions.length >= 10) earnedBadges.push('Committed');
    if (uniqueDays.size >= 3) earnedBadges.push('3-Day Streak');
    if (uniqueDays.size >= 7) earnedBadges.push('Week Warrior');
    
    const syncTasks: SyncTask[] = JSON.parse(localStorage.getItem('syncTasks') || '[]');
    const completedTasks = syncTasks.filter((t: SyncTask) => t.completed_at);
    if (completedTasks.length >= 1) earnedBadges.push('First Sync');
    if (completedTasks.length >= 5) earnedBadges.push('Reality Shifter');

    setBadges(earnedBadges);
  }, []);

  const badgeIcons: Record<string, string> = {
    'First Decision': '🎯',
    'Getting Started': '🚀',
    'Committed': '💪',
    '3-Day Streak': '🔥',
    'Week Warrior': '⚡',
    'First Sync': '✨',
    'Reality Shifter': '🌟'
  };

  const stats = [
    { label: 'Total Decisions', value: decisions.length, icon: Target, color: 'text-purple-400' },
    { label: 'Current Streak', value: `${streak} days`, icon: Flame, color: 'text-orange-400' },
    { label: 'Badges Earned', value: badges.length, icon: Award, color: 'text-yellow-400' },
    { label: 'Rank', value: '#127', icon: Trophy, color: 'text-blue-400' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Your Profile
          </h1>
          <p className="text-slate-400">
            Track your progress and achievements
          </p>
        </div>

        {/* Profile Card */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/20 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-purple-500/30">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                  {mockUser.display_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {mockUser.display_name}
                </h2>
                <p className="text-purple-200 mb-4">@{mockUser.username}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    Primary Goal: {mockUser.goals.primary}
                  </Badge>
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                    Member since {new Date(mockUser.created_at).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-900/50 border-white/10 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Badges */}
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Achievements
            </CardTitle>
            <CardDescription className="text-slate-400">
              Badges you've earned on your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {badges.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Start logging decisions to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-white/10 hover:border-purple-500/30 transition-all"
                  >
                    <div className="text-4xl">{badgeIcons[badge]}</div>
                    <div className="text-sm font-medium text-white text-center">
                      {badge}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-400">
              Your latest decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {decisions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No activity yet. Start logging decisions!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {decisions.slice(-5).reverse().map((decision) => (
                  <div
                    key={decision.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-white/5"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{decision.action}</p>
                      <p className="text-sm text-slate-400">{decision.category}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-slate-400 border-slate-600">
                        Intensity {decision.intensity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
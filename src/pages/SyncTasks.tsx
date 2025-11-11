import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { SyncTask } from '@/lib/supabase';
import { toast } from 'sonner';
import { Target, CheckCircle2, Clock, Zap } from 'lucide-react';
import { format } from 'date-fns';

export default function SyncTasks() {
  const [tasks, setTasks] = useState<SyncTask[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const storedTasks = JSON.parse(localStorage.getItem('syncTasks') || '[]');
    setTasks(storedTasks);
    setCompletedCount(storedTasks.filter((t: SyncTask) => t.completed_at).length);
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const isCompleting = !task.completed_at;
        return {
          ...task,
          completed_at: isCompleting ? new Date().toISOString() : undefined
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    localStorage.setItem('syncTasks', JSON.stringify(updatedTasks));
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed_at) {
      toast.success('Task completed! You\'re syncing with your best timeline.', {
        icon: '🎉'
      });
      setCompletedCount(prev => prev + 1);
    } else {
      setCompletedCount(prev => prev - 1);
    }
  };

  const dimensionColors: Record<string, string> = {
    health: 'bg-red-500/20 text-red-400 border-red-500/30',
    skills: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    discipline: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    social: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    finance: 'bg-green-500/20 text-green-400 border-green-500/30',
    mood: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };

  const activeTasks = tasks.filter(t => !t.completed_at);
  const completedTasks = tasks.filter(t => t.completed_at);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Reality Sync Tasks
          </h1>
          <p className="text-slate-400">
            Complete these actions to bridge the gap with your alternate self
          </p>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/20 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Sync Progress</h3>
                  <p className="text-purple-200 text-sm">
                    {completedCount} of {tasks.length} tasks completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
                </div>
                <p className="text-purple-200 text-sm">Complete</p>
              </div>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {tasks.length === 0 ? (
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Zap className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No sync tasks yet</h3>
              <p className="text-slate-400 text-center">
                Log some decisions first, and we'll generate personalized tasks to help you sync with your best timeline
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Active Tasks */}
            {activeTasks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Active Tasks ({activeTasks.length})
                </h2>
                <div className="grid gap-4">
                  {activeTasks.map(task => (
                    <Card 
                      key={task.id} 
                      className="bg-slate-900/50 border-white/10 backdrop-blur hover:border-purple-500/30 transition-all cursor-pointer"
                      onClick={() => handleToggleTask(task.id)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Checkbox 
                            checked={false}
                            className="mt-1 border-white/20"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="text-white font-medium text-lg">
                                {task.title}
                              </h3>
                              <Badge className={dimensionColors[task.dim]}>
                                {task.dim}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <Zap className="w-4 h-4" />
                                Effort: {task.effort}/5
                              </span>
                              {task.due_at && (
                                <span>
                                  Due: {format(new Date(task.due_at), 'MMM d, h:mm a')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Completed ({completedTasks.length})
                </h2>
                <div className="grid gap-4">
                  {completedTasks.map(task => (
                    <Card 
                      key={task.id} 
                      className="bg-slate-900/30 border-white/5 backdrop-blur opacity-60 hover:opacity-100 transition-all cursor-pointer"
                      onClick={() => handleToggleTask(task.id)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Checkbox 
                            checked={true}
                            className="mt-1 border-green-500/50"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="text-white/70 font-medium text-lg line-through">
                                {task.title}
                              </h3>
                              <Badge className={dimensionColors[task.dim]}>
                                {task.dim}
                              </Badge>
                            </div>
                            <p className="text-sm text-green-400">
                              Completed {format(new Date(task.completed_at!), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
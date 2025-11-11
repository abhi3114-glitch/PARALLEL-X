import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Decision } from '@/lib/supabase';
import { toast } from 'sonner';
import { Smile, Meh, Frown, Loader2, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Health & Fitness',
  'Learning & Skills',
  'Work & Career',
  'Social & Relationships',
  'Finance & Money',
  'Leisure & Entertainment',
  'Sleep & Rest',
  'Other'
];

export default function LogDecision() {
  const navigate = useNavigate();
  const [action, setAction] = useState('');
  const [category, setCategory] = useState('');
  const [intensity, setIntensity] = useState([3]);
  const [sentiment, setSentiment] = useState(0);
  const [context, setContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const aiEnabled = import.meta.env.VITE_GROQ_API_KEY && 
    import.meta.env.VITE_GROQ_API_KEY !== 'your_groq_api_key_here';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!action || !category) {
      toast.error('Please fill in action and category');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const decision: Decision = {
        id: `dec-${Date.now()}`,
        category,
        action,
        intensity: intensity[0],
        context: context || undefined,
        sentiment,
        decided_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      // Save to localStorage
      const decisions = JSON.parse(localStorage.getItem('decisions') || '[]');
      decisions.push(decision);
      localStorage.setItem('decisions', JSON.stringify(decisions));
      
      // Clear sync tasks to regenerate with new decision
      localStorage.removeItem('syncTasks');
      
      toast.success(
        aiEnabled 
          ? '✨ Decision logged! AI is analyzing your alternate path...' 
          : 'Decision logged successfully!',
        {
          duration: 3000
        }
      );
      
      // Reset form
      setAction('');
      setCategory('');
      setIntensity([3]);
      setSentiment(0);
      setContext('');
      
      // Navigate to dashboard
      setTimeout(() => navigate('/'), 500);
    } catch (error) {
      console.error('Error logging decision:', error);
      toast.error('Failed to log decision. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-2">
            Log Your Decision
            {aiEnabled && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
                <Sparkles className="w-3 h-3" />
                AI Enhanced
              </span>
            )}
          </h1>
          <p className="text-slate-400">
            Record what you chose to do. {aiEnabled ? 'AI will generate' : 'We\'ll simulate'} how your alternate self would choose differently.
          </p>
        </div>
        
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Real Timeline Decision</CardTitle>
            <CardDescription className="text-slate-400">
              Be honest about your actual choice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="action" className="text-white">What did you do?</Label>
                <Input
                  id="action"
                  placeholder="e.g., Scrolled social media for 2 hours"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Category</Label>
                <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
                  <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-white">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Intensity (1-5)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <span className="text-white font-bold text-lg w-8 text-center">
                    {intensity[0]}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  How much time/energy did you invest?
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">How did it feel?</Label>
                <div className="flex gap-2">
                  {[-2, -1, 0, 1, 2].map(val => (
                    <Button
                      key={val}
                      type="button"
                      variant={sentiment === val ? "default" : "outline"}
                      onClick={() => setSentiment(val)}
                      disabled={isSubmitting}
                      className={sentiment === val 
                        ? "bg-purple-500 hover:bg-purple-600" 
                        : "bg-slate-800/50 border-white/10 text-white hover:bg-slate-700"
                      }
                    >
                      {val === -2 && <Frown className="w-5 h-5" />}
                      {val === -1 && <Frown className="w-5 h-5 opacity-60" />}
                      {val === 0 && <Meh className="w-5 h-5" />}
                      {val === 1 && <Smile className="w-5 h-5 opacity-60" />}
                      {val === 2 && <Smile className="w-5 h-5" />}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="context" className="text-white">
                  Context (optional)
                  {aiEnabled && <span className="text-purple-400 text-xs ml-2">• Helps AI understand better</span>}
                </Label>
                <Textarea
                  id="context"
                  placeholder="Any additional details..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 min-h-[80px]"
                  disabled={isSubmitting}
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Log Decision'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
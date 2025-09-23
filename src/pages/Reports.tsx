import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Mic, Users, Trophy, Star } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';

export default function Reports() {
  const { state } = useUser();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!state.user?.isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!state.onboardingCompleted) {
      navigate('/dashboard');
      return;
    }
  }, [state.user, state.onboardingCompleted, navigate]);

  // Calculate statistics
  const totalSessions = state.therapySessions.length;
  const speechSessions = state.therapySessions.filter(s => s.type === 'speech');
  const socialTasksCount = state.socialTasksCompleted.length;
  
  const averageScore = speechSessions.length > 0 
    ? speechSessions.reduce((sum, s) => sum + (s.score || 0), 0) / speechSessions.length
    : 0;

  const recentSessions = [...state.therapySessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-therapy-success';
    if (score >= 60) return 'text-therapy-level';
    return 'text-muted-foreground';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-primary mb-2">
            Progress Reports
          </h1>
          <p className="text-muted-foreground text-lg">
            Track {state.child?.name}'s therapy journey and achievements
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="therapy-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary-soft/20">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="outline" className="text-xs">
                  Current
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Level
                </p>
                <p className="text-2xl font-bold text-primary">
                  {state.currentLevel}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(state.levelProgress)}% to next level
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="therapy-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-accent-soft/20">
                  <Mic className="h-6 w-6 text-accent" />
                </div>
                <Badge variant="outline" className="text-xs">
                  Sessions
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Speech Therapy
                </p>
                <p className="text-2xl font-bold text-accent">
                  {speechSessions.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: {Math.round(averageScore)}%
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="therapy-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-secondary-soft/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="outline" className="text-xs">
                  Skills
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Social Tasks
                </p>
                <p className="text-2xl font-bold text-primary">
                  {socialTasksCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Completed
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="therapy-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-therapy-success/20">
                  <TrendingUp className="h-6 w-6 text-therapy-success" />
                </div>
                <Badge variant="outline" className="text-xs">
                  Total
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  All Sessions
                </p>
                <p className="text-2xl font-bold text-therapy-success">
                  {totalSessions}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Activities
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Session History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="therapy-card p-8">
            <h3 className="text-therapy-lg text-primary mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Session History
            </h3>

            {recentSessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h4 className="text-lg font-medium text-muted-foreground mb-2">
                  No sessions yet
                </h4>
                <p className="text-sm text-muted-foreground">
                  Start your first therapy session to see progress here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-card-soft rounded-xl hover:bg-secondary-soft/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary-soft/20">
                        {session.type === 'speech' ? (
                          <Mic className="h-4 w-4 text-primary" />
                        ) : (
                          <Users className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      
                      <div>
                        <p className="font-medium text-foreground">
                          {session.type === 'speech' ? 'Speech Therapy' : 'Social Skills'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        Level {session.level}
                      </Badge>
                      
                      {session.score !== undefined && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-therapy-success" />
                          <Badge 
                            variant={getScoreBadgeVariant(session.score)}
                            className={`${getScoreColor(session.score)} text-xs`}
                          >
                            {session.score}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Insights */}
        {totalSessions > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="therapy-card p-8 warm-gradient">
              <h3 className="text-therapy-lg text-primary mb-4">
                Progress Insights
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    🎯 Performance
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {averageScore >= 80 
                      ? `Excellent work! ${state.child?.name} is consistently performing at a high level.`
                      : averageScore >= 60
                      ? `Good progress! ${state.child?.name} is steadily improving with practice.`
                      : `${state.child?.name} is building foundational skills. Keep practicing regularly!`
                    }
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    📈 Consistency
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {totalSessions >= 10
                      ? `Great consistency! Regular practice is key to success.`
                      : totalSessions >= 5
                      ? `Building momentum! Try to maintain regular practice sessions.`
                      : `Just getting started! Aim for regular practice sessions for best results.`
                    }
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
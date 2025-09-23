import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Users, FileText, Star, Trophy, Calendar, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import ProgressCircle from '@/components/Dashboard/ProgressCircle';
import StatCard from '@/components/Dashboard/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';

export default function Dashboard() {
  const { state } = useUser();
  const navigate = useNavigate();

  // Redirect if not authenticated or onboarding not completed
  useEffect(() => {
    if (!state.user?.isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!state.onboardingCompleted) {
      navigate('/child-info');
      return;
    }
  }, [state.user, state.onboardingCompleted, navigate]);

  const totalSessions = state.therapySessions.length;
  const speechSessions = state.therapySessions.filter(s => s.type === 'speech').length;
  const socialTasks = state.socialTasksCompleted.length;
  const averageScore = totalSessions > 0 
    ? state.therapySessions
        .filter(s => s.score !== undefined)
        .reduce((sum, s) => sum + (s.score || 0), 0) / speechSessions || 0
    : 0;

  const progressToNextLevel = state.levelProgress;

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left"
        >
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            {state.child?.name}'s therapy journey continues
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Current Level"
            value={state.currentLevel}
            subtitle="Keep going!"
            icon={Trophy}
            delay={0.1}
          />
          
          <StatCard
            title="Speech Sessions"
            value={speechSessions}
            subtitle="Total completed"
            icon={Mic}
            delay={0.2}
          />
          
          <StatCard
            title="Social Tasks"
            value={socialTasks}
            subtitle="Skills practiced"
            icon={Users}
            delay={0.3}
          />
          
          <StatCard
            title="Average Score"
            value={`${Math.round(averageScore)}%`}
            subtitle="Speech therapy"
            icon={TrendingUp}
            delay={0.4}
          />
        </div>

        {/* Progress and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Level Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="therapy-card p-8 text-center">
              <h3 className="text-therapy-lg text-primary mb-6">
                Level {state.currentLevel} Progress
              </h3>
              
              <div className="mb-6">
                <ProgressCircle 
                  progress={progressToNextLevel} 
                  size={140}
                  strokeWidth={10}
                />
              </div>
              
              <p className="text-muted-foreground mb-4">
                {progressToNextLevel < 100 
                  ? `${100 - progressToNextLevel}% to Level ${state.currentLevel + 1}`
                  : 'Ready to level up!'
                }
              </p>
              
              {progressToNextLevel >= 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-therapy-success font-medium"
                >
                  🎉 Congratulations! Level up available!
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="therapy-card p-8">
              <h3 className="text-therapy-lg text-primary mb-6">
                Continue Learning
              </h3>
              
              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/therapy')}
                  className="w-full p-4 rounded-xl bg-primary-soft hover:bg-primary text-foreground hover:text-primary-foreground font-medium transition-all duration-200 hover:scale-105 active:scale-95 justify-start"
                >
                  <Mic className="mr-3 h-5 w-5" />
                  Start Speech Therapy
                </Button>
                
                <Button
                  onClick={() => navigate('/social')}
                  variant="outline"
                  className="w-full p-4 rounded-xl justify-start hover:bg-secondary-soft"
                >
                  <Users className="mr-3 h-5 w-5" />
                  Practice Social Skills
                </Button>
                
                <Button
                  onClick={() => navigate('/reports')}
                  variant="outline"
                  className="w-full p-4 rounded-xl justify-start hover:bg-secondary-soft"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  View Progress Reports
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="therapy-card p-8">
            <h3 className="text-therapy-lg text-primary mb-6">
              Recent Activity
            </h3>
            
            {totalSessions === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🌟</div>
                <p className="text-muted-foreground mb-4">
                  Ready to start your first session?
                </p>
                <Button
                  onClick={() => navigate('/therapy')}
                  className="px-6 py-3 rounded-xl bg-primary-soft hover:bg-primary text-foreground hover:text-primary-foreground font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Begin Speech Therapy
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.therapySessions.slice(-3).reverse().map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-card-soft rounded-xl"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-primary-soft/20 mr-4">
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
                          {new Date(session.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {session.score !== undefined && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-therapy-success mr-1" />
                        <span className="font-medium text-therapy-success">
                          {session.score}%
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Users, FileText, Star, Trophy, Calendar, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import ProgressCircle from '@/components/Dashboard/ProgressCircle';
import StatCard from '@/components/Dashboard/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate();

  // Redirect if not authenticated or onboarding not completed
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }
  }, []);

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
            Child's therapy journey continues
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Current Level"
            value={1}
            subtitle="Keep going!"
            icon={Trophy}
            delay={0.1}
          />
          
          <StatCard
            title="Speech Sessions"
            value={4}
            subtitle="Total completed"
            icon={Mic}
            delay={0.2}
          />
          
          <StatCard
            title="Social Tasks"
            value={2}
            subtitle="Skills practiced"
            icon={Users}
            delay={0.3}
          />
          
          <StatCard
            title="Average Score"
            value={`${Math.round(80)}%`}
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
                Level {1} Progress
              </h3>
              
              <div className="mb-6">
                <ProgressCircle 
                  progress={2} 
                  size={140}
                  strokeWidth={10}
                />
              </div>
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
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
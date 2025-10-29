import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, RotateCcw } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import TaskCard from '@/components/Social/TaskCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import socialTasks from '@/data/socialTasks.json';
import { useAuth } from '@/hooks/useAuth';

export default function SocialSkills() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedToday, setCompletedToday] = useState<string[]>([]);

  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }
  }, [isLoggedIn, navigate]);

  // Get unique categories
  const categories = ['all', ...new Set(socialTasks.map(task => task.category))];

  // Filter tasks by category
  const filteredTasks = selectedCategory === 'all' 
    ? socialTasks 
    : socialTasks.filter(task => task.category === selectedCategory);

  // Check if task is completed (either permanently or today)
  const isTaskCompleted = (taskId: number) => {
    return completedToday.includes(taskId.toString());
  };

  const handleTaskComplete = (taskId: number) => {
    const taskIdStr = taskId.toString();
    
    if (!completedToday.includes(taskIdStr)) {
      setCompletedToday([...completedToday, taskIdStr]);
      
      // Add to permanent completion list
      
      const task = socialTasks.find(t => t.id === taskId);
      
      toast({
        title: '🎉 Great job!',
        description: `You've practiced "${task?.task}". Keep up the good work!`,
      });
    }
  };

  const handleReset = () => {
    setCompletedToday([]);
    toast({
      title: 'Session Reset',
      description: 'You can now practice all tasks again today.',
    });
  };

  const completedCount = filteredTasks.filter(task => isTaskCompleted(task.id)).length;
  const totalCount = filteredTasks.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
            Social Skills Practice
          </h1>
          <p className="text-muted-foreground text-lg">
            Help your child learn important social skills
          </p>
        </motion.div>

        {/* Progress and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="therapy-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-therapy-lg text-primary mb-2">
                    Today's Progress
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-therapy-success">
                      {completedCount}/{totalCount}
                    </span>
                    <div className="flex-1 max-w-xs">
                      <div className="w-full bg-secondary-soft rounded-full h-3">
                        <motion.div
                          className="h-3 rounded-full therapy-progress"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {progressPercentage}%
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Today
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="therapy-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="text-therapy-lg text-primary">
                  Categories
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 capitalize ${
                      selectedCategory === category
                        ? 'bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground'
                        : 'hover:bg-secondary-soft'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Tasks Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredTasks.length === 0 ? (
            <Card className="therapy-card p-12 text-center">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-therapy-lg text-primary mb-2">
                No tasks found
              </h3>
              <p className="text-muted-foreground">
                Try selecting a different category
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <TaskCard
                    task={task}
                    isCompleted={isTaskCompleted(task.id)}
                    onComplete={handleTaskComplete}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Completion Message */}
        {completedCount === totalCount && totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="therapy-card p-8 warm-gradient">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-therapy-xl text-primary mb-2">
                Fantastic Work!
              </h3>
              <p className="text-muted-foreground mb-4">
                Your child has practiced all the social skills today!
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-xl bg-primary-soft hover:bg-primary text-foreground hover:text-primary-foreground font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Return to Dashboard
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
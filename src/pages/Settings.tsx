import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Settings as SettingsIcon, LogOut, Trash2 } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Settings() {
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [childData, setChildData] = useState({
    name: 'John Doe',
    age: '10',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }
  }, [isLoggedIn, navigate]);

  const handleChildUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!childData.name.trim() || !childData.age.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    const age = parseInt(childData.age);
    if (isNaN(age) || age < 1 || age > 18) {
      toast({
        title: 'Invalid Age',
        description: 'Please enter a valid age between 1 and 18.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Information Updated',
      description: 'Child information has been successfully updated.',
    });
  };

  const handleLogout = () => {
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/auth');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all therapy data? This action cannot be undone.')) {
      // Clear all data except user and child info
      localStorage.removeItem('authentication');
      
      toast({
        title: 'Data Cleared',
        description: 'All therapy progress has been reset.',
      });
      
      navigate('/dashboard');
    }
  };

  const totalSessions = 10;
  const socialTasks = 10;

  return (
    <Layout>
      <div className="p-6 space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account and therapy preferences
          </p>
        </motion.div>

        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="therapy-card p-8">
            <h3 className="text-therapy-lg text-primary mb-6 flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-card-soft rounded-xl">
                <div className="p-2 rounded-lg bg-primary-soft/20">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email Address</p>
                  <p className="text-sm text-muted-foreground">
                    test@test.com
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Child Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="therapy-card p-8">
            <h3 className="text-therapy-lg text-primary mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Child Information
            </h3>
            
            <form onSubmit={handleChildUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="childName" className="text-sm font-medium">
                    Child's Name
                  </Label>
                  <Input
                    id="childName"
                    value={childData.name}
                    onChange={(e) => setChildData({ ...childData, name: e.target.value })}
                    className="py-3 rounded-xl border-input-border focus:ring-2 focus:ring-primary-soft transition-all"
                    placeholder="Enter child's name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="childAge" className="text-sm font-medium">
                    Child's Age
                  </Label>
                  <Input
                    id="childAge"
                    type="number"
                    min="1"
                    max="18"
                    value={childData.age}
                    onChange={(e) => setChildData({ ...childData, age: e.target.value })}
                    className="py-3 rounded-xl border-input-border focus:ring-2 focus:ring-primary-soft transition-all"
                    placeholder="Enter age"
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary-soft hover:bg-primary text-foreground hover:text-primary-foreground font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Update Information
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="therapy-card p-8">
            <h3 className="text-therapy-lg text-primary mb-6">
              Progress Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-card-soft rounded-xl">
                <div className="text-3xl font-bold text-primary mb-1">
                  10
                </div>
                <p className="text-sm text-muted-foreground">Current Level</p>
              </div>
              
              <div className="text-center p-4 bg-card-soft rounded-xl">
                <div className="text-3xl font-bold text-accent mb-1">
                  10
                </div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </div>
              
              <div className="text-center p-4 bg-card-soft rounded-xl">
                <div className="text-3xl font-bold text-therapy-success mb-1">
                  10
                </div>
                <p className="text-sm text-muted-foreground">Social Skills</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="therapy-card p-8">
            <h3 className="text-therapy-lg text-primary mb-6">
              Account Actions
            </h3>
            
            <div className="space-y-4">
              <Button
                onClick={handleClearData}
                variant="outline"
                className="w-full sm:w-auto flex items-center gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Progress Data
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full sm:w-auto flex items-center gap-2 ml-0 sm:ml-4"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-accent-soft/20 rounded-xl">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Clearing progress data will remove all therapy sessions, 
                scores, and social skills progress. Your account and child information will be preserved.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
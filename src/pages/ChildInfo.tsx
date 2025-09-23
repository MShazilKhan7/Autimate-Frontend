import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

export default function ChildInfo() {
  const [childData, setChildData] = useState({
    name: '',
    age: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChildData({
      ...childData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      dispatch({
        type: 'SET_CHILD',
        payload: {
          name: childData.name.trim(),
          age: age,
        },
      });

      toast({
        title: 'Information Saved!',
        description: `Great! Let's learn more about ${childData.name}.`,
      });

      setIsLoading(false);
      navigate('/onboarding');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 warm-gradient opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="therapy-card p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">👶</div>
            <h1 className="text-therapy-xl text-primary mb-2">
              Tell us about your child
            </h1>
            <p className="text-muted-foreground">
              This helps us personalize the therapy experience
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className="text-sm font-medium">
                Child's Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your child's name"
                  value={childData.name}
                  onChange={handleInputChange}
                  className="pl-10 py-3 rounded-xl border-input-border focus:ring-2 focus:ring-primary-soft transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="age" className="text-sm font-medium">
                Child's Age
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="18"
                  placeholder="Enter age (1-18 years)"
                  value={childData.age}
                  onChange={handleInputChange}
                  className="pl-10 py-3 rounded-xl border-input-border focus:ring-2 focus:ring-primary-soft transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-primary-soft hover:bg-primary text-foreground hover:text-primary-foreground font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <span>Continue</span>
                )}
              </Button>
            </motion.div>
          </form>
        </Card>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-16 right-10 text-4xl opacity-30"
      >
        🧸
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        className="absolute bottom-16 right-20 text-4xl opacity-30"
      >
        🎨
      </motion.div>
    </div>
  );
}
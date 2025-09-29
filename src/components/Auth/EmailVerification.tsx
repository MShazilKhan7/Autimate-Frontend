import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationProps {
  email: string;
  onVerifySuccess: () => void;
  onBack: () => void;
}

export default function EmailVerification({ email, onVerifySuccess, onBack }: EmailVerificationProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit verification code.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simulate verification API call
    setTimeout(() => {
      // For demo purposes, accept any 6-digit code
      toast({
        title: 'Email Verified!',
        description: 'Your email has been successfully verified.',
      });
      
      setIsLoading(false);
      onVerifySuccess();
    }, 1500);
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    
    // Simulate resend API call
    setTimeout(() => {
      toast({
        title: 'OTP Resent',
        description: 'A new verification code has been sent to your email.',
      });
      setIsResending(false);
      setOtp(''); // Clear current OTP
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="therapy-card p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-therapy-xl text-primary mb-2">
            Verify Your Email
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </motion.div>

        <form onSubmit={handleVerify} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-3"
          >
            <label className="block text-sm font-medium text-center">
              Enter 6-digit verification code
            </label>
            <div className="flex justify-center">
              <InputOTP
                value={otp}
                onChange={(value) => setOtp(value)}
                maxLength={6}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot 
                    index={0} 
                    className="w-12 h-12 text-lg font-semibold rounded-xl border-input-border focus:ring-2 focus:ring-primary-soft transition-all" 
                  />
                  <InputOTPSlot 
                    index={1} 
                    className="w-12 h-12 text-lg font-semibold rounded-xl border-input-border focus:ring-2 focus:ring-primary-soft transition-all" 
                  />
                  <InputOTPSlot 
                    index={2} 
                    className="w-12 h-12 text-lg font-semibold rounded-xl border-input-border focus:ring-2 focus:ring-primary-soft transition-all" 
                  />
                  <InputOTPSlot 
                    index={3} 
                    className="w-12 h-12 text-lg font-semibold rounded-xl border-input-border focus:ring-2 focus:ring-primary-soft transition-all" 
                  />
                  <InputOTPSlot 
                    index={4} 
                    className="w-12 h-12 text-lg font-semibold rounded-xl border-input-border focus:ring-2 focus:ring-primary-soft transition-all" 
                  />
                  <InputOTPSlot 
                    index={5} 
                    className="w-12 h-12 text-lg font-semibold rounded-xl border-input-border focus:ring-2 focus:ring-primary-soft transition-all" 
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-4"
          >
            <Button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full py-3 rounded-xl bg-primary-soft hover:bg-primary text-foreground hover:text-primary-foreground font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                <span>Verify Email</span>
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-6"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to sign up
          </button>
        </motion.div>
      </Card>
    </motion.div>
  );
}
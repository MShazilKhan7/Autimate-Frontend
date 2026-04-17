import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "@/api/auth";
import { Authentication } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface EmailVerificationProps {
  email: string;
  onVerifySuccess: () => void;
  onBack: () => void;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function EmailVerification({
  email,
  onVerifySuccess,
  onBack,
}: EmailVerificationProps) {
  const { setAuthentication } = useAuth();
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const navigate = useNavigate();

  const { mutate: verifyEmail, isPending: isVerifyEmailPending } = useMutation<
    Authentication,
    Error,
    { email: string; otp: string }
  >({
    mutationFn: authAPI.verifyEmail,
    onSuccess: (data: Authentication) => {
      console.log(data?.user?.isOnboardingFinish)
      if (data?.user?.isOnboardingFinish) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
      setAuthentication({ ...data });
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified.",
      });
      onVerifySuccess();
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="p-8 md:p-10 border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-2xl mb-6 shadow-sm">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Verify Your Email
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </motion.div>

        <motion.form
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          onSubmit={(e) => {
            e.preventDefault();
            verifyEmail({ email, otp });
          }}
          className="space-y-8"
        >
          <motion.div variants={staggerItem} className="space-y-4">
            <label className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <KeyRound className="w-4 h-4" />
              Enter Verification Code
            </label>
            <div className="flex justify-center">
              <InputOTP
                value={otp}
                onChange={(value) => setOtp(value)}
                maxLength={6}
                className="gap-3"
              >
                <InputOTPGroup className="gap-2 sm:gap-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-xl sm:text-2xl font-semibold rounded-xl bg-muted/20 border-transparent focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-5 pt-2">
            <Button
              type="submit"
              disabled={isVerifyEmailPending || otp.length !== 6}
              className="w-full py-6 rounded-xl bg-gradient-to-r from-primary to-primary-soft hover:from-primary/90 hover:to-primary-soft/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 text-base"
            >
              {isVerifyEmailPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-current border-t-transparent rounded-full"
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
                // onClick={handleResendOTP}
                className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 pt-6 border-t border-muted/30"
        >
          <button
            onClick={onBack}
            className="flex items-center justify-center w-full gap-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to sign up
          </button>
        </motion.div>
      </Card>
    </motion.div>
  );
}

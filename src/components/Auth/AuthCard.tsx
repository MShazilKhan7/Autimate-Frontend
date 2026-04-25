import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import EmailVerification from "./EmailVerification";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface AuthFormData {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  confirm_password?: string;
}

const inputClasses = "pl-11 py-4 rounded-xl bg-muted/20 border-transparent focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-sm";
const iconClasses = "absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 h-5 w-5";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const {
    signIn,
    signUp,
    isSignInPending,
    isSignUpPending,
    showEmailVerification,
    pendingEmail,
    setShowEmailVerification,
    setPendingEmail
  } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<AuthFormData>({ mode: "onTouched" });

  const onSubmit = (data: AuthFormData) => {
    if (isLogin) {
      signIn({
        email: data.email,
        password: data.password
      });
    } else {
      signUp({
        firstName: data.first_name!,
        lastName: data.last_name!,
        email: data.email,
        password: data.password
      });
    }
  };

  const isLoading = isSignInPending || isSignUpPending;

  return (
    <>
      <Dialog 
        open={showEmailVerification} 
        onOpenChange={(open) => {
          if (!open) {
            setShowEmailVerification(false);
            setPendingEmail("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Verify Your Email</DialogTitle>
          <EmailVerification
            email={pendingEmail}
            onVerifySuccess={() => {
              setShowEmailVerification(false);
              setPendingEmail("");
            }}
            onBack={() => {
              setShowEmailVerification(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="p-6 border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-[2rem]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-3 shadow-sm">
              {isLogin ? <User className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {isLogin ? "Welcome Back" : "Join Autimate"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isLogin
                ? "Sign in to continue your therapy journey"
                : "Create an account to start your journey"}
            </p>
          </motion.div>

          <motion.form 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div 
                  key="name-fields"
                  variants={staggerItem}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">First Name</Label>
                    <div className="relative">
                      <User className={iconClasses} />
                      <Input
                        id="first_name"
                        placeholder="John"
                        {...register("first_name", {
                          required: !isLogin && "First name required"
                        })}
                        className={inputClasses}
                      />
                    </div>
                    {errors.first_name && (
                      <p className="text-xs text-destructive ml-1">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Last Name</Label>
                    <div className="relative">
                      <User className={iconClasses} />
                      <Input
                        id="last_name"
                        placeholder="Doe"
                        {...register("last_name", {
                          required: !isLogin && "Last name required"
                        })}
                        className={inputClasses}
                      />
                    </div>
                    {errors.last_name && (
                      <p className="text-xs text-destructive ml-1">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={staggerItem} className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Email Address</Label>
              <div className="relative">
                <Mail className={iconClasses} />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format"
                    }
                  })}
                  className={inputClasses}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive ml-1">{errors.email.message}</p>
              )}
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Password</Label>
              <div className="relative">
                <Lock className={iconClasses} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  className={`${inputClasses} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive ml-1">
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div 
                  key="confirm-password"
                  variants={staggerItem}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="space-y-2"
                >
                  <Label htmlFor="confirm_password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Confirm Password</Label>
                  <div className="relative">
                    <Lock className={iconClasses} />
                    <Input
                      id="confirm_password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirm_password", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watch("password") || "Passwords do not match"
                      })}
                      className={`${inputClasses} pr-12`}
                    />
                  </div>
                  {errors.confirm_password && (
                    <p className="text-xs text-destructive ml-1">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={staggerItem} className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-soft hover:from-primary/90 hover:to-primary-soft/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 text-base"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 text-center"
          >
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  reset();
                }}
                className="ml-2 text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </>
  );
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/api/auth';
import { Authentication, SignInRequest, SignOutRequest, SignUpRequest } from '@/types/auth';
import { useState } from 'react';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [authentication, setAuthentication] = useAtom(authAtom);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const navigate = useNavigate();

  const reset = () => {
    setAuthentication(INITIAL_AUTHENTICATION_VALUE);
    queryClient.clear();
  };

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authAPI.activeUser,
    enabled: !!authentication.accessToken,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { mutate: signIn, isPending: isSignInPending } = useMutation<
    Authentication,
    Error,
    SignInRequest
  >({
    mutationFn: authAPI.signin,
    onSuccess: (data: Authentication) => {
      if(data.user?.isVerified) {
        setAuthentication({ ...data });
        data?.user?.isOnboardingFinish ? navigate('/dashboard') : navigate('/onboarding');
      } else {
        setPendingEmail(data.user?.email ?? "");
        setShowEmailVerification(true);navigate('/onboarding');
      }
    },
  });

  const { mutate: signUp, isPending: isSignUpPending } = useMutation<
    Authentication,
    Error,
    SignUpRequest
  >({
    mutationFn: authAPI.signup,
    onSuccess: (data: Authentication) => {
      setAuthentication({ ...data });
      setPendingEmail(data.user?.email ?? "");
      setShowEmailVerification(true);
    },
  });

  const { mutate: signout } = useMutation<
    void,
    Error,
    SignOutRequest
  >({
    mutationFn: () => authAPI.signout({ refresh_token: authentication.refreshToken }),
    onSuccess: () => {
      reset();
      navigate('/auth');
    },
  });

  return {
    authentication,
    setAuthentication,
    user: userData?.user ?? null,
    isUserLoading: isUserLoading,
    isLoggedIn: !!authentication?.accessToken,
    isOnBoarded : userData?.user?.isOnboardingFinish,
    // childInfo: userData?.user.childInfo,

    showEmailVerification,
    setShowEmailVerification,
    pendingEmail,
    setPendingEmail,

    signIn,
    signUp,
    signout,
    isSignInPending,
    isSignUpPending,
  };
};

export const INITIAL_AUTHENTICATION_VALUE: Authentication = {
  accessToken: '',
  refreshToken: '',
  user: null,
};

export const authAtom = atomWithStorage('authentication', INITIAL_AUTHENTICATION_VALUE, undefined, {
  getOnInit: true,
});

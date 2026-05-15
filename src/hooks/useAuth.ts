// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useAtom } from 'jotai';
// import { atomWithStorage } from 'jotai/utils';
// import { useNavigate } from 'react-router-dom';
// import { authAPI } from '@/api/auth';
// import { Authentication, SignInRequest, SignOutRequest, SignUpRequest } from '@/types/auth';
// import { useState } from 'react';

// export const useAuth = () => {
//   const queryClient = useQueryClient();
//   const [authentication, setAuthentication] = useAtom(authAtom);
//   const [showEmailVerification, setShowEmailVerification] = useState(false);
//   const [pendingEmail, setPendingEmail] = useState("");

//   const navigate = useNavigate();

//   const reset = () => {
//     setAuthentication(INITIAL_AUTHENTICATION_VALUE);
//     queryClient.clear();
//   };

//   const { data: userData, isLoading: isUserLoading } = useQuery({
//     queryKey: ['me'],
//     queryFn: authAPI.activeUser,
//     enabled: !!authentication.accessToken,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//   });

//   const { mutate: signIn, isPending: isSignInPending } = useMutation<
//     Authentication,
//     Error,
//     SignInRequest
//   >({
//     mutationFn: authAPI.signin,
//     onSuccess: (data: Authentication) => {
//       if(data.user?.isVerified) {
//         setAuthentication({ ...data });
//         data?.user?.isOnboardingFinish ? navigate('/dashboard') : navigate('/onboarding');
//       } else {
//         setPendingEmail(data.user?.email ?? "");
//         setShowEmailVerification(true);navigate('/onboarding');
//       }
//     },
//   });

//   const { mutate: signUp, isPending: isSignUpPending } = useMutation<
//     Authentication,
//     Error,
//     SignUpRequest
//   >({
//     mutationFn: authAPI.signup,
//     onSuccess: (data: Authentication) => {
//       setAuthentication({ ...data });
//       setPendingEmail(data.user?.email ?? "");
//       setShowEmailVerification(true);
//     },
//   });

//   const { mutate: signout } = useMutation<
//     void,
//     Error,
//     SignOutRequest
//   >({
//     mutationFn: () => authAPI.signout({ refresh_token: authentication.refreshToken }),
//     onSuccess: () => {
//       reset();
//       navigate('/auth');
//     },
//   });

//   return {
//     authentication,
//     setAuthentication,
//     user: userData?.user ?? null,
//     isUserLoading: isUserLoading,
//     isLoggedIn: !!authentication?.accessToken,
//     isOnBoarded : userData?.user?.isOnboardingFinish,
//     // childInfo: userData?.user.childInfo,

//     showEmailVerification,
//     setShowEmailVerification,
//     pendingEmail,
//     setPendingEmail,

//     signIn,
//     signUp,
//     signout,
//     isSignInPending,
//     isSignUpPending,
//   };
// };

// export const INITIAL_AUTHENTICATION_VALUE: Authentication = {
//   accessToken: '',
//   refreshToken: '',
//   user: null,
// };

// export const authAtom = atomWithStorage('authentication', INITIAL_AUTHENTICATION_VALUE, undefined, {
//   getOnInit: true,
// });


import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/api/auth';
import {
  Authentication,
  SignInRequest,
  SignOutRequest,
  SignUpRequest,
} from '@/types/auth';
import { useState } from 'react';

export const INITIAL_AUTHENTICATION_VALUE: Authentication = {
  accessToken: '',
  refreshToken: '',
  user: null,
};

export const authAtom = atomWithStorage<Authentication>(
  'authentication',
  INITIAL_AUTHENTICATION_VALUE,
  undefined,
  {
    getOnInit: true,
  }
);

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [authentication, setAuthentication] = useAtom(authAtom);

  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const reset = () => {
    setAuthentication(INITIAL_AUTHENTICATION_VALUE);
    queryClient.clear();
  };

  /**
   * ACTIVE USER QUERY
   */
  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ['me'],
    queryFn: authAPI.activeUser,
    enabled: !!authentication.accessToken,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  /**
   * SIGN IN
   */
  const { mutate: signIn, isPending: isSignInPending } = useMutation<
    Authentication,
    Error,
    SignInRequest
  >({
    mutationFn: authAPI.signin,

    onSuccess: (data) => {
      /**
       * Always store authentication
       * even if email is not verified
       */
      setAuthentication(data);

      /**
       * Update query cache immediately
       * so user is available instantly
       */
      queryClient.setQueryData(['me'], {
        user: data.user,
      });

      if (data.user?.isVerified) {
        if (data.user?.isOnboardingFinish) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } else {
        setPendingEmail(data.user?.email ?? '');
        setShowEmailVerification(true);
      }
    },
  });

  /**
   * SIGN UP
   */
  const { mutate: signUp, isPending: isSignUpPending } = useMutation<
    Authentication,
    Error,
    SignUpRequest
  >({
    mutationFn: authAPI.signup,

    onSuccess: (data) => {
      setAuthentication(data);

      queryClient.setQueryData(['me'], {
        user: data.user,
      });

      setPendingEmail(data.user?.email ?? '');
      setShowEmailVerification(true);
    },
  });

  /**
   * SIGN OUT
   */
  const { mutate: signout, isPending: isSignOutPending } = useMutation({
    mutationFn: () =>
      authAPI.signout({
        refresh_token: authentication.refreshToken,
      }),

    onSuccess: () => {
      reset();
      navigate('/auth');
    },
  });

  /**
   * USER FALLBACK
   * Priority:
   * 1. Query user
   * 2. Atom user
   * 3. null
   */
  const user = userData?.user ?? authentication.user ?? null;

  return {
    authentication,
    setAuthentication,

    user,

    isUserLoading,
    isUserError,

    isLoggedIn: !!authentication?.accessToken,

    isOnBoarded:
      userData?.user?.isOnboardingFinish ??
      authentication.user?.isOnboardingFinish ??
      false,

    showEmailVerification,
    setShowEmailVerification,

    pendingEmail,
    setPendingEmail,

    signIn,
    signUp,
    signout,

    isSignInPending,
    isSignUpPending,
    isSignOutPending,
  };
};
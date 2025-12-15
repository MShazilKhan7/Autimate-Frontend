export interface SignInRequest {
    email: string;
    password: string;
  }
  
  export interface SignUpRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  
  export interface SignOutRequest {
    refresh_token: string;
  }
  
  export interface User {
    uuid: string;
    name: string;
    email: string;
    is_staff: boolean;
    isVerified: boolean;
    isOnboardingFinish: boolean
  }
  
  export interface Authentication {
    accessToken: string;
    refreshToken: string;
    user: User | null;

  }
  
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Child {
  name: string;
  age: number;
}

export interface User {
  email: string;
  isAuthenticated: boolean;
}

export interface TherapySession {
  id: string;
  date: string;
  type: 'speech' | 'social';
  score?: number;
  completedTasks?: string[];
  level: number;
}

export interface UserState {
  user: User | null;
  child: Child | null;
  onboardingCompleted: boolean;
  onboardingAnswers: Record<number, string>;
  currentLevel: number;
  levelProgress: number;
  therapySessions: TherapySession[];
  socialTasksCompleted: string[];
}

type UserAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_CHILD'; payload: Child }
  | { type: 'SET_ONBOARDING_ANSWER'; payload: { questionId: number; answer: string } }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'ADD_THERAPY_SESSION'; payload: TherapySession }
  | { type: 'UPDATE_LEVEL_PROGRESS'; payload: number }
  | { type: 'LEVEL_UP' }
  | { type: 'ADD_SOCIAL_TASK'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_FROM_STORAGE'; payload: UserState };

const initialState: UserState = {
  user: null,
  child: null,
  onboardingCompleted: false,
  onboardingAnswers: {},
  currentLevel: 1,
  levelProgress: 0,
  therapySessions: [],
  socialTasksCompleted: [],
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CHILD':
      return { ...state, child: action.payload };
    case 'SET_ONBOARDING_ANSWER':
      return {
        ...state,
        onboardingAnswers: {
          ...state.onboardingAnswers,
          [action.payload.questionId]: action.payload.answer,
        },
      };
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingCompleted: true };
    case 'ADD_THERAPY_SESSION':
      return {
        ...state,
        therapySessions: [...state.therapySessions, action.payload],
      };
    case 'UPDATE_LEVEL_PROGRESS':
      return { ...state, levelProgress: action.payload };
    case 'LEVEL_UP':
      return {
        ...state,
        currentLevel: state.currentLevel + 1,
        levelProgress: 0,
      };
    case 'ADD_SOCIAL_TASK':
      return {
        ...state,
        socialTasksCompleted: [...state.socialTasksCompleted, action.payload],
      };
    case 'LOGOUT':
      return initialState;
    case 'LOAD_FROM_STORAGE':
      return action.payload;
    default:
      return state;
  }
};

interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('therapyAppState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedState });
      } catch (error) {
        console.error('Error loading state from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('therapyAppState', JSON.stringify(state));
  }, [state]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
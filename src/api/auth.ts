import { Authentication, SignInRequest, SignOutRequest, SignUpRequest, User  } from '@/types/auth';
import api from '@/utils/api';

export const authAPI = {
  signin: async (payload: SignInRequest) =>
    api.post<{ accessToken: string; refreshToken: string; user: User }>(`/api/auth/login/`, payload).then((res) => res.data),
  signup: async (payload: SignUpRequest) =>
    api.post<Authentication>(`/api/auth/register/`, payload).then((res) => res.data),
  verifyEmail: async (payload: { email: string; otp: string }) => api.post(`/api/auth/verify/`, payload).then((res) => res.data),
  activeUser: async () => api.get('/api/auth/me/').then((res) => res.data),
  signout: async (payload: SignOutRequest) => api.post(`/api/auth/signout/`, payload).then((res) => res.data),
  getUsers: async () => api.get('/api/users/').then((res) => res.data),
  getUser: async (id: string) => api.get(`/api/users/${id}/`).then((res) => res.data),
};

import api from './Api';
import { BaseResponse } from '../types/api/BaseResponse';
import { EmptyResponse } from '../types/api/EmptyResponse';

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateAccountData {
  email: string;
  username: string;
  password: string;
  verificationCode: number;
}

export interface ResetPasswordData  {
  email: string;
  newPassword: string;
  verificationCode: number;
}

export const AuthService = {
  login: async (data: LoginData): Promise<BaseResponse<string>> => {
    return await api.post('/authentication/login', data);
  },

  createAccount: async (data: CreateAccountData): Promise<EmptyResponse> => {
    return await api.post('/authentication/signUp', data);
  },

  resetPassword: async (data: ResetPasswordData): Promise<EmptyResponse> => {
    return await api.post('/authentication/resetPassword', data); 
  },

  sendPasswordResetCode: async (email: string): Promise<EmptyResponse> => {
    return await api.post('/authentication/sendResetPasswordVerification', { email }); 
  },

  sendEmailVerification: async (email: string): Promise<EmptyResponse> => {
    return await api.post('/authentication/sendEmailVerification', { email });
  },

  verifyEmailUsed: async (email: string): Promise<BaseResponse<boolean>> => {
    return await api.get('/authentication/verifyEmailInUse?Email=' + email);
  },
};

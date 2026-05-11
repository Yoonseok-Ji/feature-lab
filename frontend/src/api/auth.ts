import client from './client';
import type { Token } from '../types';

export const register = (email: string, password: string) =>
  client.post('/auth/register', { email, password });

export const login = (email: string, password: string) =>
  client.post<Token>('/auth/login', { email, password });

import client from './client';
import type { Memo } from '../types';

export const getMemos = () => client.get<Memo[]>('/memos');

export const createMemo = (content: string) =>
  client.post<Memo>('/memos', { content });

export const updateMemo = (id: number, content: string) =>
  client.put<Memo>(`/memos/${id}`, { content });

export const deleteMemo = (id: number) =>
  client.delete(`/memos/${id}`);

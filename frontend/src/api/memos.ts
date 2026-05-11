import client from './client';
import type { Memo } from '../types';

export const getMemos = () => client.get<Memo[]>('/memos');

export const createMemo = (content: string, imageUrl?: string) =>
  client.post<Memo>('/memos', { content, image_url: imageUrl ?? null });

export const updateMemo = (id: number, content: string, imageUrl: string | null) =>
  client.put<Memo>(`/memos/${id}`, { content, image_url: imageUrl });

export const deleteMemo = (id: number) => client.delete(`/memos/${id}`);

export const uploadImage = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return client.post<{ url: string }>('/memos/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

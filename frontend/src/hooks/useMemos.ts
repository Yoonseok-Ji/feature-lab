import { useState, useEffect, useCallback } from 'react';
import * as memosApi from '../api/memos';
import type { Memo } from '../types';

export function useMemos() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await memosApi.getMemos();
      setMemos(data);
    } catch {
      setError('메모를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (content: string, imageUrl?: string) => {
    const { data } = await memosApi.createMemo(content, imageUrl);
    setMemos((prev) => [data, ...prev]);
  };

  const update = async (id: number, content: string, imageUrl: string | null) => {
    const { data } = await memosApi.updateMemo(id, content, imageUrl);
    setMemos((prev) => prev.map((m) => (m.id === id ? data : m)));
  };

  const remove = async (id: number) => {
    await memosApi.deleteMemo(id);
    setMemos((prev) => prev.filter((m) => m.id !== id));
  };

  return { memos, loading, error, create, update, remove };
}

import { useState } from 'react';
import type { Memo } from '../types';

interface Props {
  memo: Memo;
  onUpdate: (id: number, content: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function MemoCard({ memo, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(memo.content);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const trimmed = content.trim();
    if (!trimmed || trimmed === memo.content) {
      setContent(memo.content);
      setIsEditing(false);
      return;
    }
    setLoading(true);
    try {
      await onUpdate(memo.id, trimmed);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent(memo.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('이 메모를 삭제하시겠습니까?')) return;
    await onDelete(memo.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-3 min-h-[110px]">
      {isEditing ? (
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            rows={4}
            className="w-full flex-1 resize-none border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 text-sm bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 text-sm border border-slate-300 text-slate-600 py-2 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-slate-700 whitespace-pre-wrap flex-1 leading-relaxed">
            {memo.content}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 text-xs text-slate-500 border border-slate-200 py-2 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 text-xs text-red-400 border border-red-100 py-2 rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors"
            >
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
}

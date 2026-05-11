import { useState } from 'react';

interface Props {
  onCreate: (content: string) => Promise<void>;
}

export default function MemoForm({ onCreate }: Props) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      await onCreate(content.trim());
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="새 메모를 입력하세요..."
        rows={3}
        className="w-full resize-none border-0 focus:outline-none text-slate-700 placeholder:text-slate-400 bg-transparent"
      />
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
        <span className="hidden sm:block text-xs text-slate-400">Ctrl + Enter 로 저장</span>
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="ml-auto text-sm bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  );
}

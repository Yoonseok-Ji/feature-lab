import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMemos } from '../hooks/useMemos';
import MemoForm from '../components/MemoForm';
import MemoCard from '../components/MemoCard';

export default function MemosPage() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { memos, loading, error, create, update, remove } = useMemos();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-indigo-600 tracking-tight">Feature Lab</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 active:bg-red-100"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6 pb-10">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3">새 메모</h2>
          <MemoForm onCreate={create} />
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3">
            모든 메모
            {!loading && !error && (
              <span className="ml-2 text-sm font-normal text-slate-400">{memos.length}개</span>
            )}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
              불러오는 중...
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 text-sm">{error}</div>
          ) : memos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-sm gap-3">
              <span className="text-4xl">📝</span>
              첫 번째 메모를 작성해보세요!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {memos.map((memo) => (
                <MemoCard
                  key={memo.id}
                  memo={memo}
                  onUpdate={update}
                  onDelete={remove}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

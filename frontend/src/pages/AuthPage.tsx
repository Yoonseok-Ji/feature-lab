import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import * as authApi from '../api/auth';

type Mode = 'login' | 'register';
type Flash = { text: string; kind: 'error' | 'success' };

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [flash, setFlash] = useState<Flash | null>(null);
  const [loading, setLoading] = useState(false);

  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const switchMode = (next: Mode) => {
    setMode(next);
    setFlash(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlash(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        await authApi.register(email, password);
        setFlash({ text: '회원가입이 완료됐어요! 로그인해주세요.', kind: 'success' });
        switchMode('login');
        setPassword('');
      } else {
        const { data } = await authApi.login(email, password);
        setToken(data.access_token);
        navigate('/memos');
      }
    } catch (err) {
      const detail = axios.isAxiosError(err) ? err.response?.data?.detail : null;
      setFlash({ text: detail ?? '오류가 발생했습니다.', kind: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 flex flex-col">
      {/* Back to home */}
      <div className="px-4 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          ← 홈으로
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 sm:px-8 py-6 sm:py-7">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Feature Lab</h1>
            <p className="text-indigo-200 text-sm mt-1">나만의 메모 공간</p>
          </div>

          {/* Tab switcher */}
          <div className="flex border-b border-slate-200">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                  mode === m
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/40'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'login' ? '로그인' : '회원가입'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 sm:py-7 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              />
            </div>

            {flash && (
              <p
                className={`text-sm ${
                  flash.kind === 'error' ? 'text-red-500' : 'text-emerald-600'
                }`}
              >
                {flash.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

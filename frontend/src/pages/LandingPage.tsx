import { Link } from 'react-router-dom';

const MOCK_MEMOS = [
  { id: 1, content: '오늘의 할 일\n- 프로젝트 기획서 작성\n- 팀 미팅 참석\n- 코드 리뷰' },
  { id: 2, content: '아이디어: 사용자 대시보드에 통계 차트 추가하기' },
  { id: 3, content: '참고: React 18 공식 문서 업데이트 확인 필요' },
];

const FEATURES = [
  {
    icon: '⚡',
    title: '빠른 작성',
    desc: '생각이 떠오를 때 즉시 기록. 복잡한 에디터 없이 바로 시작하세요.',
  },
  {
    icon: '🔒',
    title: '안전한 보관',
    desc: 'JWT 기반 인증으로 내 메모는 오직 나만 볼 수 있습니다.',
  },
  {
    icon: '📱',
    title: '어디서나 접근',
    desc: '모바일부터 데스크탑까지 어느 기기에서나 자유롭게 사용하세요.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-indigo-600 text-lg tracking-tight">Feature Lab</span>
          <div className="flex items-center gap-1">
            <Link
              to="/auth"
              className="text-sm text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors"
            >
              로그인
            </Link>
            <Link
              to="/auth"
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-medium"
            >
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-4 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              ✨ 무료로 사용하세요
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.15] mb-4">
              메모는 간단하게,
              <br />
              <span className="text-indigo-600">생각은 자유롭게.</span>
            </h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-sm mx-auto lg:mx-0 mb-8 leading-relaxed">
              언제 어디서나 아이디어를 빠르게 기록하고,
              나만의 공간에 안전하게 보관하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xs mx-auto lg:mx-0 lg:max-w-none">
              <Link
                to="/auth"
                className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-center text-sm sm:text-base"
              >
                무료로 시작하기 →
              </Link>
              <Link
                to="/auth"
                className="border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 font-medium px-8 py-3.5 rounded-xl transition-colors text-center text-sm sm:text-base"
              >
                로그인
              </Link>
            </div>
          </div>

          {/* Mock preview — desktop only */}
          <div className="hidden lg:flex flex-1 flex-col gap-3 max-w-xs">
            {MOCK_MEMOS.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {m.content}
                </p>
              </div>
            ))}
          </div>

          {/* Mock preview — mobile: horizontal scroll */}
          <div className="lg:hidden w-full overflow-x-auto -mx-4 px-4">
            <div className="flex gap-3 w-max pb-2">
              {MOCK_MEMOS.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 w-60 flex-shrink-0"
                >
                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {m.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 sm:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-10">
            왜 Feature Lab인가요?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex flex-row sm:flex-col items-start gap-4 p-5 bg-slate-50 rounded-2xl"
              >
                <span className="text-3xl flex-shrink-0">{f.icon}</span>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-14 sm:py-20 px-4 bg-indigo-600">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            지금 바로 시작하세요
          </h2>
          <p className="text-indigo-200 mb-8 text-sm leading-relaxed">
            가입 후 즉시 메모를 작성할 수 있습니다.
            <br />
            복잡한 설정 없이 바로 시작해보세요.
          </p>
          <Link
            to="/auth"
            className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 active:bg-indigo-100 transition-colors text-sm sm:text-base"
          >
            무료로 시작하기 →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-xs text-slate-400 border-t border-slate-200">
        © 2025 Feature Lab. All rights reserved.
      </footer>
    </div>
  );
}

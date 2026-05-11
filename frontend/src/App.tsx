import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import MemosPage from './pages/MemosPage';

export default function App() {
  const token = useAuthStore((s) => s.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/memos" replace /> : <LandingPage />}
        />
        <Route
          path="/auth"
          element={token ? <Navigate to="/memos" replace /> : <AuthPage />}
        />
        <Route
          path="/memos"
          element={token ? <MemosPage /> : <Navigate to="/auth" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

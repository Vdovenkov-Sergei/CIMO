import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import Header from '@/components/Header/Header';

const Login = lazy(() => import('@/pages/Login/Login'));
const Signup = lazy(() => import('@/pages/Signup/Signup'));
const Verification = lazy(() => import('@/pages/Verification/Verification'));
const Nickname = lazy(() => import('@/pages/Nickname/Nickname'));
const ModeSelection = lazy(() => import('@/pages/ModeSelection/ModeSelection'));

function App() {
  return (
    <BrowserRouter>
      <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/nickname" element={<Nickname />} />
            <Route path="/modeSelection" element={<ModeSelection />} />
          </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
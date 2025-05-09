import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import Header from '@/components/Header/Header';

const Login = lazy(() => import('@/pages/Login/Login'));
const Signup = lazy(() => import('@/pages/Signup/Signup'));
const Verification = lazy(() => import('@/pages/Verification/Verification'));
const Nickname = lazy(() => import('@/pages/Nickname/Nickname'));
const ModeSelection = lazy(() => import('@/pages/ModeSelection/ModeSelection'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword/ForgotPassword'));
const CreatePassword = lazy(() => import('@/pages/CreatePassword/CreatePassword'));
const Profile = lazy(() => import('@/pages/Profile/Profile'));
const MyMovies = lazy(() => import('@/pages/MyMovies/MyMovies'));
const ChangeNickname = lazy(() => import('@/pages/ChangeNickname/ChangeNickname'));

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
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/createPassword" element={<CreatePassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/myMovies" element={<MyMovies />} />
            <Route path="/changeNickname" element={<ChangeNickname />} />
          </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
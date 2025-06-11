import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Login = lazy(() => import('@/pages/Login/Login'));
const Signup = lazy(() => import('@/pages/Signup/Signup'));
const Verification = lazy(() => import('@/pages/Verification/Verification'));
const Nickname = lazy(() => import('@/pages/Nickname/Nickname'));
const ModeSelection = lazy(() => import('@/pages/ModeSelection/ModeSelection'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword/ResetPassword'));
const Profile = lazy(() => import('@/pages/Profile/Profile'));
const MyMovies = lazy(() => import('@/pages/MyMovies/MyMovies'));
const ChangeNickname = lazy(() => import('@/pages/ChangeNickname/ChangeNickname'));
const Session = lazy(() => import('@/pages/Session/Session'));
const SessionMovies = lazy(() => import('@/pages/SessionMovies/SessionMovies'));
const Invite = lazy(() => import('@/pages/Invite/Invite'));
const WaitingScreen = lazy(() => import('@/pages/WaitingScreen/WaitingScreen'));

function App() {
  return (
    <BrowserRouter>
      <main>
        <Suspense fallback={<div></div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/nickname" element={<Nickname />} />
            <Route path="/modeSelection" element={<ModeSelection />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/myMovies" element={<MyMovies />} />
            <Route path="/changeNickname" element={<ChangeNickname />} />
            <Route path="/session" element={<Session />} />
            <Route path="/sessionMovies" element={<SessionMovies />} />
            <Route path="/invite" element={<Invite />} />
            <Route path="/waitingScreen" element={<WaitingScreen />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}

export default App;

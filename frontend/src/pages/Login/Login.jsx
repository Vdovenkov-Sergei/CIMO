import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './Login.scss';
import AuthForm from '../../components/AuthForm';
import HeaderReg from '../../components/HeaderReg/HeaderReg';
import Footer from '../../components/Footer/Footer';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const redirectUrl = searchParams.get('redirect');
  const inviteId = searchParams.get('id');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!login.trim() || !password.trim()) {
      setError('Заполните все поля');
      setBackendError('');
      return;
    }

    setIsLoading(true);
    setError('');
    setBackendError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: login.trim(),
          password: password.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || data.message || 'Ошибка авторизации.';
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }

      setSuccessMessage('Вход выполнен успешно!');
      if (redirectUrl === '/invite' && inviteId) {
        navigate(`${redirectUrl}?id=${inviteId}`);
      } else if (redirectUrl === '/waitingScreen') {
        navigate(`${redirectUrl}`);
      } else {
        setTimeout(() => navigate('/modeSelection'), 1500);
      }
      
    } catch (err) {
      console.error('Ошибка авторизации:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <HeaderReg className="header" />

      <main className="main-content">

        <AuthForm
          login={login}
          password={password}
          onLoginChange={(e) => {
            setLogin(e.target.value);
            if (error) setError('');
            if (backendError) setBackendError('');
          }}
          onPasswordChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
            if (backendError) setBackendError('');
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          backendError={backendError}
          successMessage={successMessage}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Login;
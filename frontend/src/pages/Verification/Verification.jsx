import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './Verification.scss';

import onboarding1 from '@/assets/images/onboarding1.png';
import onboarding2 from '@/assets/images/onboarding2.png';
import onboarding3 from '@/assets/images/onboarding3.png';
import HeaderReg from '../../components/HeaderReg';
import Onboarding from '../../components/Onboarding';
import Footer from '../../components/Footer';
import VerificationCodeForm from '../../components/VerificationCodeForm';

const Verification = () => {
  const onboardingImages = [
    { id: 1, src: onboarding1, alt: 'Демонстрация функционала 1' },
    { id: 2, src: onboarding2, alt: 'Демонстрация функционала 2' },
    { id: 3, src: onboarding3, alt: 'Демонстрация функционала 3' },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(120);

  // Таймер для кнопки повторной отправки
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Проверка кода верификации
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    console.log(email);
    console.log(typeof email);
    console.log(code);
    console.log(typeof code);
    console.log(JSON.stringify({
      email: email,
      code: code
    }))
    
    try {
      const response = await fetch('http://localhost:8000/auth/register/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: code
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Неверный код подтверждения');
      }

      setSuccessMessage('Код подтверждён! Перенаправляем...');
      setTimeout(() => navigate('/nickname'), 2000);
      
    } catch (err) {
      console.error('Ошибка верификации:', err);
      setError(err.message || 'Произошла ошибка при проверке кода');
    } finally {
      setIsLoading(false);
    }
  };

  // Повторная отправка кода
  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/auth/register/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при повторной отправке кода');
      }

      setCountdown(120);
      setSuccessMessage('Новый код отправлен на вашу почту');
      setCode(''); // Очищаем поле ввода
      
    } catch (err) {
      console.error('Ошибка при повторной отправке:', err);
      setError(err.message || 'Не удалось отправить код повторно');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="error-container">
        <p>Не получен email. Пожалуйста, пройдите регистрацию сначала.</p>
        <button onClick={() => navigate('/signup')}>Вернуться к регистрации</button>
      </div>
    );
  }

  return (
    <div className="verification-page">
      <HeaderReg className="header" />

      <main className="main-content container">
        <Onboarding 
          images={onboardingImages}
          autoplayDelay={4000}
          className="custom-onboarding"
        />

        <VerificationCodeForm
          email={email}
          code={code}
          onCodeChange={(e) => setCode(e.target.value)}
          onSubmit={handleSubmit}
          onResend={handleResendCode}
          isLoading={isLoading}
          isResending={isResending}
          error={error}
          successMessage={successMessage}
          countdown={countdown}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Verification;
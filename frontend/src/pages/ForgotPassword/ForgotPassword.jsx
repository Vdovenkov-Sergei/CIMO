import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './ForgotPassword.scss';
import Footer from '../../components/Footer/Footer';
import HeaderReg from '../../components/HeaderReg/HeaderReg';
import PasswordRecoveryForm from '../../components/PasswordRecoveryForm';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Введите email');
      setBackendError('');
      return;
    }

    setIsLoading(true);
    setError('');
    setBackendError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/password/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || data.message || 'Ошибка отправки письма.';
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }

      setSuccessMessage('Письмо отправлено! Проверьте почту.');
      
    } catch (err) {
      console.error('Ошибка восстановления пароля:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <HeaderReg className="header" />

      <main className="main-content">
        <PasswordRecoveryForm
          email={email}
          onEmailChange={(e) => {
            setEmail(e.target.value);
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

export default ForgotPassword;
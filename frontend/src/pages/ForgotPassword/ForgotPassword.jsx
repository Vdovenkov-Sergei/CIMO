import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './ForgotPassword.scss';
import Footer from '../../components/Footer';
import HeaderReg from '../../components/HeaderReg';
import PasswordRecoveryForm from '../../components/PasswordRecoveryForm';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Введите email');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:8000/auth/password/forgot', {
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
        throw new Error(data.detail || data.message || 'Ошибка отправки письма');
      }

      setSuccessMessage('Письмо отправлено! Проверьте вашу почту');
      
    } catch (err) {
      console.error('Ошибка восстановления пароля:', err);
      setError(err.message || 'Произошла ошибка при отправке письма');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <HeaderReg className="header" />

      <main className="main-content container">
        <PasswordRecoveryForm
          email={email}
          onEmailChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          successMessage={successMessage}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
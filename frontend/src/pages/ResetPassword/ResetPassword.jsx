import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './ResetPassword.scss';
import Footer from '../../components/Footer';
import HeaderReg from '../../components/HeaderReg';
import PasswordResetForm from '../../components/PasswordResetForm';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Получаем токен из query-параметра
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Недействительная ссылка для сброса пароля');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:8000/auth/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Ошибка сброса пароля');
      }

      setSuccessMessage('Пароль успешно изменен! Перенаправляем...');
      setTimeout(() => navigate('/'), 2000);
      
    } catch (err) {
      console.error('Ошибка сброса пароля:', err);
      setError(err.message || 'Произошла ошибка при сбросе пароля');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-password-page">
      <HeaderReg className="header" />

      <main className="main-content container">
        <PasswordResetForm
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onPasswordChange={(e) => {
            setFormData({...formData, password: e.target.value});
            if (error) setError('');
          }}
          onConfirmPasswordChange={(e) => {
            setFormData({...formData, confirmPassword: e.target.value});
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

export default ResetPassword;
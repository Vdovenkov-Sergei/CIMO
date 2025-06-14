import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './ResetPassword.scss';
import Footer from '../../components/Footer/Footer';
import HeaderReg from '../../components/HeaderReg/HeaderReg';
import PasswordResetForm from '../../components/PasswordResetForm';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают.');
      setBackendError('');
      return;
    }

    setIsLoading(true);
    setError('');
    setBackendError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/password/reset', {
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
        const errorMessage = data.detail || data.message || 'Ошибка сброса пароля.';
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }

      setSuccessMessage('Пароль успешно изменен!');
      setTimeout(() => navigate('/'), 2000);
      
    } catch (err) {
      console.error('Ошибка сброса пароля:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-password-page">
      <HeaderReg className="header" />

      <main className="main-content">
        <PasswordResetForm
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onPasswordChange={(e) => {
            setFormData({...formData, password: e.target.value});
            if (error) setError('');
            if (backendError) setBackendError('');
          }}
          onConfirmPasswordChange={(e) => {
            setFormData({...formData, confirmPassword: e.target.value});
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

export default ResetPassword;
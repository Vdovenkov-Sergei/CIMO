import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './Signup.scss';

import onboarding1 from '@/assets/images/onboarding1.png';
import onboarding2 from '@/assets/images/onboarding2.png';
import onboarding3 from '@/assets/images/onboarding3.png';
import Onboarding from '../../components/Onboarding';
import HeaderReg from '../../components/HeaderReg';
import Footer from '../../components/Footer';
import RegisterForm from '../../components/RegisterForm';

const Signup = () => {
  const navigate = useNavigate();
  const onboardingImages = [
    { id: 1, src: onboarding1, alt: 'Демонстрация функционала 1' },
    { id: 2, src: onboarding2, alt: 'Демонстрация функционала 2' },
    { id: 3, src: onboarding3, alt: 'Демонстрация функционала 3' },
  ];

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (backendError) setBackendError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация формы
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Все поля обязательны для заполнения');
      setBackendError('');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setBackendError('');
      return;
    }

    setIsLoading(true);
    setError('');
    setBackendError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch('/api/auth/register/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Используем detail или message из ответа сервера
        const errorMessage = data.detail || data.message || 'Ошибка регистрации';
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }

      setSuccessMessage('Регистрация прошла успешно! Перенаправляем на верификацию...');
      
      setTimeout(() => {
        navigate('/verification', { 
          state: { email: formData.email }
        });
      }, 2000);
      
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      // Не устанавливаем error, так как используем backendError
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <HeaderReg className="header" />

      <main className="main-content container">

        <RegisterForm
          email={formData.email}
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onEmailChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'email' }})}
          onPasswordChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'password' }})}
          onConfirmPasswordChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'confirmPassword' }})}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          backendError={backendError}
          successMessage={successMessage}
          buttonText={isLoading ? 'Регистрация...' : 'Далее'}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
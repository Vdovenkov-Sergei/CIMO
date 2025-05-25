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
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация формы
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Все поля обязательны для заполнения');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage(''); // Очищаем предыдущие успешные сообщения
    
    try {
      const response = await fetch('http://localhost:8000/auth/register/email', {
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
        throw new Error(data.message || 'Ошибка регистрации');
      }

      setSuccessMessage('Регистрация прошла успешно! Перенаправляем на верификацию...');
      
      setTimeout(() => {
        navigate('/verification', { 
          state: { email: formData.email }
        });
      }, 2000);
      
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      setError(err.message || 'Произошла ошибка при регистрации. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <HeaderReg className="header" />

      <main className="main-content container">
        <Onboarding 
          images={onboardingImages}
          autoplayDelay={4000}
          className="custom-onboarding"
        />

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
          successMessage={successMessage}
          buttonText={isLoading ? 'Регистрация...' : 'Далее'}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
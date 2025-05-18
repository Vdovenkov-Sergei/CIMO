import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const onboardingImages = [
    { id: 1, src: onboarding1, alt: 'Демонстрация функционала 1' },
    { id: 2, src: onboarding2, alt: 'Демонстрация функционала 2' },
    { id: 3, src: onboarding3, alt: 'Демонстрация функционала 3' },
  ];

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Здесь будет логика регистрации
    console.log('Отправка данных:', formData);
    
    // Имитация запроса
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
          login={formData.login}
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onLoginChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'login' }})}
          onPasswordChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'password' }})}
          onConfirmPasswordChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'confirmPassword' }})}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
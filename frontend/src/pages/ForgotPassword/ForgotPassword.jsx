import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './ForgotPassword.scss';

import onboarding1 from '@/assets/images/onboarding1.png';
import onboarding2 from '@/assets/images/onboarding2.png';
import onboarding3 from '@/assets/images/onboarding3.png';
import Footer from '../../components/Footer';
import HeaderReg from '../../components/HeaderReg';
import Onboarding from '../../components/Onboarding';
import PasswordRecoveryForm from '../../components/PasswordRecoveryForm';

const ForgotPassword = () => {
  const onboardingImages = [
    { id: 1, src: onboarding1, alt: 'Демонстрация функционала 1' },
    { id: 2, src: onboarding2, alt: 'Демонстрация функционала 2' },
    { id: 3, src: onboarding3, alt: 'Демонстрация функционала 3' },
  ];

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Здесь будет логика отправки письма
    console.log('Отправка письма на:', email);
    
    // Имитация запроса
    setTimeout(() => {
      setIsLoading(false);
      alert('Письмо отправлено! Проверьте вашу почту');
    }, 1500);
  };


  return (
    <div className="forgot-password-page">
      <HeaderReg className="header" />

      <main className="main-content container">
        <Onboarding 
          images={onboardingImages}
          autoplayDelay={4000}
          className="custom-onboarding"
        />

        <PasswordRecoveryForm
          email={email}
          onEmailChange={(e) => setEmail(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
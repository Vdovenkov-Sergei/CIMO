import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Здесь будет логика проверки кода
    console.log('Проверка кода:', code);
    
    // Имитация запроса
    setTimeout(() => {
      setIsLoading(false);
      alert('Код подтвержден!');
    }, 1500);
  };

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
          code={code}
          onCodeChange={(e) => setCode(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Verification;
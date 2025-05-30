import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './Nickname.scss';

import onboarding1 from '@/assets/images/onboarding1.png';
import onboarding2 from '@/assets/images/onboarding2.png';
import onboarding3 from '@/assets/images/onboarding3.png';
import Footer from '../../components/Footer';
import HeaderReg from '../../components/HeaderReg';
import Onboarding from '../../components/Onboarding';
import NicknameForm from '../../components/NicknameForm';

const Nickname = () => {
  const onboardingImages = [
    { id: 1, src: onboarding1, alt: 'Демонстрация функционала 1' },
    { id: 2, src: onboarding2, alt: 'Демонстрация функционала 2' },
    { id: 3, src: onboarding3, alt: 'Демонстрация функционала 3' },
  ];

  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Здесь будет логика сохранения никнейма
    console.log('Сохранение никнейма:', nickname);
    
    // Имитация запроса
    setTimeout(() => {
      setIsLoading(false);
      alert('Никнейм сохранен!');
    }, 1500);
  };

  const handleSkip = () => {
    console.log('Пользователь пропустил создание никнейма');
    // Логика пропуска шага
  };

  return (
    <div className="nickname-page">
      <HeaderReg className="header" />

      <main className="main-content container">
        <Onboarding 
          images={onboardingImages}
          autoplayDelay={4000}
          className="custom-onboarding"
        />

        <NicknameForm
          nickname={nickname}
          onNicknameChange={(e) => setNickname(e.target.value)}
          onSubmit={handleSubmit}
          onSkip={handleSkip}
          isLoading={isLoading}
          isSkippable={true}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Nickname;
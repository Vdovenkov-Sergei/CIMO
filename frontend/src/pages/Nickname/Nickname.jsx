import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const onboardingImages = [
    { id: 1, src: onboarding1, alt: 'Демонстрация функционала 1' },
    { id: 2, src: onboarding2, alt: 'Демонстрация функционала 2' },
    { id: 3, src: onboarding3, alt: 'Демонстрация функционала 3' },
  ];

  const user_id = location.state?.user_id || '';
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setError('Введите никнейм');
      setBackendError('');
      return;
    }

    setIsLoading(true);
    setError('');
    setBackendError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/register/username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          user_name: nickname.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || data.message || 'Ошибка сохранения никнейма';
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }

      setSuccessMessage('Никнейм успешно сохранен!');
      setTimeout(() => navigate('/'), 2000);
      
    } catch (err) {
      console.error('Ошибка сохранения никнейма:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
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
          onNicknameChange={(e) => {
            setNickname(e.target.value);
            if (error) setError('');
            if (backendError) setBackendError('');
          }}
          onSubmit={handleSubmit}
          onSkip={handleSkip}
          isLoading={isLoading}
          isSkippable={true}
          error={error}
          backendError={backendError}
          successMessage={successMessage}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Nickname;
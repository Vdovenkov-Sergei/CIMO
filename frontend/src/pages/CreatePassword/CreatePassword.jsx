import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './CreatePassword.scss';

// Импортируем изображения (предположим, они лежат в src/assets/images/onboarding/)
import onboarding1 from '@/assets/images/onboarding1.png';
import onboarding2 from '@/assets/images/onboarding2.png';
import onboarding3 from '@/assets/images/onboarding3.png';
import Footer from '../../components/Footer';
import HeaderReg from '../../components/HeaderReg';
import Onboarding from '../../components/Onboarding';
import PasswordResetForm from '../../components/PasswordResetForm';

const CreatePassword = () => {
  const onboardingImages = [
    { id: 1, src: onboarding1, alt: 'Демонстрация функционала 1' },
    { id: 2, src: onboarding2, alt: 'Демонстрация функционала 2' },
    { id: 3, src: onboarding3, alt: 'Демонстрация функционала 3' },
  ];

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }
    
    setIsLoading(true);
    
    // Здесь будет логика сохранения пароля
    console.log('Новый пароль:', formData.password);
    
    // Имитация запроса
    setTimeout(() => {
      setIsLoading(false);
      alert('Пароль успешно изменен!');
    }, 1500);
  };

  return (
    <div className="create-password-page">
      <HeaderReg className="header" />

      <main className="main-content container">
        <Onboarding 
          images={onboardingImages}
          autoplayDelay={4000}
          className="custom-onboarding"
        />

        <PasswordResetForm
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onPasswordChange={(e) => setFormData({...formData, password: e.target.value})}
          onConfirmPasswordChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </main>

      <Footer />
    </div>
  );
};

export default CreatePassword;
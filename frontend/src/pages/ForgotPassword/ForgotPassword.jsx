import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './ForgotPassword.scss';
import Footer from '../../components/Footer';
import HeaderReg from '../../components/HeaderReg';
import PasswordRecoveryForm from '../../components/PasswordRecoveryForm';

const ForgotPassword = () => {

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
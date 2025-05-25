import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import './ResetPassword.scss';
import Footer from '../../components/Footer';
import HeaderReg from '../../components/HeaderReg';
import PasswordResetForm from '../../components/PasswordResetForm';

const CreatePassword = () => {

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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.scss';
import HeaderReg from '../../components/HeaderReg/HeaderReg';
import Footer from '../../components/Footer/Footer';
import RegisterForm from '../../components/RegisterForm';
import { errorMessages } from '../../utils/exceptions';

const Signup = () => {
  const navigate = useNavigate();

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

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(formData.email)) {
      setBackendError('Некорректная почта');
      setSuccessMessage('');
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');
    setBackendError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register/email`, {
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
        const errorMessage = errorMessages[data.detail.error_code] || 'Ошибка регистрации';
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }

      setSuccessMessage('Письмо отправлено. Проверьте почту.');
      
      setTimeout(() => {
        navigate('/verification', { 
          state: { email: formData.email }
        });
      }, 2000);
      
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <HeaderReg className="header" />

      <main className="main-content">

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
          buttonText='Далее'
        />
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
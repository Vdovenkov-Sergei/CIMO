import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ResetPassword.scss';
import Footer from '../../components/Footer/Footer';
import HeaderReg from '../../components/HeaderReg/HeaderReg';
import PasswordResetForm from '../../components/PasswordResetForm';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают.');
      setBackendError('');
      return;
    }

    setIsLoading(true);
    setError('');
    setBackendError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || data.message || 'Ошибка сброса пароля.';
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }

      setSuccessMessage('Пароль успешно изменен!');
      setTimeout(() => navigate('/'), 2000);
      
    } catch (err) {
      console.error('Ошибка сброса пароля:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="create-password-page">
      <HeaderReg className="header" />

      <main className="main-content">
        <PasswordResetForm
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onPasswordChange={(e) => {
            setFormData({...formData, password: e.target.value});
            if (error) setError('');
            if (backendError) setBackendError('');
          }}
          onConfirmPasswordChange={(e) => {
            setFormData({...formData, confirmPassword: e.target.value});
            if (error) setError('');
            if (backendError) setBackendError('');
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          backendError={backendError}
          successMessage={successMessage}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
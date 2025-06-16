import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Verification.scss';

import HeaderReg from '../../components/HeaderReg/HeaderReg';
import Footer from '../../components/Footer/Footer';
import VerificationCodeForm from '../../components/VerificationCodeForm';
import { errorMessages } from '../../utils/exceptions';

const Verification = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');
    setBackendError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: code
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = errorMessages[data.detail.error_code] || 'Неверный код подтверждения.';
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }

      setSuccessMessage('Код подтверждён!');
      setTimeout(() => {
        navigate('/nickname', { 
          state: { user_id: data.id }
        });
      }, 2000);
      
    } catch (err) {
      console.error('Ошибка верификации:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    setBackendError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = errorMessages[data.detail.error_code] || 'Ошибка при повторной отправке кода.';
        setBackendError(errorMessage);
        setSuccessMessage('');
        throw new Error(errorMessage);
      }

      setCountdown(120);
      setSuccessMessage('Новый код отправлен на почту.');
      setCode('');
      
    } catch (err) {
      console.error('Ошибка при повторной отправке:', err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="verification-page">
      <HeaderReg className="header" />

      <main className="main-content">

        <VerificationCodeForm
          email={email}
          code={code}
          onCodeChange={(e) => {
            setCode(e.target.value);
            if (error) setError('');
            if (backendError) setBackendError('');
          }}
          onSubmit={handleSubmit}
          onResend={handleResendCode}
          isLoading={isLoading}
          isResending={isResending}
          error={error}
          backendError={backendError}
          successMessage={successMessage}
          countdown={countdown}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Verification;
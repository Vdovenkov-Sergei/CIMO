import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Nickname.scss';

import Footer from '../../components/Footer/Footer';
import HeaderReg from '../../components/HeaderReg/HeaderReg';
import NicknameForm from '../../components/NicknameForm';

const Nickname = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register/username`, {
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
        const errorMessage = data.detail || data.message || 'Ошибка сохранения никнейма.';
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }

      setSuccessMessage('Никнейм успешно сохранен!');
      setTimeout(() => navigate('/?redirect=/waitingScreen'), 2000);
      
    } catch (err) {
      console.error('Ошибка сохранения никнейма:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/?redirect=/waitingScreen');
  };

  return (
    <div className="nickname-page">
      <HeaderReg className="header" />

      <main className="main-content">

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
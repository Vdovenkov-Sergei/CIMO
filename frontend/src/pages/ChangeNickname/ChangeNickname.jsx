import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangeNickname.scss';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProfileAvatar from '../../components/ProfileAvatar';
import ChangeNicknameForm from '../../components/ChangeNicknameForm';
import { useAuthFetch } from '../../utils/useAuthFetch';
import { errorMessages } from '../../utils/exceptions';

const ChangeNickname = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    login: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const authFetch = useAuthFetch();
  const [isNotFound, setIsNotFound] = useState(false);

  const fetchUserData = async () => {
    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (!ok && data.detail.error_code === 'USER_NOT_FOUND') setIsNotFound(true);
      setUser({
        login: data.user_name,
        email: data.email
      });
    } catch (err) {
      console.error('Ошибка:', err);
      setBackendError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleNicknameSubmit = async (newNickname) => {
    if (/user_\d+/.test(newNickname.trim())) {
      setBackendError('Никнейм недоступен.');
      const timer = setTimeout(() => {
        setBackendError('');
      }, 3000);
      setSuccessMessage('');
      return;
    }

    setIsLoading(true);
    setBackendError('');
    setSuccessMessage('');

    try {
      const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_name: newNickname.trim()
        }),
      });

      if (!ok && data.detail.error_code === 'USER_NOT_FOUND') setIsNotFound(true);

      if (!ok) {
        const errorMessage = errorMessages[data.detail.error_code] || JSON.stringify(data) || 'Ошибка обновления никнейма';
        setBackendError(errorMessage);
        const timer = setTimeout(() => {
          setBackendError('');
        }, 3000);
        return;
      }

      setUser(prev => ({ ...prev, login: newNickname.trim() }));
      setSuccessMessage('Никнейм успешно изменен!');
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Ошибка:', err);
      setBackendError("Никнейм уже занят");
    } finally {
      setIsLoading(false);
    }
  };

  if (isNotFound) return (
    <div className="error">
      <h1 className='code'>404</h1>
      <h3 className='text'>Страница не найдена</h3>
    </div>
  );

  return (
    <div className="change-nickname-page">
      <Header />

      <main className="profile-main-nick container">
        <ProfileAvatar login={user.login} />

        <ChangeNicknameForm
          currentNickname={user.login}
          onSubmit={handleNicknameSubmit}
          isLoading={isLoading}
          backendError={backendError}
          successMessage={successMessage}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ChangeNickname;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangeNickname.scss';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProfileAvatar from '../../components/ProfileAvatar';
import ChangeNicknameForm from '../../components/ChangeNicknameForm';
import { useAuthFetch } from '../../utils/useAuthFetch';

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { status, ok, data } = await authFetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        setUser({
          login: data.user_name || '',
          email: data.email || ''
        });
      } catch (err) {
        console.error('Ошибка:', err);
        setBackendError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleNicknameSubmit = async (newNickname) => {
    if (!newNickname.trim()) {
      setBackendError('Введите новый никнейм');
      setSuccessMessage('');
      return;
    }

    if (user.login === newNickname.trim()) {
      setBackendError('Никнейм совпадает с текущим');
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

      if (!ok) {
        const errorMessage = data.detail || data.message || JSON.stringify(data) || 'Ошибка обновления никнейма';
        setBackendError(errorMessage);
        return;
      }

      setUser(prev => ({ ...prev, login: newNickname.trim() }));
      setSuccessMessage('Никнейм успешно изменен!');
    } catch (err) {
      console.error('Ошибка:', err);
      setBackendError("Никнейм уже занят");
    } finally {
      setIsLoading(false);
    }
  };

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

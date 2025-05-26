import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ChangeNickname.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProfileAvatar from '../../components/ProfileAvatar';
import ChangeNicknameForm from '../../components/ChangeNicknameForm';

const ChangeNickname = () => {
  const [user, setUser] = useState({
    login: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || data.message || 'Ошибка загрузки данных');
        }

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
      setError('Введите новый никнейм');
      setBackendError('');
      return;
    }

    setIsLoading(true);
    setError('');
    setBackendError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_name: newNickname.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || data.message || 'Ошибка обновления никнейма';
        setBackendError(errorMessage);
        throw new Error(errorMessage);
      }

      setUser(prev => ({ ...prev, login: newNickname.trim() }));
      setSuccessMessage('Никнейм успешно изменен!');
    } catch (err) {
      console.error('Ошибка:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="change-nickname-page">Загрузка...</div>;
  }

  return (
    <div className="change-nickname-page">
      <Header />

      <main className="profile-main-nick container">
        <div className="navigation">
          <Link to='/modeSelection' className="navigation__link">Главная страница</Link>
          <span className="delimeter">-</span>
          <Link to='/Profile' className="navigation__link">Профиль</Link>
          <span className="delimeter">-</span>
          <Link to='/changeNickname' className="navigation__link">Изменить никнейм</Link>
        </div>
        
        <ProfileAvatar login={user.login} />

        <ChangeNicknameForm
          currentNickname={user.login}
          onSubmit={handleNicknameSubmit}
          isLoading={isLoading}
          error={error || backendError}
          successMessage={successMessage}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ChangeNickname;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ChangeNickname.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProfileAvatar from '../../components/ProfileAvatar';
import ChangeNicknameForm from '../../components/ChangeNicknameForm';

const ChangeNickname = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    login: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        navigate('/');
        throw new Error('Token refresh failed');
      }
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      navigate('/');
      throw error;
    }
  };

  const fetchWithTokenRefresh = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.detail === "Token expired") {
          await refreshToken();
          const retryResponse = await fetch(url, {
            ...options,
            credentials: 'include',
          });
          if (!retryResponse.ok) {
            navigate('/');
            throw new Error('Request failed after token refresh');
          }
          return retryResponse;
        }
        throw new Error(errorData.detail || 'Request failed');
      }
      return response;
    } catch (error) {
      if (error.message === 'Token refresh failed') {
        navigate('/');
      }
      throw error;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithTokenRefresh('/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        const data = await response.json();
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
      const response = await fetchWithTokenRefresh('/api/users/me', {
        method: 'PATCH',
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
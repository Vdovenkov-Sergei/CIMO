import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.scss';
import ProfileNavLink from '../../components/ProfileNavLink';
import ProfileHeader from '../../components/ProfileHeader';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    login: 'cinemood_user',
    email: 'cinemood.corp@gmail.com'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
          login: data.user_name || 'cinemood_user',
          email: data.email || 'cinemood.corp@gmail.com'
        });
      } catch (err) {
        console.error('Ошибка:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetchWithTokenRefresh('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      console.error('Ошибка выхода:', err);
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="profile-page">Загрузка...</div>;
  }

  if (error) {
    return <div className="profile-page">Ошибка: {error}</div>;
  }

  return (
    <div className="profile-page">
      <Header />

      <main className="profile-main container">
        <div className="navigation">
          <Link to='/modeSelection' className="navigation__link">Главная страница</Link>
          <span className="delimeter">-</span>
          <Link to='/Profile' className="navigation__link">Профиль</Link>
        </div>

        <ProfileHeader user={user} />

        <nav className="profile-nav">
          <ProfileNavLink to="/myMovies" title="Мои фильмы" />
          <ProfileNavLink 
            to="#" 
            title="Выход" 
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }} 
          />
        </nav>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
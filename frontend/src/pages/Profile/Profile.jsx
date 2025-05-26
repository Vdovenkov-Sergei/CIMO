import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.scss';
import ProfileNavLink from '../../components/ProfileNavLink';
import ProfileHeader from '../../components/ProfileHeader';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    login: 'cinemood_user',
    email: 'cinemood.corp@gmail.com'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me', {
          method: 'GET',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка загрузки данных пользователя');
        }

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
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка выхода');
      }

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
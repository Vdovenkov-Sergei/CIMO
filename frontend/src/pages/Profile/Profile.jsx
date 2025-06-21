import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.scss';
import ProfileNavLink from '../../components/ProfileNavLink';
import ProfileHeader from '../../components/ProfileHeader';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useAuthFetch } from '../../utils/useAuthFetch';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    login: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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
      if (!ok && data.detail.error_code === 'USER_NOT_FOUND') {
        setIsNotFound(true);
      }
      setUser({
        login: data.user_name,
        email: data.email
      });
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await authFetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      navigate('/');
    } catch (err) {
      console.error('Ошибка выхода:', err);
      setError(err.message);
    }
  };

  if (isNotFound) {
    return (
      <div className="error">
        <h1 className='code'>404</h1>
        <h3 className="text">Страница не найдена</h3>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header />

      <main className="profile-main container">
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

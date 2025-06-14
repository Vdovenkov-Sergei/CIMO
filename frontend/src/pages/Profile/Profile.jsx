import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.scss';
import ProfileNavLink from '../../components/ProfileNavLink';
import ProfileHeader from '../../components/ProfileHeader';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useAuthFetch } from '../../utils/useAuthFetch';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    login: 'cinemood_user',
    email: 'cinemood.corp@gmail.com'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { status, ok, data } = await authFetch('/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

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
      await authFetch('/api/auth/logout', {
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

  if (error) {
    return <div className="profile-page">Ошибка: {error}</div>;
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

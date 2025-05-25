import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Profile.scss';
import ProfileNavLink from '../../components/ProfileNavLink';
import ProfileHeader from '../../components/ProfileHeader';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const Profile = () => {
  const user = {
    login: 'cinemood_user',
    email: 'cinemood.corp@gmail.com'
  };
  
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
          <ProfileNavLink to="/" title="Выход" />
        </nav>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
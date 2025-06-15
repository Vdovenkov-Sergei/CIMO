import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileHeader = ({ user }) => {
  return (
    <div className="profile-header">
      <div className="profile-avatar">
        <img 
          src='/person-square.svg' 
          alt="Аватар пользователя" 
          className="profile-avatar__image"
        />
      </div>
      <h2 className="profile-login">@{user.login}</h2>
      <Link to="/changeNickname" className="profile-header__link">
        Изменить никнейм
      </Link>
      
      <section className="profile-section">
        <h3 className="profile-section__title">Персональная информация</h3>
        <div className="profile-info">
          <span className="profile-info__value">Email: {user.email}</span>
        </div>
      </section>
    </div>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired
};

export default ProfileHeader;
import React from 'react';
import { Link } from 'react-router-dom';
import avatarUrl from '../assets/images/person-square.svg';

const ProfileAvatar = ({ login }) => {
  return (
    <div className="profile-header">
      <div className="profile-avatar">
        <img 
          src={avatarUrl} 
          alt="Аватар пользователя" 
          className="profile-avatar__image"
        />
      </div>
      <h2 className="profile-login">@{login}</h2>
    </div>
  );
};

export default ProfileAvatar;
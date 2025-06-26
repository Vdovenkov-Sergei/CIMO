import React from 'react';

const ProfileAvatar = ({ login }) => {
  return (
    <div className="profile-header">
      <div className="profile-avatar">
        <img 
          src='/person-square.svg' 
          alt="Аватар пользователя" 
          className="profile-avatar__image"
        />
      </div>
      <h2 className="profile-login">@{login}</h2>
    </div>
  );
};

export default ProfileAvatar;
import React from 'react';
import eyeSlashIconUrl from '../assets/images/eye-slash.svg';

const UnwatchButton = ({ onClick, alt = "Не просмотрено", className = "" }) => {
  return (
    <button 
      onClick={onClick}
      className={`movie-button movie-button--secondary ${className}`}
      aria-label={alt}
    >
      <img src={eyeSlashIconUrl} alt={alt} />
    </button>
  );
};

export default UnwatchButton;